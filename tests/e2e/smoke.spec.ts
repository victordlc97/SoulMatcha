import { expect, test } from '@playwright/test';

test('la portada carga con el lienzo crema y el enlace de salto', async ({
  page,
  browserName,
}) => {
  await page.goto('./');
  await expect(page).toHaveTitle('Soul Matcha');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Soul Matcha',
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

test('el favicon respeta el base del sitio', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    'href',
    '/SoulMatcha/favicon.svg',
  );
});

test('el header flota con vidrio y reparte la navegación a ambos lados del logo', async ({
  page,
}) => {
  await page.goto('./');
  const nav = page.getByRole('navigation', { name: 'Principal' });
  await expect(nav.getByRole('link', { name: 'Galería' })).toBeVisible();
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

test('el hero ocupa la pantalla completa', async ({ page }) => {
  await page.goto('./');
  const hero = await page.locator('section.hero').boundingBox();
  const viewport = page.viewportSize()!;
  expect(hero!.height).toBeGreaterThanOrEqual(viewport.height - 1);
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
