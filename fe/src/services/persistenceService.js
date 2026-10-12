/**
 * Layanan Persistensi Karya Pertunjukan
 * Menggabungkan Local Storage (Offline-first) dan Backend REST API (Laravel Sanctum)
 * Memenuhi kriteria US-05, US-06, dan T-03 (Round-trip save/load)
 */

import { apiClient } from './api';

const STORAGE_KEY = 'wayangverse_my_works_v1';

export const persistenceService = {
  /**
   * Mengambil semua karya tersimpan milik pengguna (Offline cache + Server sync)
   */
  async getMyWorks() {
    try {
      // Coba ambil dari Backend terlebih dahulu
      const res = await apiClient.get('/performances');
      if (res.data && Array.isArray(res.data.data || res.data)) {
        const serverData = res.data.data || res.data;
        // Simpan salinan ke localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
        return serverData;
      }
    } catch (err) {
      console.warn('Backend API offline / unauthenticated, memuat dari local cache:', err);
    }

    // Fallback ke localStorage
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return [];
      }
    }
    return [];
  },

  /**
   * Menyimpan atau memperbarui karya
   */
  async savePerformance(metadata, sceneDataPayload) {
    const isUpdate = Boolean(metadata.id);
    const now = new Date().toISOString();

    const recordToSave = {
      id: metadata.id || `local-${Date.now()}`,
      title: metadata.title.trim(),
      description: metadata.description?.trim() || '',
      story_id: metadata.storyId || null,
      visibility: metadata.visibility || 'public',
      scene_data: sceneDataPayload,
      schema_version: 1,
      updated_at: now,
      created_at: metadata.createdAt || now,
      author: 'Dalang Kreator Muda',
    };

    // 1. Simpan selalu ke Local Storage
    const existing = await this.getLocalWorks();
    let updatedList;
    if (isUpdate) {
      updatedList = existing.map((w) => (w.id === recordToSave.id ? recordToSave : w));
    } else {
      updatedList = [recordToSave, ...existing];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    // 2. Sinkronisasikan ke Server jika online
    try {
      let serverResponse = null;
      if (isUpdate && !String(metadata.id).startsWith('local-')) {
        serverResponse = await apiClient.patch(`/performances/${metadata.id}`, recordToSave);
      } else {
        serverResponse = await apiClient.post('/performances', recordToSave);
        if (serverResponse.data?.id) {
          recordToSave.id = serverResponse.data.id;
          // Perbarui ID lokal dengan ID server
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
        }
      }
      return { success: true, data: recordToSave, syncedWithServer: true };
    } catch (err) {
      // Tetap sukses tersimpan secara lokal
      return {
        success: true,
        data: recordToSave,
        syncedWithServer: false,
        warning: 'Karya berhasil disimpan secara lokal (Backend offline).',
      };
    }
  },

  /**
   * Menghapus karya
   */
  async deletePerformance(id) {
    const existing = await this.getLocalWorks();
    const updated = existing.filter((w) => w.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    try {
      if (!String(id).startsWith('local-')) {
        await apiClient.delete(`/performances/${id}`);
      }
    } catch (e) {
      console.warn('Gagal menghapus di server:', e);
    }
    return true;
  },

  getLocalWorks() {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      return local ? JSON.parse(local) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Data awal bawaan agar galeri tidak kosong saat pertama dibuka
   */
  seedInitialDemoWorks(defaultPerformance) {
    const works = this.getLocalWorks();
    if (works.length === 0 && defaultPerformance) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultPerformance]));
    }
  },
};

export default persistenceService;
