/**
 * El header de cristal es claro (texto café). Sobre el footer oscuro ese texto
 * deja de cumplir contraste, así que mientras el footer toca la barra el header
 * cambia a su variante oscura (`data-surface="dark"`).
 */

/**
 * Margen para un IntersectionObserver que solo "ve" la franja superior de la
 * pantalla que ocupa la barra: el footer cuenta como intersectado en cuanto su
 * borde superior llega a la parte inferior de la barra.
 */
export function surfaceRootMargin(
  viewportHeight: number,
  barBottom: number,
): string {
  const shrink = Math.max(0, viewportHeight - Math.ceil(barBottom));
  return shrink === 0 ? '0px 0px 0px 0px' : `0px 0px -${shrink}px 0px`;
}

export function initHeaderSurface(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  const bar = header?.querySelector<HTMLElement>('.bar');
  const footer = document.querySelector<HTMLElement>('.site-footer');
  if (!header || !bar || !footer || !('IntersectionObserver' in window)) return;

  let observer: IntersectionObserver | undefined;

  const observe = () => {
    observer?.disconnect();
    observer = new IntersectionObserver(
      ([entry]) => {
        header.dataset.surface = entry.isIntersecting ? 'dark' : 'light';
      },
      {
        rootMargin: surfaceRootMargin(
          window.innerHeight,
          bar.getBoundingClientRect().bottom,
        ),
      },
    );
    observer.observe(footer);
  };

  observe();
  // La altura de la barra cambia entre móvil y escritorio.
  window.addEventListener('resize', observe);
}
