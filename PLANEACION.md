# Soul Matcha — Planeación técnica del sitio web

> Documento complementario de [IDENTIDAD-DE-MARCA.md](IDENTIDAD-DE-MARCA.md).
> Estado: **fase 1, planeación**. Stack aprobado.

---

## 1. Objetivo

Construir un sitio de marca **premium** para Soul Matcha que:

- Se aloje inicialmente en **GitHub Pages**, que solo sirve archivos estáticos.
- Pueda migrar a **Vercel** sin reescribir nada.
- Tenga un **hero con animación ligada al scroll** como pieza protagonista.
- Respete el manual: elegancia y lujo, paleta café/rosa/beige y el verde matcha como color de acción.

---

## 2. Stack aprobado

| Capa | Tecnología | Rol |
|---|---|---|
| Framework | **Astro** (salida `static`) | Genera HTML/CSS por página y envía JS solo donde se necesita (islas) |
| Animación | **GSAP + ScrollTrigger** | Timeline del hero y revelados puntuales ligados al scroll |
| Scroll suave | **Lenis** | Inercia suave, sincronizada con ScrollTrigger |
| Estilos | **CSS nativo + custom properties (tokens)** | Un archivo de tokens como única fuente de verdad del diseño |
| Lenguaje | **TypeScript** | Tipado en scripts del hero y utilidades |
| Imágenes | `astro:assets` (`<Image>` / `<Picture>`) | Optimización a AVIF/WebP en tiempo de build |
| Tipografías | Autoalojadas (`.woff2`) | Sin dependencia de CDNs externos; necesario para fuentes con licencia |
| Calidad | Prettier, ESLint, Stylelint | Formato y reglas consistentes |
| Pruebas | **Vitest** (lógica) + **Playwright** (e2e y visual) + Lighthouse | Ver sección 9 |
| CI/CD | GitHub Actions → GitHub Pages | Build y deploy en cada push a `main` |

### ¿Por qué esto no nos limita para Vercel?

Un build estático de Astro es una carpeta `dist/` con HTML, CSS, JS e imágenes. **Vercel la despliega sin adaptador** y detecta Astro de forma automática. El adaptador `@astrojs/vercel` solo hace falta si en el futuro se necesita algo del lado del servidor: formularios con lógica, API routes o renderizado on-demand. Y en ese caso se agrega sin tocar componentes.

La única configuración que cambia al migrar es `base` (ver sección 7).

---

## 3. Restricciones de GitHub Pages (y cómo las resolvemos)

| Restricción | Impacto | Solución |
|---|---|---|
| Solo archivos estáticos | No hay backend, ni API, ni SSR | Astro en modo `static` |
| Repo de proyecto se sirve en `/SoulMatcha/` | Rutas absolutas rotas | `base: '/SoulMatcha'` en config y enlaces con `import.meta.env.BASE_URL` |
| Sin cabeceras HTTP personalizadas | No se pueden ajustar caché ni CSP por cabecera | Nombres con hash (Astro lo hace) y CSP vía `<meta>` si se requiere |
| Formularios | No hay servidor que los reciba | Servicio externo (Formspree, Web3Forms) o un enlace a WhatsApp/correo. **Decisión pendiente** |
| Límite de sitio de ~1 GB y ancho de banda "suave" | La secuencia de frames del hero pesa | Presupuesto de peso estricto (sección 5.4) |

---

## 4. Arquitectura del proyecto

Organización **por funcionalidad** (screaming architecture): al abrir `src/` se ve de qué trata el sitio y no solo qué tipo de archivos contiene.

```
SoulMatcha/
├── .github/workflows/deploy.yml     # CI/CD a GitHub Pages
├── public/
│   ├── fonts/                       # .woff2 autoalojadas
│   ├── hero/frames/                 # secuencia del hero (desktop/ y mobile/)
│   └── favicon.svg                  # ícono "S"
├── src/
│   ├── features/
│   │   ├── hero/
│   │   │   ├── Hero.astro           # marcado + fallback estático
│   │   │   ├── hero-sequence.ts     # lógica canvas + ScrollTrigger
│   │   │   └── frame-math.ts        # funciones puras (testeables)
│   │   ├── products/                # catálogo / menú
│   │   ├── story/                   # historia de marca, slogans
│   │   ├── gallery/                 # fotografía / feed
│   │   └── contact/                 # ubicación, horario, redes
│   ├── shared/
│   │   ├── components/              # Button, Logo, SectionTitle…
│   │   ├── motion/
│   │   │   ├── smooth-scroll.ts     # init Lenis + sync GSAP
│   │   │   └── reduced-motion.ts    # detección prefers-reduced-motion
│   │   └── assets/                  # SVG de marca (logo, destello, monstera…)
│   ├── styles/
│   │   ├── tokens.css               # color, tipografía, espaciado, motion
│   │   ├── fonts.css                # @font-face
│   │   └── global.css               # reset + base
│   ├── layouts/BaseLayout.astro     # <head>, SEO, fuentes, smooth scroll
│   ├── content/                     # productos y textos en Markdown/JSON (Content Collections)
│   └── pages/
│       └── index.astro
├── tests/
│   ├── unit/                        # Vitest
│   └── e2e/                         # Playwright
├── astro.config.mjs
├── IDENTIDAD-DE-MARCA.md
├── PLANEACION.md
└── INSTALACION.md
```

**Reglas:**

- Una funcionalidad no importa desde otra funcionalidad; lo compartido vive en `shared/`.
- La lógica pura (cálculos de frames, progresos, interpolaciones) va separada de la que toca el DOM, para poder testearla.
- Los textos y los productos viven en `content/`, no dentro de los componentes. Así cambiar un precio no implica tocar código.

---

## 5. El hero con scroll

### 5.1 Concepto

El hero queda **fijo** (`pin`) mientras el usuario hace scroll, y el scroll controla una animación del producto. Por ejemplo, la bolsa doypack que gira, se abre y deja ver el matcha. Al terminar la secuencia aparece el slogan y el sitio continúa.

### 5.2 Técnicas evaluadas

| Técnica | Calidad visual | Peso | Complejidad | Veredicto |
|---|---|---|---|---|
| **Secuencia de imágenes en `<canvas>`** | Máxima, control frame a frame | Alto (se controla con presupuesto) | Media | ✅ **Elegida** |
| Video con `currentTime` ligado al scroll | Buena | Bajo | Baja | Fallback alternativo; en iOS el scrubbing de video es poco fluido si el video no tiene keyframes densos |
| Three.js con modelo 3D | Máxima e interactiva | Medio-alto | Alta | Descartada para v1; requiere modelo 3D que la marca no tiene |
| Solo capas CSS/SVG con parallax | Media | Mínimo | Baja | Insuficiente para "premium" |

### 5.3 Funcionamiento

1. `Hero.astro` renderiza un `<canvas>` y, debajo, una **imagen estática del primer frame** (LCP rápido y fallback sin JS).
2. `hero-sequence.ts` precarga los frames en orden de prioridad: primero el 1, luego uno de cada 10, y después el resto.
3. ScrollTrigger con `pin: true` y `scrub: true` mapea el progreso del scroll (0 → 1) al índice del frame.
4. Cada actualización dibuja el frame en el canvas respetando `devicePixelRatio` y *object-fit: cover*.
5. Lenis aporta la inercia; ScrollTrigger se actualiza en cada evento de Lenis.

```ts
// shared/motion/smooth-scroll.ts — patrón de sincronización
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### 5.4 Presupuesto de rendimiento

| Recurso | Desktop | Móvil |
|---|---|---|
| Frames | 120–150 | 60–75 (uno de cada dos) |
| Resolución | 1920 × 1080 | 1080 × 1350 (vertical) |
| Formato | WebP (o AVIF) calidad ~70 | WebP |
| Peso total de la secuencia | ≤ 6 MB | ≤ 3 MB |
| Peso inicial antes de interactuar | ≤ 500 KB | ≤ 300 KB |

Metas Lighthouse (móvil): **Performance ≥ 90, Accesibilidad 100, SEO 100**. LCP < 2.5 s, CLS < 0.1.

### 5.5 Accesibilidad del hero

- Con `prefers-reduced-motion: reduce` **no** se fija el hero ni se anima: se muestra una imagen estática con el slogan.
- Lenis se desactiva también con movimiento reducido.
- El canvas lleva `aria-hidden="true"` y el contenido significativo (titular y CTA) está en HTML real.
- El hero debe poder saltarse con teclado (enlace "Ir al contenido").

### 5.6 Origen de los frames

> ⚠️ **Dependencia crítica.** El manual no incluye este material. Opciones:
> 1. **Render 3D** del empaque (Blender/Cinema 4D) exportado como secuencia PNG y convertido a WebP. Es la mejor calidad.
> 2. **Video** de producto filmado y extraído a frames con `ffmpeg`.
> 3. Mientras tanto se desarrolla con una **secuencia placeholder** para no bloquear el código.

```bash
ffmpeg -i hero.mp4 -vf "fps=30,scale=1920:-1" -c:v libwebp -quality 70 public/hero/frames/desktop/%04d.webp
```

---

## 6. Sistema de diseño (tokens)

`src/styles/tokens.css` es la **única** fuente de valores de diseño. Ningún componente usa un HEX o un tamaño "a mano".

| Grupo | Contenido |
|---|---|
| Color | Paleta de marca + `matcha` / `matcha-ink` + roles semánticos (`--surface-canvas`, `--text-primary`, `--action`) |
| Tipografía | Familias, escala modular (tercera menor), 3 pesos, interlineados |
| Espaciado | Escala de 4/8 px |
| Layout | Anchos máximos de contenedor, márgenes laterales (16 px en móvil) |
| Motion | Duraciones y curvas (`--ease-out-soft`, etc.) |

Los componentes consumen **roles semánticos** (`--action`), no nombres de paleta (`--color-matcha`). Si mañana cambia el color de acción, se cambia en un solo lugar.

---

## 7. Configuración de despliegue

### 7.1 GitHub Pages (inicio)

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://<usuario>.github.io',
  base: '/SoulMatcha',
  output: 'static',
});
```

- En el repo: **Settings → Pages → Source: GitHub Actions**.
- Workflow `.github/workflows/deploy.yml` con la acción oficial `withastro/action` y `actions/deploy-pages` (ver [INSTALACION.md](INSTALACION.md)).

### 7.2 Migración a Vercel (futuro)

1. Importar el repo en Vercel; detecta Astro automáticamente.
2. Cambiar `site` al dominio final y **eliminar `base`** (Vercel sirve desde la raíz).
3. Configurar el dominio propio y las cabeceras (caché, CSP) en `vercel.json` si hace falta.
4. Solo si se necesita servidor: `npx astro add vercel`.

> Por eso **todo enlace interno** debe construirse con `import.meta.env.BASE_URL`: así el cambio de `base` no rompe nada.

### 7.3 Dominio propio

Si se usa un dominio propio en GitHub Pages, también se elimina `base` y se agrega `public/CNAME`. Conviene decidirlo pronto, porque cambia las URLs canónicas y el SEO.

---

## 8. Secciones del sitio (propuesta inicial)

| # | Sección | Contenido | Dependencia |
|---|---|---|---|
| 1 | Hero con scroll | Producto + slogan principal | Frames del hero |
| 2 | Historia / esencia | Elegancia y lujo, origen de la "S" | Texto del cliente |
| 3 | Productos / menú | Bebidas, polvo de matcha, merch | Catálogo y precios |
| 4 | Frases de marca | Slogans del manual como piezas tipográficas | — |
| 5 | Galería | Fotografía estilo feed | Fotos originales |
| 6 | Visítanos / contacto | Ubicación, horario, redes, WhatsApp | Datos del cliente |
| 7 | Footer | Logo, redes, aviso de privacidad | — |

> El orden y el alcance final se validan con el cliente. ¿Es una sola página (landing) o un sitio con varias páginas? **Decisión pendiente.**

---

## 9. Estrategia de pruebas

| Tipo | Herramienta | Qué cubre |
|---|---|---|
| Unitarias | Vitest | Funciones puras: `progress → frameIndex`, cálculo de *cover* en canvas, orden de precarga |
| End-to-end | Playwright | El sitio carga, la navegación funciona y el hero se fija y avanza al hacer scroll |
| Movimiento reducido | Playwright con `reducedMotion: 'reduce'` | Se muestra el fallback estático |
| Visual | Capturas de Playwright en 375 / 768 / 1280 px | Regresiones de layout |
| Rendimiento y accesibilidad | Lighthouse (local y en CI) | Presupuestos de la sección 5.4 |

Desarrollo con **TDD** en la lógica pura: primero la prueba de `frame-math.ts` y después la implementación.

---

## 10. Fases de trabajo

| Fase | Entregable | Criterio de "terminado" |
|---|---|---|
| **0. Setup** | Proyecto Astro, linters, tests, CI y deploy de "hola mundo" a Pages | URL pública funcionando |
| **1. Fundamentos** | `tokens.css`, fuentes, `BaseLayout`, componentes base, logo SVG | Página de muestra de tokens validada contra el manual |
| **2. Hero** | Secuencia en canvas + ScrollTrigger + Lenis + fallback | 60 fps en desktop, presupuesto de peso respetado, reduced-motion OK |
| **3. Secciones** | Secciones 2–7 con contenido real | Responsive de 375 a 1440 px |
| **4. Pulido** | Revelados puntuales, microinteracciones, SEO, Open Graph | Lighthouse ≥ 90 / 100 / 100 |
| **5. QA y lanzamiento** | Pruebas e2e completas, revisión del cliente | Aprobación del cliente |
| **6. (Futuro) Vercel** | Migración + dominio | Sitio en dominio final |

---

## 11. Decisiones pendientes

- [ ] Sistema tipográfico definitivo y compra de licencias webfont.
- [ ] Confirmación de colores (Onion, crema, dorado) — ver IDENTIDAD-DE-MARCA.md §5.2.
- [ ] Origen de los frames del hero (render 3D vs video).
- [ ] Landing de una página vs sitio multipágina.
- [ ] Manejo de formularios / contacto sin backend.
- [ ] Dominio propio desde el inicio o subruta de GitHub Pages.
- [ ] Idioma(s) del sitio (los slogans están en inglés; ¿el resto en español?).
- [ ] Analítica (y su aviso de privacidad / consentimiento).
