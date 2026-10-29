/**
 * Video del hero. Pesa ~7 MB, así que NO se descarga junto con el resto de la página (en una red
 * lenta competía con el CSS, el JavaScript y las tipografías y retrasaba todo): el <video> nace con
 * preload="none" y solo se pide cuando la pantalla de carga terminó. Mientras tanto se ve el póster.
 *
 * Arranca solo, salvo que la persona haya pedido movimiento reducido (regla de accesibilidad del
 * proyecto) o activado el ahorro de datos (decisión explícita suya). En esos casos queda el póster y
 * el botón ofrece reproducirlo; el video se pide entonces.
 * No se mira el tipo de conexión (`effectiveType`): es una estimación del navegador que suele
 * equivocarse (clasifica como 3g conexiones que van bien) y dejaba sin video a quien sí podía verlo.
 *
 * El botón de pausa cumple WCAG 2.2.2 (todo movimiento de más de 5 s debe poder detenerse).
 * Sin JavaScript queda el póster.
 */

export interface PlaybackContext {
  reducedMotion: boolean;
  /** `navigator.connection.saveData`; `undefined` si el navegador no lo informa (Safari). */
  saveData: boolean | undefined;
}

export function shouldAutoplay({
  reducedMotion,
  saveData,
}: PlaybackContext): boolean {
  return !reducedMotion && !saveData;
}

type NetworkInformation = { saveData?: boolean };

function currentContext(reduced: MediaQueryList): PlaybackContext {
  const connection = (
    navigator as Navigator & { connection?: NetworkInformation }
  ).connection;
  return {
    reducedMotion: reduced.matches,
    saveData: connection?.saveData,
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
