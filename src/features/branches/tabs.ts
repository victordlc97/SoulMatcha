/**
 * Pestañas de sucursales (patrón WAI-ARIA "tabs" con activación automática).
 * Sin JavaScript todos los paneles quedan visibles y la lista de pestañas oculta: la página sigue
 * siendo útil. Con JavaScript se muestra un panel a la vez.
 */
export function initTabs(root: HTMLElement): void {
  const list = root.querySelector<HTMLElement>('[role="tablist"]');
  const tabs = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  );
  const panels = Array.from(
    root.querySelectorAll<HTMLElement>('[role="tabpanel"]'),
  );
  if (!list || tabs.length === 0 || tabs.length !== panels.length) return;

  list.hidden = false;

  const select = (index: number, focus = false) => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (focus) tabs[index].focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (event) => {
      const last = tabs.length - 1;
      const next: Record<string, number> = {
        ArrowRight: i === last ? 0 : i + 1,
        ArrowLeft: i === 0 ? last : i - 1,
        Home: 0,
        End: last,
      };
      if (event.key in next) {
        event.preventDefault();
        select(next[event.key], true);
      }
    });
  });

  select(0);
}

/** Carga el mapa de Google solo cuando la persona lo pide (no se contacta a terceros antes). */
export function initMapLoaders(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>('[data-map]').forEach((box) => {
    const button = box.querySelector<HTMLButtonElement>('[data-map-load]');
    const src = box.dataset.mapSrc;
    if (!button || !src) return;
    button.hidden = false;
    button.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = src;
      frame.title = box.dataset.mapTitle ?? '';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.allowFullscreen = true;
      box.replaceChildren(frame);
    });
  });
}
