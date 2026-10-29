import { expect, test } from '@playwright/test';

test('la portada carga con el lienzo crema y el enlace de salto', async ({
  page,
  browserName,
}) => {
  await page.goto('./');
  await expect(page).toHaveTitle('Soul Matcha');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'I love you so',
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

test('el header usa cristal oscuro sobre el hero y la misión, y claro sobre crema', async ({
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

  // Entre "Nosotros" y la banda de misión (café) el cristal sigue claro; al llegar a la banda, oscuro.
  await page.evaluate(() =>
    window.scrollTo(
      0,
      document.querySelector<HTMLElement>('.mission')!.offsetTop,
    ),
  );
  await expect(header).toHaveAttribute('data-surface', 'dark');
  await expect(link).toHaveCSS('color', 'rgb(240, 237, 229)');

  // Al final de la página la banda de misión se mete bajo las esquinas redondeadas del footer y
  // sigue tocando la barra: el cristal queda oscuro (texto crema), legible sobre café y sobre rosa.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(header).toHaveAttribute('data-surface', 'dark');
  await expect(link).toHaveCSS('color', 'rgb(240, 237, 229)');
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

test('el video del hero es mudo, en bucle, sin controles nativos y con póster; el logo del footer carga', async ({
  page,
}) => {
  await page.goto('./');
  const video = page.locator('section.hero video');
  await expect(video).toHaveJSProperty('muted', true);
  await expect(video).toHaveJSProperty('loop', true);
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(video).toHaveAttribute('poster', /\/hero\/hero-poster\.webp$/);
  await expect(video.locator('source')).toHaveAttribute(
    'src',
    /\/hero\/hero\.mp4$/,
  );
  // El póster existe y el video también (404 sería un hero vacío).
  for (const url of ['hero/hero-poster.webp', 'hero/hero.mp4']) {
    const res = await page.request.get(`/SoulMatcha/${url}`);
    expect(res.status(), url).toBe(200);
  }

  const logo = page.getByRole('contentinfo').getByRole('img', {
    name: 'Soul matcha',
  });
  await logo.scrollIntoViewIfNeeded();
  await expect
    .poll(() => logo.evaluate((el: HTMLImageElement) => el.naturalWidth))
    .toBeGreaterThan(0);
});

test('con movimiento reducido el video no arranca solo y el botón permite reproducirlo', async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('./');
  const video = page.locator('section.hero video');
  const toggle = page.getByRole('button', { name: 'Reproducir video' });
  await expect(toggle).toBeVisible();
  await expect(video).toHaveJSProperty('paused', true);
  await context.close();
});

test('el botón del hero ofrece pausar el video y volver a reproducirlo (WCAG 2.2.2)', async ({
  page,
}) => {
  await page.goto('./');
  const video = page.locator('section.hero video');
  const pause = page.getByRole('button', { name: 'Pausar video' });
  // El video arranca solo (mudo): el botón ofrece pausarlo.
  await expect(pause).toBeVisible();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(false);

  await pause.click();
  await expect(video).toHaveJSProperty('paused', true);
  const play = page.getByRole('button', { name: 'Reproducir video' });
  await expect(play).toBeVisible();

  await play.click();
  await expect(video).toHaveJSProperty('paused', false);
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

test('los dos botones del hero llevan a Nosotros (rosa) y a la página de sucursales', async ({
  page,
}) => {
  await page.goto('./');
  const hero = page.locator('section.hero');
  await expect(
    hero.getByRole('link', { name: 'Conoce Soul Matcha' }),
  ).toHaveAttribute('href', '/SoulMatcha/#nosotros');
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
      'I love you so',
    );

    const nav = page.getByRole('navigation', { name: 'Main' });
    for (const name of ['Product', 'About us', 'Locations']) {
      await expect(nav.getByRole('link', { name })).toBeVisible();
    }

    const hero = page.locator('section.hero');
    await expect(
      hero.getByRole('link', { name: 'Discover Soul Matcha' }),
    ).toHaveAttribute('href', '/SoulMatcha/en/#nosotros');
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
    await expect(tabs).toHaveText([
      'Roma Norte',
      'Lomas de Chapultepec',
      'Anima Village Los Cabos',
      'Cancún',
    ]);
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByText('Tabasco 151')).toBeVisible();
    await expect(page.getByText('Monte Athos 130')).toBeHidden();

    await tabs.nth(1).click();
    await expect(page.getByText('Monte Athos 130')).toBeVisible();
    await expect(page.getByText('Tabasco 151')).toBeHidden();

    await tabs.nth(2).click();
    await expect(
      page.getByText('Dentro de la plaza Anima Village'),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ver mapa' })).toBeVisible();

    await tabs.nth(3).click();
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
    const lomas = page.getByRole('tab', { name: 'Lomas de Chapultepec' });
    await expect(lomas).toBeFocused();
    await expect(lomas).toHaveAttribute('aria-selected', 'true');
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
    await page.getByRole('tab', { name: 'Lomas de Chapultepec' }).click();
    await expect(
      page.getByRole('link', { name: 'Abrir en Google Maps' }).first(),
    ).toHaveAttribute('href', 'https://maps.app.goo.gl/kRCnGnks8XAHm8Sh6');
    await page.getByRole('tab', { name: 'Anima Village Los Cabos' }).click();
    await expect(
      page.getByRole('link', { name: 'Abrir en Google Maps' }).first(),
    ).toHaveAttribute('href', 'https://maps.app.goo.gl/M9Ak4akvjXmZF6SU6');
  });

  test('cada sucursal con horario lo muestra', async ({ page }) => {
    await page.goto('./sucursales/');
    const panel = page.getByRole('tabpanel');
    await expect(panel.getByText('Lunes a jueves')).toBeVisible();
    await expect(panel.getByText('9:30 am – 6:30 pm')).toBeVisible();
    await expect(panel.getByText('Viernes a domingo')).toBeVisible();
    await expect(panel.getByText('10:00 am – 7:00 pm')).toBeVisible();

    await page.getByRole('tab', { name: 'Lomas de Chapultepec' }).click();
    await expect(panel.getByText('Lunes a domingo')).toBeVisible();

    // Los Cabos aún no tiene horario confirmado: no se inventa uno.
    await page.getByRole('tab', { name: 'Anima Village Los Cabos' }).click();
    await expect(page.getByRole('heading', { name: 'Horario' })).toBeHidden();
  });

  test('en inglés las pestañas y los textos están traducidos', async ({
    page,
  }) => {
    await page.goto('./en/branches/');
    await expect(
      page.getByRole('tablist', { name: 'Choose a location' }),
    ).toBeVisible();
    await expect(page.getByText('Monday to Thursday')).toBeVisible();
    await page.getByRole('tab', { name: 'Cancún' }).click();
    await expect(page.getByText('Opening soon')).toBeVisible();
  });
});

test.describe('fotos integradas en las secciones', () => {
  test('el orden de la página es Nosotros, Origen, Producto y Misión (sin galería suelta)', async ({
    page,
  }) => {
    await page.goto('./');
    const tops = await page.evaluate(() =>
      ['#nosotros', '#origen', '#producto', '.mission'].map(
        (sel) => (document.querySelector(sel) as HTMLElement).offsetTop,
      ),
    );
    expect([...tops].sort((a, b) => a - b)).toEqual(tops);
    await expect(page.locator('main > section')).toHaveCount(5); // hero + 4
  });

  test('Producto y Origen muestran carriles de fotos reales que cargan', async ({
    page,
  }) => {
    await page.goto('./');
    for (const [id, min] of [
      ['#producto', 8],
      ['#origen', 8],
    ] as const) {
      const imgs = page.locator(`${id} [data-lightbox] img`);
      expect(await imgs.count(), id).toBeGreaterThanOrEqual(min);
      await imgs.first().scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          imgs.first().evaluate((el: HTMLImageElement) => el.naturalWidth),
        )
        .toBeGreaterThan(0);
    }
  });

  test('Nosotros muestra sus dos fotos', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('#nosotros img')).toHaveCount(2);
  });

  test('los botones del carril lo desplazan', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('./');
    const rail = page.locator('#producto [data-rail]');
    await rail.scrollIntoViewIfNeeded();
    const track = rail.locator('[data-rail-track]');
    const next = rail.getByRole('button', { name: 'Ver más fotos' });
    const prev = rail.getByRole('button', { name: 'Ver fotos anteriores' });
    await expect(prev).toBeDisabled();
    await next.click();
    await expect
      .poll(() => track.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(100);
    await expect(prev).toBeEnabled();
  });

  test('al pasar el mouse por una foto, las demás se atenúan', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('./');
    const photos = page.locator('#producto [data-lightbox]');
    await photos.nth(1).scrollIntoViewIfNeeded();
    const li = (n: number) => photos.nth(n).locator('xpath=ancestor::li');
    await expect(li(0)).toHaveCSS('opacity', '1');
    await photos.nth(1).hover();
    await expect(li(1)).toHaveCSS('opacity', '1');
    await expect(li(0)).toHaveCSS('opacity', '0.5');
    await expect(li(2)).toHaveCSS('opacity', '0.5');
    // El icono de ampliar aparece solo en la foto elegida.
    await expect(photos.nth(1).locator('.zoom')).toHaveCSS('opacity', '1');
    await expect(photos.nth(0).locator('.zoom')).toHaveCSS('opacity', '0');
  });

  test('un clic amplía la foto, las flechas recorren el grupo y Esc devuelve el foco', async ({
    page,
    browserName,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('./');
    const photos = page.locator('#producto [data-lightbox]');
    await photos.nth(1).scrollIntoViewIfNeeded();
    await photos.nth(1).click();

    const dialog = page.getByRole('dialog', { name: 'Foto ampliada' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('2 / 8')).toBeVisible();
    await expect(dialog.locator('img')).toHaveAttribute('src', /_image|_astro/);

    await dialog.getByRole('button', { name: 'Foto siguiente' }).click();
    await expect(dialog.getByText('3 / 8')).toBeVisible();
    await page.keyboard.press('ArrowLeft');
    await expect(dialog.getByText('2 / 8')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    // Safari no devuelve el foco con clic en botones (ver CLAUDE.md).
    if (browserName !== 'webkit') await expect(photos.nth(1)).toBeFocused();
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

test.describe('contenido del deck de mayoreo', () => {
  test('el slogan del hero es "I love you so matcha" y no se pega al leerlo', async ({
    page,
  }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'I love you so matcha',
    );
    // El texto accesible conserva los espacios entre renglones.
    const text = await page
      .locator('#hero-title')
      .evaluate((el) => el.textContent?.replace(/\s+/g, ' ').trim());
    expect(text).toBe('I love you so matcha');
  });

  test('la portada cuenta el origen del matcha y la misión, con texto real', async ({
    page,
  }) => {
    await page.goto('./');
    const origin = page.locator('#origen');
    await expect(
      origin.getByRole('heading', { name: '¿De dónde viene nuestro matcha?' }),
    ).toBeVisible();
    await expect(origin.getByText('Uji, Japón').first()).toBeVisible();

    const about = page.locator('#nosotros');
    await expect(about.getByText('casa de matcha refinada')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(
      'pendiente de contenido',
    );

    await expect(page.locator('.mission')).toContainText(
      'hacer el matcha accesible',
    );
  });

  test('el header cambia a cristal oscuro sobre la sección de origen', async ({
    page,
  }) => {
    await page.goto('./');
    await page.evaluate(() =>
      window.scrollTo(0, document.getElementById('origen')!.offsetTop + 100),
    );
    await expect(page.locator('.site-header')).toHaveAttribute(
      'data-surface',
      'dark',
    );
  });

  test('Wholesale está en el menú, abre su página y muestra el correo de contacto', async ({
    page,
  }) => {
    await page.goto('./');
    await page
      .getByRole('navigation', { name: 'Principal' })
      .getByRole('link', { name: 'Wholesale' })
      .click();
    await expect(page).toHaveURL(/\/wholesale\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Wholesale y alianzas',
    );
    await expect(
      page.getByRole('link', { name: 'cami@soulmatcha.co' }),
    ).toHaveAttribute('href', 'mailto:cami@soulmatcha.co');
    await expect(page.getByText('5 kilogramos')).toBeVisible();
  });

  test('Wholesale existe en inglés y el selector de idioma lleva a la misma página', async ({
    page,
  }) => {
    await page.goto('./wholesale/');
    await page
      .getByRole('navigation', { name: 'Principal' })
      .getByRole('link', { name: 'Read this site in English' })
      .click();
    await expect(page).toHaveURL(/\/en\/wholesale\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Wholesale and partnerships',
    );
    await expect(page.getByText('5 kilograms')).toBeVisible();
  });

  test('ninguna página publica precios (la lista de precios del deck se omitió)', async ({
    page,
  }) => {
    for (const path of ['./', './wholesale/', './en/', './en/wholesale/']) {
      await page.goto(path);
      const text = await page.locator('body').innerText();
      expect(text, path).not.toMatch(/\$\s?\d|\d\s?(MXN|USD|pesos)/i);
      expect(text, path).not.toMatch(/priced|más caro|precio/i);
    }
  });
});

test('el mapa del sitio del footer no repite Sucursales, que tiene su propio bloque', async ({
  page,
}) => {
  await page.goto('./');
  const footer = page.getByRole('contentinfo');
  const sitemap = footer.getByRole('navigation', { name: 'Mapa del sitio' });
  await expect(sitemap.getByRole('link')).toHaveText([
    'Inicio',
    'Nosotros',
    'Producto',
    'Wholesale',
  ]);
  // El enlace a las sucursales sigue en el bloque de la derecha.
  await expect(
    footer.getByRole('link', { name: 'Ver ubicaciones' }),
  ).toHaveAttribute('href', '/SoulMatcha/sucursales/');
});

test('en escritorio el slogan ocupa el espacio del hero sin chocar con el arco ni con la barra', async ({
  page,
}) => {
  for (const [width, height] of [
    [1024, 768],
    [1280, 720],
    [1440, 900],
    [1920, 1080],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto('./');
    const slogan = (await page.locator('.slogan').boundingBox())!;
    const arch = (await page.locator('section.hero .media').boundingBox())!;
    const bar = (await page.locator('nav.bar').boundingBox())!;
    const label = `${width}x${height}`;
    // Respeta al menos 24 px de aire frente al arco y no sube hasta la barra.
    expect(slogan.x + slogan.width, label).toBeLessThanOrEqual(arch.x - 24);
    expect(slogan.y, label).toBeGreaterThanOrEqual(bar.y + bar.height + 16);
    // Y aprovecha el espacio: el renglón más ancho ("MATCHA") llena buena parte de la columna.
    const free = arch.x - slogan.x - 24;
    expect(slogan.width, label).toBeGreaterThan(free * 0.45);
  }
});

test.describe('hero premium', () => {
  test('el slogan entra por renglones tras la pantalla de carga y termina visible', async ({
    page,
  }) => {
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('data-loader', 'done', {
      timeout: 8000,
    });
    const spans = page.locator('.slogan span');
    // Cada renglón tiene su animación (escalonada)…
    const names = await spans.evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).animationName),
    );
    for (const name of names) expect(name).not.toBe('none');
    const delays = await spans.evaluateAll((els) =>
      els.map((el) => parseFloat(getComputedStyle(el).animationDelay)),
    );
    expect(delays[0]).toBeLessThan(delays[1]);
    expect(delays[1]).toBeLessThan(delays[2]);
    // …y al terminar todo se ve.
    for (const i of [0, 1, 2]) {
      await expect(spans.nth(i)).toHaveCSS('opacity', '1', { timeout: 4000 });
    }
  });

  test('con movimiento reducido no hay animación de entrada y el slogan se ve de inmediato', async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('./');
    const spans = page.locator('.slogan span');
    for (const i of [0, 1, 2]) {
      await expect(spans.nth(i)).toHaveCSS('animation-name', 'none');
      await expect(spans.nth(i)).toHaveCSS('opacity', '1');
    }
    await context.close();
  });

  test('los tres renglones del slogan quedan alineados a la izquierda (sin sangría)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('./');
    const xs = await page
      .locator('.slogan span')
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().x));
    expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(1);
  });

  test('no hay arco de línea detrás del video', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('./');
    await expect(page.locator('section.hero .ring')).toHaveCount(0);
  });

  test('prueba de color pedida: hero rosa con slogan blanco y botones legibles', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('./');
    const hero = page.locator('section.hero');
    await expect(hero).toHaveCSS('background-color', 'rgb(220, 178, 188)');
    await expect(page.locator('.slogan')).toHaveCSS(
      'color',
      'rgb(255, 255, 255)',
    );
    // El botón principal no puede ser rosa sobre rosa: va en café con texto crema.
    const primary = hero.getByRole('link', { name: 'Conoce Soul Matcha' });
    await expect(primary).toHaveCSS('background-color', 'rgb(88, 79, 50)');
    await expect(primary).toHaveCSS('color', 'rgb(240, 237, 229)');
  });
});
