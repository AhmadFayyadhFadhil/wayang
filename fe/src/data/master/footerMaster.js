/**
 * Master Data Konfigurasi Footer & Tim Pengembang Wayangverse
 * -------------------------------------------------------------
 * Menyediakan data bawaan (default), fungsi pembacaan, dan penyimpanan
 * berbasis dual-layer persistence (LocalStorage & Live Custom Event)
 * yang terintegrasi langsung dengan Admin CMS Balai Kurasi.
 */

const STORAGE_FOOTER_TEAM_KEY = 'wayangverse_footer_team';

export const DEFAULT_DEVELOPER_PROFILES = [
  {
    id: 'fadhil',
    name: 'Ahmad Fayyadh Fadhil',
    role: 'Lead Developer & Software Architect',
    badge: 'LEAD ARCHITECT',
    username: 'fadhillllll15',
    url: 'https://www.instagram.com/fadhillllll15?dlrf=cTJ4dGNvbHFtb2t0',
    avatar: '', // URL gambar atau Data URL Base64 yang diunggah via Admin
    bio: 'Arsitek sistem panggung kelir virtual, sinkronisasi state React 19, dan integrasi full-stack multi-layer.',
  },
  {
    id: 'skywalker',
    name: 'Raffi Akbar / Skywalker',
    role: 'UI/UX Designer & Project Lead',
    badge: 'LEAD DESIGNER',
    username: '_.skywalkerr',
    url: 'https://www.instagram.com/_.skywalkerr?cplk=dHE0MGp5MHl5cTkx',
    avatar: '',
    bio: 'Perancang estetika visual Nusantara, orkestrasi pengalaman panggung kelir, dan riset pakem pedalangan.',
  },
  {
    id: 'haycell',
    name: 'Haycell',
    role: 'Frontend & Interactive Audio Engineer',
    badge: 'AUDIO ENGINEER',
    username: 'haycell._',
    url: 'https://www.instagram.com/haycell._?rpxt=cDg5dDkwODI3c3Jw',
    avatar: '',
    bio: 'Spesialis sintesis soundscape gamelan prosedural Web Audio API dan pergerakan wayang 60 FPS.',
  },
];

/**
 * Membaca data tim pengembang dari LocalStorage (atau fallback default)
 */
export const getFooterTeam = () => {
  try {
    const saved = localStorage.getItem(STORAGE_FOOTER_TEAM_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Gagal memuat pengaturan tim footer dari storage:', err);
  }
  return DEFAULT_DEVELOPER_PROFILES;
};

/**
 * Menyimpan data tim pengembang ke LocalStorage dan memicu event sinkronisasi real-time
 */
export const saveFooterTeam = (teamList) => {
  try {
    localStorage.setItem(STORAGE_FOOTER_TEAM_KEY, JSON.stringify(teamList));
    window.dispatchEvent(new Event('wayangverse_footer_updated'));
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (err) {
    console.error('Gagal menyimpan tim footer:', err);
    return false;
  }
};

/**
 * Mengembalikan data tim pengembang ke konfigurasi bawaan (default)
 */
export const resetFooterTeam = () => {
  try {
    localStorage.removeItem(STORAGE_FOOTER_TEAM_KEY);
    window.dispatchEvent(new Event('wayangverse_footer_updated'));
    window.dispatchEvent(new Event('storage'));
    return DEFAULT_DEVELOPER_PROFILES;
  } catch (err) {
    console.error('Gagal mereset tim footer:', err);
    return DEFAULT_DEVELOPER_PROFILES;
  }
};
