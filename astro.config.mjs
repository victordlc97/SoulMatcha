// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Dominio propio (GitHub Pages con soulmatcha.com): el sitio vive en la RAÍZ, sin prefijo.
  // Con `base: '/SoulMatcha'` el CSS y los enlaces darían 404 en el dominio.
  site: 'https://soulmatcha.com',
  output: 'static',
  // Español en la raíz (sin prefijo); inglés en /en/. Astro resuelve `Astro.currentLocale`.
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
