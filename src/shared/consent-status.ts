import { readConsent } from './consent';

/**
 * Página de cookies: muestra la elección actual y permite cambiarla.
 * Las etiquetas vienen del HTML (`data-label-*`), ya traducidas según el idioma de la página.
 */
export function initConsentStatus(): void {
  const status = document.querySelector<HTMLElement>('[data-consent-status]');

  const render = () => {
    if (!status) return;
    const choice = readConsent();
    status.textContent =
      (choice === 'accepted'
        ? status.dataset.labelAccepted
        : choice === 'essential'
          ? status.dataset.labelEssential
          : status.dataset.labelNone) ?? '';
  };

  render();
  document.addEventListener('sm:consent-change', render);
  document
    .querySelector('[data-consent-reset]')
    ?.addEventListener('click', () =>
      document.dispatchEvent(new CustomEvent('sm:consent-reset')),
    );
}
