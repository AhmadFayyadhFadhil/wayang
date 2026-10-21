/**
 * Wayangverse Global Loading Service
 * Memungkinkan seluruh modul (StageStudio, MyWorks, Atlas, Archive)
 * memicu layar pemuatan kultural autentik Wayang Gatotkaca secara reaktif
 */

export function triggerWayangLoading({ message = 'MEMUAT... MOHON SABAR', subtitle = '', duration = 1800, onComplete = null } = {}) {
  if (typeof window === 'undefined') return;
  
  const event = new CustomEvent('wayang-show-loading', {
    detail: {
      message,
      subtitle,
      duration,
      onComplete,
    },
  });
  window.dispatchEvent(event);
}

export function hideWayangLoading() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('wayang-hide-loading'));
}
