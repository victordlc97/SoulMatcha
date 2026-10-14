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
