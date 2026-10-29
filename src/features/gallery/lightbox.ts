/**
 * Ampliación de fotos: un único <dialog> modal por página (ver Lightbox.astro). Cada foto es un
 * botón con `data-lightbox="<grupo>"`, `data-full` (URL grande) y `data-alt`; las flechas recorren
 * las fotos del mismo grupo. El <dialog> nativo atrapa el foco, cierra con Esc y devuelve el foco
 * al botón que lo abrió.
 */

/** Índice siguiente (o anterior, con delta negativo) dando la vuelta en los extremos. */
export function stepIndex(
  current: number,
  delta: number,
  length: number,
): number {
  if (length <= 0) return 0;
  return (((current + delta) % length) + length) % length;
}

export function initLightbox(): void {
  const dialog = document.querySelector<HTMLDialogElement>(
    '[data-lightbox-dialog]',
  );
  if (!dialog) return;
  const img = dialog.querySelector<HTMLImageElement>('[data-lightbox-img]')!;
  const count = dialog.querySelector<HTMLElement>('[data-lightbox-count]')!;
  const prev = dialog.querySelector<HTMLButtonElement>('[data-lightbox-prev]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-lightbox-next]')!;

  let group: HTMLElement[] = [];
  let index = 0;

  const show = (i: number) => {
    index = i;
    const trigger = group[i];
    img.src = trigger.dataset.full ?? '';
    img.alt = trigger.dataset.alt ?? '';
    count.textContent = `${i + 1} / ${group.length}`;
    const single = group.length < 2;
    prev.hidden = single;
    next.hidden = single;
  };

  document.addEventListener('click', (event) => {
    const trigger = (event.target as Element).closest<HTMLElement>(
      '[data-lightbox]',
    );
    if (!trigger) return;
    const name = trigger.dataset.lightbox;
    group = Array.from(
      document.querySelectorAll<HTMLElement>(`[data-lightbox="${name}"]`),
    );
    show(group.indexOf(trigger));
    dialog.showModal();
  });

  prev.addEventListener('click', () =>
    show(stepIndex(index, -1, group.length)),
  );
  next.addEventListener('click', () => show(stepIndex(index, 1, group.length)));
  dialog
    .querySelector('[data-lightbox-close]')!
    .addEventListener('click', () => dialog.close());

  // Clic fuera de la foto (en el fondo del diálogo) cierra.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('keydown', (event) => {
    if (group.length < 2) return;
    if (event.key === 'ArrowLeft') show(stepIndex(index, -1, group.length));
    if (event.key === 'ArrowRight') show(stepIndex(index, 1, group.length));
  });

  dialog.addEventListener('close', () => {
    img.removeAttribute('src');
  });
}
