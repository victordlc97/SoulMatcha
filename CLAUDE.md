# Soul Matcha

Sitio de marca premium (landing) para Soul Matcha. Astro estático + CSS con tokens + TypeScript, en GitHub Pages
(`/SoulMatcha/`), con migración futura a Vercel. Español en la raíz, inglés en `/en/`.

Antes de diseñar, leer: [IDENTIDAD-DE-MARCA.md](IDENTIDAD-DE-MARCA.md) (marca, colores, tipografía),
[PLANEACION.md](PLANEACION.md) (arquitectura, fases) e [INSTALACION.md](INSTALACION.md).

## Comandos

- `astro dev --background` · `astro dev stop` · `astro dev status` (servidor local en `localhost:4321/SoulMatcha/`)
- `npm run build` · `npm run lint` · `npm run check` · `npm test` (Vitest) · `npm run test:e2e` (Playwright)
- `npm run icons`: regenera favicon/íconos desde `src/shared/assets/iso.png`
- **Detener el servidor de desarrollo antes de `test:e2e`**: Playwright reutiliza lo que haya en el puerto 4321 y
  entonces prueba el modo dev, no el build.

## Reglas del proyecto

- **Ningún color, tamaño, duración ni z-index fuera de `src/styles/tokens.css`.** Los componentes usan roles
  semánticos (`--text-primary`, `--action`), no la paleta. Stylelint prohíbe HEX fuera de ese archivo.
- **Todo enlace interno pasa por `withBase()` o `href()`** (`src/shared/url.ts`, `src/i18n`). `BASE_URL` no trae
  barra final: concatenarlo a mano rompe rutas.
- **Todo texto de interfaz va en `src/i18n/ui.ts`, en español E inglés** (el tipo obliga a tener ambos). Las páginas
  legales (prosa larga) tienen una página completa por idioma. Las rutas están traducidas (`src/i18n/routes.ts`).
- **Contraste AA (4.5:1 texto normal, 3:1 grande) medido, no estimado**: sobre píxeles reales y con el contenido
  oculto, usando percentiles (el peor píxel suelto engaña). Valores medidos y su historial están en comentarios de
  `tokens.css`; revalidar si cambia la foto del hero.
- **Respetar `prefers-reduced-motion`** en toda animación.
- Texto y botones sobre fotos: degradado de legibilidad (`--scrim-ink`), no sobre el café de marca (ensucia el verde).
- Verde matcha = color de ACCIÓN, nunca de superficie ni de texto (usar `--color-matcha-ink`).

## Trampas conocidas

- **Astro elimina el espacio entre texto y un elemento inline cuando los separa un salto de línea**
  (`la<a>…` sale pegado; lo lee un lector de pantalla como una palabra). Usar `{' '}` explícito o dejarlo en
  la misma línea. Tras escribir prosa con enlaces, escanear `dist/` buscando `\w<a`, `</a>\w`.
- Un `::before`/`::after` absoluto se pinta DEBAJO de un hermano posicionado posterior: usar `z-index` explícito.
- Safari/WebKit no enfoca enlaces con Tab ni botones al hacer clic: no asumir restauración de foco ni pruebas de Tab.
- Los "SVG" que entrega la agencia pueden ser PNG envueltos (ver `originales/`): comprobar antes de integrar.
- Comandos de shell con texto largo y comillas fallan: crear archivos con la herramienta Write.

## Cómo trabajar

- **Probar a mano y con capturas** (viewport 1440, 1280×720, 768 y 375) además de las pruebas automáticas: pasar tests
  no dice si se ve bien. Las pruebas automáticas se corren **al final** de cada pedido, no durante.
- Commits convencionales (`feat:`, `fix:`, `chore:`), **sin** atribución de IA. Pushear solo si se pide.
- Lógica pura con prueba primero (`url.ts`, `consent.ts`, `i18n/`, `header-surface.ts`).
- Antes de afirmar un dato técnico o un contraste, verificarlo. Si el pedido contradice una regla (accesibilidad,
  manual de marca), decirlo con números y proponer alternativa; la decisión final es del cliente.

## Qué NO va al repositorio (público)

Fuentes comerciales (Migra, Gordita, Snell Roundhand: `public/fonts/*.otf|ttf`), originales pesados (`originales/`)
y carpetas de skills de agentes. Están en `.gitignore`. El `.woff2` licenciado sí puede subirse cuando exista.

## Pendiente del cliente

Direcciones de sucursales · cuentas de redes sociales · responsable y contacto del aviso de privacidad ·
logo en SVG vectorial real (café y blanco) · eslogan canónico · confirmar Onion/crema/dorado · licencias webfont ·
fotos de "Nosotros" y "Producto" · `Sudadera1.jpeg` sin destino. Los textos legales no los ha revisado un abogado.

## Memoria

El historial de decisiones y su porqué está en Engram (proyecto `soulmatcha`; `mem_search`/`mem_context`).
Este archivo contiene solo lo que debe cumplirse SIEMPRE.
