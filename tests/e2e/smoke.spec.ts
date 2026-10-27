import { expect, test } from '@playwright/test';

test('la portada carga con el lienzo crema y el enlace de salto', async ({
  page,
  browserName,
}) => {
  await page.goto('./');
  await expect(page).toHaveTitle('Soul Matcha');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Life is better with',
  );

  const bg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(bg).toBe('rgb(240, 237, 229)');

  // Safari no enfoca enlaces con Tab por defecto (requiere Option+Tab o un ajuste
  // del usuario), así que este chequeo solo es válido fuera de WebKit.
  if (browserName === 'webkit') return;

  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Ir al contenido' }),
  ).toBeFocused();
});

test('los íconos de pestaña respetan el base y existen', async ({ page }) => {
  await page.goto('./');
  const hrefs = await page
    .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
    .evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs).toEqual([
    '/SoulMatcha/favicon.ico',
    '/SoulMatcha/icon-192.png',
    '/SoulMatcha/apple-touch-icon.png',
  ]);
  for (const href of hrefs) {
    const res = await page.request.get(href!);
    expect(res.status(), href!).toBe(200);
  }
});

test('el header flota con vidrio y reparte la navegación a ambos lados del logo', async ({
  page,
}) => {
  await page.goto('./');
  const nav = page.getByRole('navigation', { name: 'Principal' });
  await expect(nav.getByRole('link', { name: 'Producto' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Nosotros' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Sucursales' })).toBeVisible();

  const box = await nav.boundingBox();
  const header = await page.locator('.site-header').boundingBox();
  // Suspendido: separado del borde superior, no pegado.
  expect(box!.y).toBeGreaterThan(0);
  expect(header!.y).toBeGreaterThan(0);

  const hasBlur = await nav.evaluate((el) => {
    const s = getComputedStyle(el);
    return `${s.backdropFilter} ${s.getPropertyValue('-webkit-backdrop-filter')}`;
  });
  expect(hasBlur).toContain('blur');
});

test('el header usa cristal oscuro sobre el hero y claro sobre crema y sobre el footer rosa', async ({
  page,
}) => {
  await page.goto('./');
  const header = page.locator('.site-header');
  const link = page
    .getByRole('navigation', { name: 'Principal' })
    .getByRole('link', { name: 'Producto' });

  // Sobre el hero (foto oscura): texto crema.
  await expect(header).toHaveAttribute('data-surface', 'dark');
  await expect(link).toHaveCSS('color', 'rgb(240, 237, 229)');
  // El logo visible es el blanco (el café quedaría a 2.9:1 sobre el cristal oscuro).
  await expect(page.locator('.site-header .on-dark')).toHaveCSS('opacity', '1');
  await expect(page.locator('.site-header .on-light')).toHaveCSS(
    'opacity',
    '0',
  );

  // Sobre "Nosotros" (lienzo crema): texto café.
  await page.evaluate(() =>
    window.scrollTo(0, document.getElementById('nosotros')!.offsetTop + 200),
  );
  await expect(header).toHaveAttribute('data-surface', 'light');
  await expect(link).toHaveCSS('color', 'rgb(88, 79, 50)');
  // Y aquí el café/oliva.
  await expect(page.locator('.site-header .on-light')).toHaveCSS(
    'opacity',
    '1',
  );
  await expect(page.locator('.site-header .on-dark')).toHaveCSS('opacity', '0');

  // Sobre el footer (rosa, claro): sigue el cristal claro con texto café.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(header).toHaveAttribute('data-surface', 'light');
  await expect(link).toHaveCSS('color', 'rgb(88, 79, 50)');
});

test('el footer iguala el rosa del logo y usa texto blanco', async ({
  page,
}) => {
  await page.goto('./');
  const footer = page.getByRole('contentinfo');
  await expect(footer).toHaveCSS('background-color', 'rgb(220, 178, 188)');
  await expect(footer.getByRole('link', { name: 'Cookies' })).toHaveCSS(
    'color',
    'rgb(255, 255, 255)',
  );
});

test('el hero ocupa la pantalla completa', async ({ page }) => {
  await page.goto('./');
  const hero = await page.locator('section.hero').boundingBox();
  const viewport = page.viewportSize()!;
  expect(hero!.height).toBeGreaterThanOrEqual(viewport.height - 1);
});

test('la foto del hero y el logo del footer cargan de verdad', async ({
  page,
}) => {
  await page.goto('./');
  const hero = page.locator('section.hero img');
  await expect(hero).toHaveAttribute('fetchpriority', 'high');
  await expect
    .poll(() => hero.evaluate((el: HTMLImageElement) => el.naturalWidth))
    .toBeGreaterThan(0);

  const logo = page.getByRole('contentinfo').getByRole('img', {
    name: 'Soul matcha',
  });
  await logo.scrollIntoViewIfNeeded();
  await expect
    .poll(() => logo.evaluate((el: HTMLImageElement) => el.naturalWidth))
    .toBeGreaterThan(0);
});

test('el footer tiene legal, mapa del sitio y espacio para el logo', async ({
  page,
}) => {
  await page.goto('./');
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('navigation', { name: 'Legal' })).toBeVisible();
  await expect(
    footer.getByRole('navigation', { name: 'Mapa del sitio' }),
  ).toBeVisible();
  await expect(
    footer.getByRole('link', { name: 'Aviso de privacidad' }),
  ).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Cookies' })).toBeVisible();
  await expect(footer.locator('.wordmark')).toBeVisible();
});

test('no hay desbordamiento horizontal en móvil', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('./');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('los dos botones del hero llevan a la galería (rosa) y a la página de sucursales', async ({
  page,
}) => {
  await page.goto('./');
  const hero = page.locator('section.hero');
  await expect(
    hero.getByRole('link', { name: 'Conoce Soul Matcha' }),
  ).toHaveAttribute('href', '/SoulMatcha/#producto');
  await hero.getByRole('link', { name: 'Ver sucursales' }).click();
  await expect(page).toHaveURL(/\/sucursales\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Sucursales',
  );
});

test('la pantalla de carga se oculta al terminar y no vuelve a aparecer en la sesión', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('data-loader', 'done', {
    timeout: 8000,
  });
  await expect(page.locator('.loader')).toBeHidden();

  // Segunda carga en la misma sesión: ya viene oculto desde el primer pintado.
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-loader', 'done');
});

test('la página de tokens no se indexa y resuelve los valores desde el CSS', async ({
  page,
}) => {
  await page.goto('./tokens/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    /noindex/,
  );
  await expect(page.locator('[data-token="--color-onion"]')).toHaveText(
    '#6F6132',
  );
  await expect(page.locator('[data-token="--color-matcha"]')).toHaveText(
    '#74A12E',
  );
});

test('con movimiento reducido las transiciones se anulan', async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('./tokens/');
  const duration = await page
    .locator('a.button')
    .evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(parseFloat(duration)).toBeLessThan(0.001);
  await context.close();
});

test('el aviso de cookies aparece, se recuerda la elección y se puede reabrir desde /cookies/', async ({
  page,
}) => {
  await page.goto('./');
  const banner = page.getByRole('region', { name: 'Preferencias de cookies' });
  await expect(banner).toBeVisible();

  await banner.getByRole('button', { name: 'Aceptar' }).click();
  await expect(banner).toBeHidden();

  // La elección persiste entre cargas.
  await page.reload();
  await expect(banner).toBeHidden();

  // Y se puede cambiar desde la página de cookies.
  await page.goto('./cookies/');
  await expect(page.locator('[data-consent-status]')).toHaveText('Aceptar');
  await page.getByRole('button', { name: 'Cambiar mi elección' }).click();
  await expect(banner).toBeVisible();
  await expect(page.locator('[data-consent-status]')).toHaveText('Sin elegir');
});

test('las páginas legales existen y el footer enlaza a ellas', async ({
  page,
}) => {
  await page.goto('./');
  const legal = page
    .getByRole('contentinfo')
    .getByRole('navigation', { name: 'Legal' });
  await legal.getByRole('link', { name: 'Aviso de privacidad' }).click();
  await expect(page).toHaveURL(/\/privacidad\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Aviso de privacidad',
  );

  await page.goto('./cookies/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cookies');
});

test('el footer ordena mapa, logo y redes/sucursales de izquierda a derecha', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  const x = async (selector: string) =>
    (await page.locator(selector).first().boundingBox())!.x;
  const sitemap = await x('.site-footer .sitemap');
  const logo = await x('.site-footer .wordmark');
  const connect = await x('.site-footer .connect');
  expect(sitemap).toBeLessThan(logo);
  expect(logo).toBeLessThan(connect);
});

test('la barra del header es delgada y en escritorio no muestra el botón de menú', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  const bar = await page.locator('nav.bar').boundingBox();
  expect(bar!.height).toBeLessThanOrEqual(70);
  await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeHidden();
});

test('en móvil el menú es un panel lateral que se abre, se cierra con Esc y navega', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('./');

  // Una sola fila delgada: no crece como antes (eran ~125 px con dos filas).
  const bar = await page.locator('nav.bar').boundingBox();
  expect(bar!.height).toBeLessThanOrEqual(70);

  const toggle = page.getByRole('button', { name: 'Abrir menú' });
  const menu = page.getByRole('dialog', { name: 'Menú principal' });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('nav.bar .links.start')).toBeHidden();

  await toggle.click();
  await expect(menu).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  for (const name of ['Producto', 'Nosotros', 'Sucursales']) {
    await expect(menu.getByRole('link', { name })).toBeVisible();
  }

  // Esc cierra y devuelve el foco al botón.
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();

  // Un enlace del panel navega y cierra el panel.
  await toggle.click();
  await menu.getByRole('link', { name: 'Sucursales' }).click();
  await expect(page).toHaveURL(/\/sucursales\/$/);
  await expect(menu).toBeHidden();
});

test.describe('versión en inglés', () => {
  test('la portada en inglés declara el idioma, traduce la interfaz y enlaza a la versión en español', async ({
    page,
  }) => {
    await page.goto('./en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Life is better with',
    );

    const nav = page.getByRole('navigation', { name: 'Main' });
    for (const name of ['Product', 'About us', 'Locations']) {
      await expect(nav.getByRole('link', { name })).toBeVisible();
    }

    const hero = page.locator('section.hero');
    await expect(
      hero.getByRole('link', { name: 'Discover Soul Matcha' }),
    ).toHaveAttribute('href', '/SoulMatcha/en/#producto');
    await expect(
      hero.getByRole('link', { name: 'See locations' }),
    ).toHaveAttribute('href', '/SoulMatcha/en/branches/');

    // Buscadores: cada versión apunta a la otra.
    const alternates = await page
      .locator('link[rel="alternate"]')
      .evaluateAll((els) =>
        els.map(
          (e) => `${e.getAttribute('hreflang')} ${e.getAttribute('href')}`,
        ),
      );
    expect(alternates).toEqual([
      'es https://victordlc97.github.io/SoulMatcha/',
      'en https://victordlc97.github.io/SoulMatcha/en/',
      'x-default https://victordlc97.github.io/SoulMatcha/',
    ]);
  });

  test('el selector de idioma lleva a la MISMA página en el otro idioma, en ambos sentidos', async ({
    page,
  }) => {
    await page.goto('./sucursales/');
    await page
      .getByRole('navigation', { name: 'Principal' })
      .getByRole('link', { name: 'Read this site in English' })
      .click();
    await expect(page).toHaveURL(/\/en\/branches\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Locations',
    );

    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'Ver el sitio en español' })
      .click();
    await expect(page).toHaveURL(/\/sucursales\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Sucursales',
    );
  });

  test('las páginas legales y el aviso de cookies existen en inglés', async ({
    page,
  }) => {
    await page.goto('./en/privacy/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Privacy notice',
    );

    await page.goto('./en/cookies/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cookies');
    const banner = page.getByRole('region', { name: 'Cookie preferences' });
    await expect(banner).toBeVisible();
    await banner.getByRole('button', { name: 'Accept' }).click();
    await expect(banner).toBeHidden();
    await expect(page.locator('[data-consent-status]')).toHaveText('Accept');
  });

  test('el footer en inglés está traducido y enlaza a las páginas legales en inglés', async ({
    page,
  }) => {
    await page.goto('./en/');
    const footer = page.getByRole('contentinfo');
    await expect(
      footer.getByRole('navigation', { name: 'Sitemap' }),
    ).toBeVisible();
    await expect(footer.getByText('All rights reserved.')).toBeVisible();
    await expect(
      footer.getByRole('link', { name: 'Privacy notice' }),
    ).toHaveAttribute('href', '/SoulMatcha/en/privacy/');
  });
});

test.describe('sucursales', () => {
  test('hay una pestaña por sucursal, en orden, y cada una muestra su dirección', async ({
    page,
  }) => {
    await page.goto('./sucursales/');
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveText(['Roma Norte', 'Monte Athos', 'Cancún']);
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByText('Tabasco 151')).toBeVisible();
    await expect(page.getByText('Monte Athos 130')).toBeHidden();

    await tabs.nth(1).click();
    await expect(page.getByText('Monte Athos 130')).toBeVisible();
    await expect(page.getByText('Tabasco 151')).toBeHidden();

    await tabs.nth(2).click();
    await expect(page.getByText('Próxima apertura')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ver mapa' })).toBeHidden();
  });

  test('las flechas del teclado cambian de pestaña', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName === 'webkit', 'Safari no enfoca con Tab ni clic');
    await page.goto('./sucursales/');
    const first = page.getByRole('tab').first();
    await first.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Monte Athos' })).toBeFocused();
    await expect(
      page.getByRole('tab', { name: 'Monte Athos' }),
    ).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('End');
    await expect(page.getByRole('tab', { name: 'Cancún' })).toBeFocused();
  });

  test('el mapa de Google no se carga hasta pulsar "Ver mapa"', async ({
    page,
  }) => {
    const google: string[] = [];
    page.on('request', (r) => {
      if (r.url().includes('google.com')) google.push(r.url());
    });
    await page.goto('./sucursales/');
    await page.waitForLoadState('networkidle');
    expect(google).toEqual([]);
    await expect(page.locator('iframe')).toHaveCount(0);

    await page.getByRole('button', { name: 'Ver mapa' }).first().click();
    const frame = page.locator('iframe');
    await expect(frame).toHaveCount(1);
    await expect(frame).toHaveAttribute(
      'src',
      /google\.com\/maps\?.*19\.4194586/,
    );
    await expect(frame).toHaveAttribute(
      'title',
      'Mapa de Soul Matcha Roma Norte',
    );
  });

  test('cada sucursal abierta enlaza a su ficha de Google Maps', async ({
    page,
  }) => {
    await page.goto('./sucursales/');
    await expect(
      page.getByRole('link', { name: 'Abrir en Google Maps' }).first(),
    ).toHaveAttribute('href', 'https://maps.app.goo.gl/s1cHzrmcoWVeWFN57');
    await page.getByRole('tab', { name: 'Monte Athos' }).click();
    await expect(
      page.getByRole('link', { name: 'Abrir en Google Maps' }).first(),
    ).toHaveAttribute('href', 'https://maps.app.goo.gl/kRCnGnks8XAHm8Sh6');
  });

  test('en inglés las pestañas y los textos están traducidos', async ({
    page,
  }) => {
    await page.goto('./en/branches/');
    await expect(
      page.getByRole('tablist', { name: 'Choose a location' }),
    ).toBeVisible();
    await page.getByRole('tab', { name: 'Cancún' }).click();
    await expect(page.getByText('Opening soon')).toBeVisible();
  });
});

test.describe('galería', () => {
  test('Producto y Proceso muestran fotos reales que cargan', async ({
    page,
  }) => {
    await page.goto('./');
    const product = page.locator('#producto');
    const imgs = product.locator('img');
    expect(await imgs.count()).toBeGreaterThanOrEqual(10);
    await imgs.first().scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        imgs.first().evaluate((el: HTMLImageElement) => el.naturalWidth),
      )
      .toBeGreaterThan(0);
    await expect(
      product.getByRole('heading', { name: 'Proceso' }),
    ).toBeVisible();
  });

  test('Nosotros muestra sus dos fotos', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('#nosotros img')).toHaveCount(2);
  });
});

test('el footer enlaza a Instagram y Uber Eats en pestaña nueva', async ({
  page,
}) => {
  await page.goto('./');
  const footer = page.getByRole('contentinfo');
  const ig = footer.getByRole('link', { name: 'Instagram' });
  await expect(ig).toHaveAttribute(
    'href',
    'https://www.instagram.com/soulmatchamx/',
  );
  await expect(ig).toHaveAttribute('target', '_blank');
  await expect(footer.getByRole('link', { name: 'Uber Eats' })).toHaveAttribute(
    'href',
    /ubereats\.com\/mx\/store\/soul-matcha\//,
  );
});

test('el logo del header deja holgura dentro de la barra', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  const bar = (await page.locator('nav.bar').boundingBox())!;
  const logo = (await page.locator('nav.bar .brand .header').boundingBox())!;
  expect(logo.y - bar.y).toBeGreaterThanOrEqual(6);
  expect(bar.y + bar.height - (logo.y + logo.height)).toBeGreaterThanOrEqual(6);
});
