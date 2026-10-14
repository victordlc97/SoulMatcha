# Soul Matcha — Guía de instalación del entorno

> Entorno: **Windows 11 + Visual Studio Code + Claude Code en la terminal**.
> Stack: **Astro + GSAP/ScrollTrigger + Lenis + CSS con tokens + TypeScript**.
> Contexto técnico: [PLANEACION.md](PLANEACION.md).

---

## 1. Requisitos del sistema

Estado verificado en esta máquina (14/10/2026):

| Herramienta | Requerida | Instalada | Acción |
|---|---|---|---|
| Node.js | LTS (22 o 24) | `v24.14.0` | ✅ Nada |
| npm | Viene con Node | `11.9.0` | ✅ Nada |
| Git | Cualquier versión reciente | `2.53.0` | ✅ Nada |
| GitHub CLI (`gh`) | Recomendado | `2.100.0` | ✅ Nada (verificar sesión, paso 1.1) |
| VS Code | Reciente | `1.106.2` | ✅ Nada |
| FFmpeg | Para generar frames del hero | ❌ No instalado | Instalar (paso 1.2) |

En otra máquina, todo se instala con `winget`:

```bash
winget install OpenJS.NodeJS.LTS Git.Git GitHub.cli Microsoft.VisualStudioCode
```

### 1.1 Iniciar sesión en GitHub CLI

```bash
gh auth status
```

Si no hay sesión activa:

```bash
gh auth login
```

### 1.2 Instalar FFmpeg

```bash
winget install Gyan.FFmpeg
```

Cerrá y volvé a abrir la terminal para que tome el `PATH`, y verificá:

```bash
ffmpeg -version
```

---

## 2. Extensiones de VS Code

| Extensión | ID | Para qué |
|---|---|---|
| Astro | `astro-build.astro-vscode` | Sintaxis, autocompletado y diagnósticos de `.astro` |
| Prettier | `esbenp.prettier-vscode` | Formato automático |
| ESLint | `dbaeumer.vscode-eslint` | Errores de TS/JS en el editor |
| Stylelint | `stylelint.vscode-stylelint` | Reglas de CSS (p. ej., prohibir HEX fuera de `tokens.css`) |
| Playwright Test | `ms-playwright.playwright` | Ejecutar y depurar e2e desde el editor |
| Vitest | `vitest.explorer` | Ejecutar pruebas unitarias desde el editor |
| EditorConfig | `editorconfig.editorconfig` | Finales de línea y sangría consistentes en Windows |
| Error Lens | `usernamehw.errorlens` | Opcional: muestra errores en línea |

Instalarlas todas de una vez:

```bash
code --install-extension astro-build.astro-vscode --install-extension esbenp.prettier-vscode --install-extension dbaeumer.vscode-eslint --install-extension stylelint.vscode-stylelint --install-extension ms-playwright.playwright --install-extension vitest.explorer --install-extension editorconfig.editorconfig
```

---

## 3. Crear el proyecto Astro

El repositorio ya existe y tiene los `.md` de planeación, así que el proyecto se crea **en la carpeta actual**:

```bash
npm create astro@latest . -- --template minimal --install --no-git
```

- `--template minimal`: sin páginas de ejemplo que después haya que borrar.
- TypeScript estricto: las versiones actuales de Astro lo configuran por defecto. Revisá que `tsconfig.json` extienda `astro/tsconfigs/strict` (o `strictest`).
- `--no-git`: el repo ya está inicializado.

> Si el asistente avisa que la carpeta **no está vacía**, confirmá que siga: solo agrega archivos y no toca los `.md`.

Verificar que levanta:

```bash
npm run dev
```

Abrí `http://localhost:4321`.

---

## 4. Dependencias del proyecto

### 4.1 Animación y scroll

```bash
npm install gsap lenis
```

- `gsap` incluye **ScrollTrigger** (se importa desde `gsap/ScrollTrigger`).
- `lenis` es el paquete actual (el antiguo `@studio-freight/lenis` está obsoleto; no usarlo).

### 4.2 Tipografía libre (Montserrat)

```bash
npm install @fontsource-variable/montserrat
```

> Snell Roundhand, Migra y Gordita **no** se instalan por npm: son comerciales. Una vez compradas las licencias webfont, los `.woff2` van en `public/fonts/` y se declaran en `src/styles/fonts.css`.

### 4.3 Calidad de código

```bash
npm install -D prettier prettier-plugin-astro eslint eslint-plugin-astro typescript-eslint stylelint stylelint-config-standard
```

### 4.4 Pruebas

```bash
npm install -D vitest
```

```bash
npm init playwright@latest
```

En el asistente de Playwright elegí: TypeScript, carpeta `tests/e2e`, **no** agregar workflow de GitHub Actions (lo hacemos nosotros) e instalar los navegadores.

---

## 5. Archivos de configuración

### 5.1 `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://<usuario>.github.io',
  base: '/SoulMatcha',
  output: 'static',
});
```

> Reemplazá `<usuario>` por el usuario u organización de GitHub dueña del repo.

### 5.2 `.prettierrc`

```json
{
  "singleQuote": true,
  "plugins": ["prettier-plugin-astro"],
  "overrides": [{ "files": "*.astro", "options": { "parser": "astro" } }]
}
```

### 5.3 `vitest.config.ts`

```ts
/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
  },
});
```

### 5.4 `.editorconfig`

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true
```

### 5.5 `.gitattributes` (evita problemas de CRLF en Windows)

```
* text=auto eol=lf
*.webp binary
*.avif binary
*.woff2 binary
```

### 5.6 `.vscode/settings.json`

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[astro]": { "editor.defaultFormatter": "astro-build.astro-vscode" },
  "css.validate": false,
  "stylelint.validate": ["css", "astro"]
}
```

### 5.7 Scripts en `package.json`

Agregá dentro de `"scripts"`:

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "lint": "eslint . && stylelint \"src/**/*.{css,astro}\"",
  "format": "prettier --write ."
}
```

---

## 6. Despliegue en GitHub Pages

### 6.1 Workflow `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7
      - name: Install, build, and upload
        uses: withastro/action@v6

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

> Versiones tomadas de la guía oficial de Astro (`docs.astro.build/en/guides/deploy/github/`) al 14/10/2026. Antes de copiar, revisá esa página por si hay versiones más nuevas.

### 6.2 Activar Pages en el repositorio

En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

O desde la terminal:

```bash
gh api -X POST repos/{owner}/{repo}/pages -f build_type=workflow
```

### 6.3 Verificar

Después del primer push a `main`:

```bash
gh run watch
```

El sitio queda en `https://<usuario>.github.io/SoulMatcha/`.

---

## 7. Trabajar con Claude Code

1. Abrí la carpeta en VS Code: `code .`
2. Abrí la terminal integrada (`` Ctrl+` ``) y ejecutá `claude`.
3. Primera sesión recomendada: ejecutar `/init` para generar el `CLAUDE.md` del proyecto. Después, agregá a mano estas reglas clave:
   - Leer `IDENTIDAD-DE-MARCA.md` y `PLANEACION.md` antes de diseñar.
   - Ningún color, tamaño ni duración fuera de `src/styles/tokens.css`.
   - Enlaces internos siempre con `import.meta.env.BASE_URL`.
   - Respetar `prefers-reduced-motion` en toda animación.
   - TDD en la lógica pura (`*-math.ts`, utilidades).

> Recordá: **vos dirigís, la IA ejecuta**. Antes de aceptar código del hero, tenés que entender qué hace `scrub`, qué hace `pin` y por qué el canvas necesita `devicePixelRatio`. Si no lo entendés, no lo vas a poder depurar cuando falle en un iPhone.

---

## 8. Checklist de verificación final

- [ ] `npm run dev` levanta en `localhost:4321`.
- [ ] `npm run build` genera `dist/` sin errores.
- [ ] `npm run preview` sirve el build bajo `/SoulMatcha/` sin rutas rotas.
- [ ] `npm test` ejecuta Vitest (aunque todavía no haya pruebas).
- [ ] `npm run test:e2e` abre Playwright.
- [ ] `ffmpeg -version` responde.
- [ ] El primer deploy en GitHub Pages está publicado.
