/**
 * El header de cristal es claro (texto café). Sobre una foto oscura o el footer ese
 * texto deja de cumplir contraste, así que mientras una sección marcada con
 * `data-header-surface="dark"` (hero, footer) toca la barra, el header cambia a su
 * variante oscura (`data-surface="dark"`, texto crema).
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
  // Cualquier sección que declare `data-header-surface="dark"` (hero, footer).
  const darkSections = document.querySelectorAll<HTMLElement>(
    '[data-header-surface="dark"]',
  );
  if (
    !header ||
    !bar ||
    darkSections.length === 0 ||
    !('IntersectionObserver' in window)
  )
    return;

  let observer: IntersectionObserver | undefined;
  const touching = new Set<Element>();

  const observe = () => {
    observer?.disconnect();
    touching.clear();
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) touching.add(entry.target);
          else touching.delete(entry.target);
        }
        header.dataset.surface = touching.size > 0 ? 'dark' : 'light';
      },
      {
        rootMargin: surfaceRootMargin(
          window.innerHeight,
          bar.getBoundingClientRect().bottom,
        ),
      },
    );
    darkSections.forEach((section) => observer!.observe(section));
  };

  observe();
  // La altura de la barra cambia entre móvil y escritorio.
  window.addEventListener('resize', observe);
}
