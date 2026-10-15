/**
 * Panel lateral del menú móvil, sobre un <dialog> modal nativo.
 * El navegador ya se ocupa de atrapar el foco, cerrar con Esc y dejar el resto inerte;
 * aquí solo se conectan el botón, el cierre por clic y el estado de `aria-expanded`.
 *
 * Sin JavaScript no hay menú móvil: los mismos enlaces siguen disponibles en el footer.
 */
export function initMobileMenu(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-menu]');
  const toggle =
    document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  if (!dialog || !toggle || typeof dialog.showModal !== 'function') return;

  const setExpanded = (open: boolean) =>
    toggle.setAttribute('aria-expanded', String(open));

  toggle.addEventListener('click', () => {
    dialog.showModal();
    setExpanded(true);
  });

  // `close` salta con Esc, con dialog.close() y con el botón: un solo lugar para sincronizar.
  // El foco vuelve al botón de forma explícita: Safari no enfoca los botones al hacer clic, así que
  // no tiene un elemento previo que restaurar por su cuenta.
  dialog.addEventListener('close', () => {
    setExpanded(false);
    toggle.focus({ preventScroll: true });
  });

  dialog.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    // Clic en el fondo (el propio <dialog>), en "cerrar", o en cualquier enlace.
    if (
      target === dialog ||
      target.closest('[data-menu-close]') ||
      target.closest('a')
    ) {
      dialog.close();
    }
  });

  // Si la pantalla crece mientras está abierto, la barra ya muestra los enlaces: cerrar.
  window
    .matchMedia('(min-width: 40rem)')
    .addEventListener('change', (event) => {
      if (event.matches && dialog.open) dialog.close();
    });
}
