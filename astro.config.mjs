// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://victordlc97.github.io',
  base: '/SoulMatcha',
  output: 'static',
  // Español en la raíz (sin prefijo); inglés en /en/. Astro resuelve `Astro.currentLocale`.
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
