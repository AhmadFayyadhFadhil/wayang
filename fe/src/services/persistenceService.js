/**
 * Layanan Persistensi Karya Pertunjukan
 * Menggabungkan Local Storage (Offline-first per pengguna) dan Backend REST API (Laravel Sanctum)
 * Menjamin isolasi data: Tamu (guest) memiliki 0 karya dan wajib masuk akun untuk menyimpan.
 */

import { apiClient } from './api';

// Bersihkan data global warisan versi lama agar tidak bocor ke tamu
try {
  localStorage.removeItem('wayangverse_my_works_v1');
} catch {
  // safe fallback
}

/**
 * Menghasilkan kunci penyimpanan terisolasi per pengguna
 * @param {Object|null} user Objek pengguna aktif
 * @returns {string|null} Kunci localStorage
 */
const getStorageKey = (user) => {
  if (!user) return null;
  const userKey = user.id || (user.email ? user.email.replace(/[^a-zA-Z0-9]/g, '_') : null);
  return userKey ? `wayangverse_my_works_${userKey}` : null;
};

export const persistenceService = {
  /**
   * Mengambil semua karya tersimpan milik pengguna aktif (Offline cache + Server sync)
   * Tamu (belum login) dijamin mengembalikan array kosong [].
   * @param {Object|null} user Pengguna aktif
   */
  async getMyWorks(user = null) {
    // 1. Jika belum login (tamu), tidak ada karya yang ditampilkan sama sekali
    if (!user) {
      return [];
    }

    const storageKey = getStorageKey(user);

    // 2. Coba sinkronisasi dari Backend Laravel (memerlukan Bearer token Sanctum)
    try {
      const res = await apiClient.get('/performances');
      if (res.data && Array.isArray(res.data.data || res.data)) {
        const serverData = res.data.data || res.data;
        if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(serverData));
        }
        return serverData;
      }
    } catch (err) {
      console.warn('Backend API offline / sesi lokal, memuat dari local cache pengguna:', err?.message || err);
    }

    // 3. Fallback ke localStorage terisolasi milik pengguna
    if (storageKey) {
      const local = localStorage.getItem(storageKey);
      if (local) {
        try {
          return JSON.parse(local);
        } catch {
          return [];
        }
      }
    }

    return [];
  },

  /**
   * Menyimpan atau memperbarui karya lakon
   * Hanya diizinkan untuk pengguna yang telah terautentikasi (login).
   * @param {Object} metadata Metadata karya lakon
   * @param {Object} sceneDataPayload Data adegan, tokoh & tata suara
   * @param {Object|null} user Pengguna aktif
   */
  async savePerformance(metadata, sceneDataPayload, user = null) {
    if (!user) {
      return {
        success: false,
        error: 'Akses Sanggar Dibatasi: Anda wajib masuk atau mendaftar akun dalang untuk menyimpan karya.',
      };
    }

    const storageKey = getStorageKey(user);
    const isUpdate = Boolean(metadata.id);
    const now = new Date().toISOString();

    const recordToSave = {
      id: metadata.id || `local-${Date.now()}`,
      title: metadata.title?.trim() || 'Lakon Wayang Baru',
      description: metadata.description?.trim() || '',
      story_id: metadata.storyId || null,
      visibility: metadata.visibility || 'public',
      scene_data: sceneDataPayload,
      schema_version: 1,
      updated_at: now,
      created_at: metadata.createdAt || now,
      author: user.name || 'Dalang Terdaftar',
      user_id: user.id || null,
    };

    // 1. Simpan selalu ke Local Storage khusus pengguna ini
    if (storageKey) {
      const existing = this.getLocalWorks(user);
      let updatedList;
      if (isUpdate) {
        updatedList = existing.map((w) => (w.id === recordToSave.id ? recordToSave : w));
      } else {
        updatedList = [recordToSave, ...existing];
      }
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
    }

    // 2. Sinkronisasikan ke Server jika online
    try {
      let serverResponse = null;
      if (isUpdate && !String(metadata.id).startsWith('local-')) {
        serverResponse = await apiClient.patch(`/performances/${metadata.id}`, recordToSave);
      } else {
        serverResponse = await apiClient.post('/performances', recordToSave);
        if (serverResponse.data?.id) {
          recordToSave.id = serverResponse.data.id;
          if (storageKey) {
            const currentList = this.getLocalWorks(user);
            const patchedList = currentList.map((item) =>
              item.id === recordToSave.id || item.id === metadata.id ? recordToSave : item
            );
            localStorage.setItem(storageKey, JSON.stringify(patchedList));
          }
        }
      }
      return { success: true, data: recordToSave, syncedWithServer: true };
    } catch (err) {
      console.warn('Backend sinkronisasi gagal, tersimpan aman di offline storage:', err?.message || err);
      return {
        success: true,
        data: recordToSave,
        syncedWithServer: false,
        warning: 'Karya berhasil disimpan di sanggar lokal Anda (Server offline).',
      };
    }
  },

  /**
   * Menghapus karya milik pengguna aktif
   */
  async deletePerformance(id, user = null) {
    if (!user) return false;

    const storageKey = getStorageKey(user);
    if (storageKey) {
      const existing = this.getLocalWorks(user);
      const updated = existing.filter((w) => w.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }

    try {
      if (!String(id).startsWith('local-')) {
        await apiClient.delete(`/performances/${id}`);
      }
    } catch (e) {
      console.warn('Gagal menghapus di server:', e?.message || e);
    }
    return true;
  },

  /**
   * Mendapatkan daftar karya lokal untuk pengguna aktif
   */
  getLocalWorks(user = null) {
    if (!user) return [];
    const storageKey = getStorageKey(user);
    if (!storageKey) return [];

    try {
      const local = localStorage.getItem(storageKey);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  },

  /**
   * Data awal bawaan hanya diisi jika akun dalang baru meminta contoh awal
   */
  seedInitialDemoWorks(defaultPerformance, user = null) {
    if (!user) return; // Tamu tidak pernah diisi karya demo
    const works = this.getLocalWorks(user);
    const storageKey = getStorageKey(user);
    if (works.length === 0 && defaultPerformance && storageKey) {
      localStorage.setItem(storageKey, JSON.stringify([defaultPerformance]));
    }
  },
};

export default persistenceService;
