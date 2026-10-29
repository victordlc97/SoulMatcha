/**
 * Carriles horizontales de fotos (PhotoRail.astro). El desplazamiento es nativo (scroll-snap):
 * funciona con trackpad, dedo y teclado. Con JavaScript se suman los botones anterior/siguiente.
 */

/** Qué botones tienen sentido según la posición del desplazamiento (1 px de tolerancia por subpíxeles). */
export function scrollState(
  scrollLeft: number,
  clientWidth: number,
  scrollWidth: number,
): { prev: boolean; next: boolean } {
  return {
    prev: scrollLeft > 1,
    next: scrollLeft + clientWidth < scrollWidth - 1,
  };
}

export function initRails(): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll<HTMLElement>('[data-rail]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-rail-track]');
    const controls = root.querySelector<HTMLElement>('[data-rail-controls]');
    const prev = root.querySelector<HTMLButtonElement>('[data-rail-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-rail-next]');
    if (!track || !controls || !prev || !next) return;

    const update = () => {
      const state = scrollState(
        Math.abs(track.scrollLeft),
        track.clientWidth,
        track.scrollWidth,
      );
      prev.disabled = !state.prev;
      next.disabled = !state.next;
      // Si todo cabe en pantalla, los botones sobran.
      controls.hidden = !state.prev && !state.next;
    };

    const go = (direction: 1 | -1) =>
      track.scrollBy({
        left: direction * track.clientWidth * 0.8,
        behavior: reduced.matches ? 'auto' : 'smooth',
      });

    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // WebKit puede ejecutar el script antes de aplicar el CSS: el carril se mediría vacío y los
    // botones quedarían ocultos para siempre. Cuando el carril o sus fotos cambian de tamaño, se
    // vuelve a medir (mismo problema y misma solución que header-surface.ts).
    if ('ResizeObserver' in window) {
      const sizes = new ResizeObserver(update);
      sizes.observe(track);
      Array.from(track.children).forEach((item) => sizes.observe(item));
    }
    update();
  });
}
