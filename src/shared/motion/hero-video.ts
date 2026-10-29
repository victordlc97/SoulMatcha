/**
 * Video del hero. Pesa ~7 MB, así que NO se descarga junto con el resto de la página (en una red
 * lenta competía con el CSS, el JavaScript y las tipografías y retrasaba todo): el <video> nace con
 * preload="none" y solo se pide cuando la pantalla de carga terminó. Mientras tanto se ve el póster.
 *
 * No arranca solo (queda el póster y el botón ofrece reproducirlo; el video se pide entonces) si:
 * - la persona pidió movimiento reducido,
 * - activó el ahorro de datos, o
 * - su conexión es lenta (slow-2g, 2g o 3g según el navegador).
 *
 * El botón de pausa cumple WCAG 2.2.2 (todo movimiento de más de 5 s debe poder detenerse).
 * Sin JavaScript queda el póster.
 */

/** Conexiones en las que 7 MB de video no valen la pena. */
const SLOW_CONNECTIONS = ['slow-2g', '2g', '3g'];

export interface PlaybackContext {
  reducedMotion: boolean;
  /** `navigator.connection.saveData`; `undefined` si el navegador no lo informa (Safari). */
  saveData: boolean | undefined;
  /** `navigator.connection.effectiveType`; `undefined` si el navegador no lo informa. */
  effectiveType: string | undefined;
}

export function shouldAutoplay({
  reducedMotion,
  saveData,
  effectiveType,
}: PlaybackContext): boolean {
  if (reducedMotion || saveData) return false;
  return !(effectiveType && SLOW_CONNECTIONS.includes(effectiveType));
}

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

function currentContext(reduced: MediaQueryList): PlaybackContext {
  const connection = (
    navigator as Navigator & { connection?: NetworkInformation }
  ).connection;
  return {
    reducedMotion: reduced.matches,
    saveData: connection?.saveData,
    effectiveType: connection?.effectiveType,
  };
}

/** Ejecuta `fn` cuando terminó la pantalla de carga (o ya había terminado en esta sesión). */
function whenLoaderDone(fn: () => void): void {
  const html = document.documentElement;
  if (html.dataset.loader === 'done') {
    // Ya se vio el loader en esta sesión: no hay pantalla que esperar, pero el video tampoco debe
    // competir con el resto de la carga, así que arranca cuando la página terminó de cargar.
    if (document.readyState === 'complete') fn();
    else window.addEventListener('load', fn, { once: true });
    return;
  }
  window.addEventListener('sm:loader-done', fn, { once: true });
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

  // Con preload="none", play() es lo que dispara la descarga.
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
    if (reduced.matches) video.pause();
  });

  render();
  if (shouldAutoplay(currentContext(reduced)))
    whenLoaderDone(() => void play());
}
