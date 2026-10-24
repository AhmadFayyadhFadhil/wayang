/**
 * AOS (Animate On Scroll) Service untuk Wayangverse
 * Terinspirasi dari pola animasi scroll-entrance pada jobnation.id
 *
 * Fitur:
 * - Menggunakan IntersectionObserver modern (60/120 FPS tanpa jank scroll listener)
 * - Mendukung: fade-up, fade-down, fade-left, fade-right, zoom-in, fade
 * - Mendukung data-aos-delay dan data-aos-duration
 * - Auto-observe via MutationObserver untuk komponen dinamis & navigasi SPA
 * - Kebal Re-render: Menggunakan dual-tagging (class & attribute data-aos-animate)
 *   sehingga kartu tidak pernah hilang saat mouse hover / React state update
 * - Otomatis mengabaikan halaman panggung (Studio Kelir) sesuai arahan pengguna
 * - Fail-soft: jika browser tidak mendukung IntersectionObserver, otomatis membuka seluruh konten
 */

let observerInstance = null;
let mutationObserverInstance = null;

function markElementAnimated(el, delay = 0) {
  const duration = parseInt(el.getAttribute('data-aos-duration') || '700', 10);

  const apply = () => {
    el.classList.add('aos-animate');
    el.setAttribute('data-aos-animate', 'true');

    // Lepaskan lock transform setelah transisi selesai agar hover/tilt kartu bekerja 100% natural
    setTimeout(() => {
      el.setAttribute('data-aos-done', 'true');
    }, duration + 50);
  };

  if (delay > 0) {
    setTimeout(apply, delay);
  } else {
    apply();
  }
}

export function initAOS(options = {}) {
  if (typeof window === 'undefined') return () => {};

  // Fail-soft jika IntersectionObserver tidak tersedia
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-aos]').forEach((el) => {
      markElementAnimated(el, 0);
    });
    return () => {};
  }

  // Bersihkan observer lama jika ada
  if (observerInstance) {
    observerInstance.disconnect();
  }

  const offsetMargin = options.offset ? `0px 0px -${options.offset}px 0px` : '0px 0px -40px 0px';

  observerInstance = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Abaikan jika di dalam Studio Panggung
          if (el.closest('.stage-studio-single-screen-root')) {
            el.removeAttribute('data-aos');
            el.setAttribute('data-aos-animate', 'true');
            el.setAttribute('data-aos-done', 'true');
            observerInstance.unobserve(el);
            return;
          }

          const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
          markElementAnimated(el, delay);

          // Perilaku 'once: true' seperti di jobnation.id
          observerInstance.unobserve(el);
        }
      });
    },
    {
      root: null,
      rootMargin: offsetMargin,
      threshold: options.threshold || 0.08,
    }
  );

  function scanAndObserve() {
    const vh = window.innerHeight || document.documentElement.clientHeight;

    // Scan elemen data-aos yang belum teranimasi
    const uncompletedElements = document.querySelectorAll('[data-aos]:not([data-aos-animate="true"])');

    uncompletedElements.forEach((el) => {
      // Abaikan elemen di dalam Studio Panggung Virtual (halaman panggung)
      if (el.closest('.stage-studio-single-screen-root')) {
        el.removeAttribute('data-aos');
        el.setAttribute('data-aos-animate', 'true');
        el.setAttribute('data-aos-done', 'true');
        return;
      }

      const rect = el.getBoundingClientRect();
      // Jika elemen berada langsung di layar awal (above-the-fold)
      if (rect.top < vh * 0.95 && rect.bottom > 0) {
        const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
        markElementAnimated(el, Math.min(delay, 800));
      } else {
        observerInstance.observe(el);
      }
    });

    // Pastikan elemen yang sudah teranimasi tetap mempertahankan kelas aos-animate jika React me-render ulang
    const animatedElements = document.querySelectorAll('[data-aos-animate="true"]:not(.aos-animate)');
    animatedElements.forEach((el) => {
      el.classList.add('aos-animate');
    });
  }

  scanAndObserve();

  // Pasang MutationObserver agar elemen dinamis / ganti tab langsung teranimasi
  if (!mutationObserverInstance && 'MutationObserver' in window) {
    mutationObserverInstance = new MutationObserver(() => {
      scanAndObserve();
    });
    mutationObserverInstance.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  return () => {
    if (observerInstance) observerInstance.disconnect();
    if (mutationObserverInstance) {
      mutationObserverInstance.disconnect();
      mutationObserverInstance = null;
    }
  };
}

export function refreshAOS() {
  if (observerInstance) {
    const elements = document.querySelectorAll('[data-aos]:not([data-aos-animate="true"])');
    elements.forEach((el) => {
      if (!el.closest('.stage-studio-single-screen-root')) {
        observerInstance.observe(el);
      }
    });
  }
}
