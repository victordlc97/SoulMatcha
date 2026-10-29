/**
 * Video del hero. Solo se reproduce solo si la persona no pidió movimiento reducido; en ese caso
 * queda el póster y el botón ofrece reproducirlo. El botón de pausa cumple WCAG 2.2.2 (todo
 * movimiento de más de 5 s debe poder detenerse). Sin JavaScript queda el póster.
 */
export function shouldAutoplay(reducedMotion: boolean): boolean {
  return !reducedMotion;
}

export function initHeroVideo(): void {
  const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  const toggle =
    document.querySelector<HTMLButtonElement>('[data-hero-toggle]');
  if (!video || !toggle) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const render = () => {
    const paused = video.paused;
    toggle.toggleAttribute('data-paused', paused);
    toggle.setAttribute(
      'aria-label',
      (paused ? toggle.dataset.labelPlay : toggle.dataset.labelPause) ?? '',
    );
  };

  const play = () => video.play().catch(() => undefined);

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    if (video.paused) void play();
    else video.pause();
  });
  video.addEventListener('play', render);
  video.addEventListener('pause', render);

  // Si la preferencia cambia con la página abierta, se respeta.
  reduced.addEventListener('change', () => {
    if (!shouldAutoplay(reduced.matches)) video.pause();
  });

  if (shouldAutoplay(reduced.matches)) void play();
  render();
}
