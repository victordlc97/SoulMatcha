# Soul Matcha — Identidad de marca para web

> Fuente: *SOUL MATCHA – Manual de Identidad Gráfica* (39 páginas, elaborado por **ermanito Branding**).
> Este documento resume lo que el manual define y señala lo que **no** define o define de forma inconsistente. Todo lo marcado como ⚠️ requiere confirmación con el cliente o con la agencia antes de diseñar.

---

## 1. Esencia de la marca

| Concepto | Lo que dice el manual |
|---|---|
| Valores principales | **Elegancia** y **lujo** (p. 6) |
| Origen del isotipo | La letra **"S"** de *soul matcha*, usada como elemento gráfico clave (p. 7) |
| Personalidad del logo | "Elegante y lujoso", "personalidad fuerte y poderosa" (p. 9) |
| Ámbitos de uso | Redes sociales, empaque, material POP, banners publicitarios |

**Implicación para la web:** el sitio debe sentirse como una boutique, no como una cafetería genérica. Mucho espacio en blanco, ritmo pausado, fotografía de producto protagonista.

---

## 2. Slogans y frases oficiales

Textos que aparecen literalmente en el manual (no se agregó ninguno):

| Frase | Dónde aparece | Tratamiento tipográfico observado |
|---|---|---|
| **DO IT FOR YOU, *not them*** | p. 2, 21; vaso y tote bag | Mayúsculas en sans + remate en script |
| **I LOVE *you so* MATCHA** | p. 12, 21, 23; vaso, tote, caja, stickers | Juego de palabras *"I love you so much"*. Serif fina + itálica |
| **LIFE IS BETTER WITH *matcha*** | p. 22 | Mayúsculas en sans + "matcha" en script |
| **ENJOY YOUR *matcha*** | p. 22, 23 | Mayúsculas en sans/serif + "matcha" en script |

Patrón constante: **frase en mayúsculas + una palabra clave en script o itálica**. Es la firma verbal de la marca.

> ⚠️ En los mockups (p. 31, 33) la frase aparece como *"I LOVE YOU SO matcha!"* — con signo de exclamación y otro orden de estilos. Definir cuál es la versión canónica para la web.

---

## 3. Logotipo

| Elemento | Especificación |
|---|---|
| Logotipo | *"Soul matcha"* en dos líneas, compuesto en **Snell Roundhand**, inclinado |
| Construcción | Retícula modular `1x`, inclinación de **15°** (p. 8) |
| Isotipo / ícono | Letra **"S"** sola, para espacios reducidos (avatar, favicon, sello) |
| Tamaño mínimo web — logotipo | **80.4 px** de ancho |
| Tamaño mínimo web — ícono | **37.11 px** de ancho |
| Tamaño mínimo impreso | Logotipo 1.10 in · Ícono 0.56 in |

**Usos incorrectos (p. 10):** deformar, cambiar de color, estirar, rotar o modificar el logotipo.

**Versiones de color observadas en aplicaciones:**
- Oliva `#6F6132` sobre fondo crema (portada).
- Dorado `#C6B17C` o blanco sobre café `#584F32`.
- Blanco sobre rosa.

> ⚠️ **Archivos fuente necesarios:** pedir a la agencia el logotipo y el ícono en **SVG** (vectorial). No se debe recrear el logo con la fuente tipográfica en la web: se usa siempre como imagen vectorial.

---

## 4. Elementos gráficos de apoyo (p. 7)

Independientes del logo, para crear juego visual:

1. **Destello de cuatro puntas** (estrella).
2. **Palmera**.
3. **Hoja de monstera**.
4. **"S" caligráfica** (también usada como patrón repetido en empaques y tote bags, p. 33–34).

Uso sugerido en web: patrón de "S" como textura de fondo en secciones puntuales; destello como acento mínimo. Se requieren en **SVG**.

---

## 5. Paleta de colores

### 5.1 Paleta oficial del manual (p. 12)

| Nombre | HEX documentado | RGB | CMYK | Pantone |
|---|---|---|---|---|
| Onion | `#4B4327` ⚠️ | 75 · 67 · 39 | 57 · 53 · 80 · 58 | CF 10853 |
| West Coast | `#584F32` | 88 · 79 · 50 | 54 · 50 · 76 · 49 | P 13-15 C |
| Sundown | `#F6C6D1` | 246 · 198 · 209 | 1 · 31 · 9 · 0 | 496 C |
| Sweet Pink | `#DCB3BC` | 220 · 179 · 188 | 14 · 35 · 18 · 1 | CF 10016 |
| Spanish White | `#DDD2B6` | 221 · 210 · 182 | 16 · 16 · 32 · 1 | P 12-1 C |

### 5.2 Inconsistencias encontradas en el PDF

Extraje los colores reales de los vectores del PDF y **no todos coinciden con lo documentado**:

| Hallazgo | Detalle |
|---|---|
| ⚠️ **Onion** | La muestra pintada en la página es **`#6F6132`** (oliva más claro), pero el texto dice `#4B4327`. El logo de portada también usa `#6F6132`. Lo más probable es que el HEX del texto esté mal. |
| ⚠️ Dorado no documentado | Las frases sobre fondo café usan **`#C6B17C`** (dorado), que no está en la paleta. |
| ⚠️ Crema no documentado | El fondo de portada y mockups es **`#F0EDE5`**, tampoco está en la paleta. |

**Acción:** confirmar con la agencia los tres valores anteriores antes de cerrar los tokens.

### 5.3 Verde matcha `#74A12E` — recomendación de rol

Me pediste opinión sobre hacerlo el color **primario**. Mi postura, con números:

**Contraste WCAG medido:**

| Combinación | Ratio | ¿AA texto normal (4.5)? | ¿AA texto grande / UI (3.0)? |
|---|---|---|---|
| `#74A12E` sobre blanco | 3.05 | ❌ | ✅ |
| `#74A12E` sobre crema `#F0EDE5` | 2.61 | ❌ | ❌ |
| `#74A12E` sobre café `#584F32` | 2.67 | ❌ | ❌ |
| Texto blanco sobre botón `#74A12E` | 3.05 | ❌ | ✅ (solo ≥ 18.66 px bold / 24 px) |

**Conclusión:** `#74A12E` es un excelente color de marca, pero **NO puede ser el color dominante de superficies ni el color de texto/enlaces**. Si lo hacés "primario" en el sentido de *cubrir la mayor parte de la pantalla*, rompés dos cosas:

1. **La identidad:** el manual construye el lujo con café, rosa y beige (incluso dice que los degradados usan café y rosa como predominantes). Un sitio mayormente verde ya no es esta marca.
2. **La accesibilidad:** casi ningún texto pasa contraste sobre o con ese verde.

**Propuesta: el verde es el color de ACCIÓN (primario interactivo), no el color de superficie.** Regla 60-30-10:

| Proporción | Rol | Colores |
|---|---|---|
| **60 %** | Lienzo / fondos | Crema `#F0EDE5`, Spanish White `#DDD2B6` |
| **30 %** | Estructura, bloques de contraste, texto | West Coast `#584F32`, Onion `#6F6132`, rosas `#F6C6D1` / `#DCB3BC` |
| **10 %** | Acción y foco | **Matcha `#74A12E`** (CTAs, estados activos, indicador de scroll, foco) |

Y para texto o enlaces en verde, un **tono derivado más oscuro** solo para accesibilidad:

| Token | HEX | Contraste | Uso |
|---|---|---|---|
| `matcha` | `#74A12E` | — | Fondos de botón con texto grande, íconos, detalles, foco |
| `matcha-ink` | `#4F6F1F` *(derivado técnico, validar con diseño)* | 5.79 sobre blanco · 4.95 sobre crema | Enlaces y texto verde sobre fondos claros |

Así el verde es **el** color que la gente asocia con "hacer algo" en el sitio, y la fotografía de producto (que ya es muy verde, ver p. 21–23) aporta el resto del verde de forma natural.

### 5.4 Otras combinaciones verificadas

| Combinación | Ratio | Uso |
|---|---|---|
| Crema `#F0EDE5` sobre café `#584F32` | 6.96 ✅ | Bloques oscuros con texto claro |
| Café `#584F32` sobre Sundown `#F6C6D1` | 5.40 ✅ | Texto sobre secciones rosas |
| Café `#584F32` sobre Spanish White `#DDD2B6` | 5.42 ✅ | Texto sobre beige |
| Dorado `#C6B17C` sobre café `#584F32` | 3.87 ⚠️ | Solo titulares grandes |
| Blanco sobre Sweet Pink `#DCB3BC` | 1.87 ❌ | Solo logo decorativo, nunca texto |

### 5.5 Degradados (p. 13)

- Predominantes: **café** y **rosa**.
- Secundario: **beige**.
- Muestras observadas: café `#4E462A` → rosa `#E7ADC1` → beige `#DFD3B9`.

### 5.6 Tokens propuestos (borrador)

```css
:root {
  /* Acción */
  --color-matcha:        #74A12E;
  --color-matcha-ink:    #4F6F1F; /* derivado para texto accesible */

  /* Base de marca */
  --color-cream:         #F0EDE5; /* ⚠️ no documentado */
  --color-spanish-white: #DDD2B6;
  --color-onion:         #6F6132; /* ⚠️ manual dice #4B4327 */
  --color-west-coast:    #584F32;
  --color-sundown:       #F6C6D1;
  --color-sweet-pink:    #DCB3BC;
  --color-gold:          #C6B17C; /* ⚠️ no documentado */
}
```

---

## 6. Tipografía

### 6.1 Lo que dice el manual

| Fuente | Rol según el manual | Pesos mostrados |
|---|---|---|
| **Montserrat** | Titulares grandes y en negrita para impacto; también titulares medianos (p. 14) | SemiBold observado en frases |
| **Snell Roundhand** | Complemento para **resaltar una palabra** dentro de una oración; también es la fuente del logo | Regular, Bold |
| **Migra** | Muestra tipográfica (p. 15) — usada en "I LOVE you so MATCHA" | Extralight, Extrabold, Italic |
| **Gordita** | Muestra tipográfica (p. 15) | Regular, Bold |

### 6.2 Inconsistencias

> ⚠️ El texto del manual solo habla de **Montserrat + Snell Roundhand**, pero las páginas de muestra presentan **Snell Roundhand, Migra y Gordita** (Montserrat no tiene página de muestra). Además, en la propuesta de feed aparece **Muoto**.
>
> Las fuentes **Poppins**, **League Spartan**, **ITC Avant Garde** y **Phonk Contrast** se usan solo en la maquetación del propio manual; **no** son fuentes de marca.

**Pregunta para el cliente:** ¿cuál es el sistema tipográfico definitivo para la web? Mi lectura de lo que efectivamente se usa en las piezas es:

| Rol en web | Fuente | Justificación |
|---|---|---|
| Display / titulares editoriales | **Migra** | Es la que da el tono de lujo en "I LOVE you so MATCHA" |
| UI, cuerpo, frases en mayúsculas | **Montserrat** o **Gordita** | Montserrat es la que nombra el texto del manual |
| Palabra acentuada | **Snell Roundhand** | Firma verbal de la marca, con mucha moderación |

### 6.3 Licencias (crítico para web)

Una fuente instalada en la computadora del diseñador **no** da derecho a publicarla en un sitio. Para web se necesita licencia **webfont**.

| Fuente | Disponibilidad | Acción |
|---|---|---|
| Montserrat | Gratuita (SIL Open Font License, Google Fonts) | Ninguna; se autoaloja |
| Snell Roundhand | Comercial (Linotype / Monotype) | Comprar licencia web |
| Migra | Comercial (Pangram Pangram); versión gratuita solo para uso personal | Comprar licencia web |
| Gordita | Comercial | Comprar licencia web |

> ⚠️ Verificar en el sitio de cada fundidora las condiciones vigentes antes de comprar. Si no hay presupuesto de licencias, hay que definir alternativas abiertas (eso es una decisión de diseño, no la tomo aquí).

### 6.4 Reglas tipográficas para la web

- Máximo **3 pesos** en todo el sitio.
- Cuerpo **16 px**, secundario 14 px, meta 12 px; nada por debajo de 12 px.
- Interlineado: titulares 1.1–1.25, cuerpo 1.5–1.6.
- Snell Roundhand **nunca** en párrafos ni en tamaños pequeños: es ilegible.
- Línea de texto ≤ 75 caracteres.

---

## 7. Fotografía y dirección de arte

Observado en las páginas de redes sociales y aplicaciones (p. 18–39):

- **Producto en podios** geométricos (cilindros, arcos) sobre fondos rosas o café, con sombras suaves de hojas.
- **Matcha real** en primer plano: texturas de hielo, espuma, vaso en mano. Aquí vive el verde intenso.
- Moda/lifestyle con prendas en verdes y cafés.
- Superficies limpias, iluminación suave, sin saturación excesiva.

**Productos/aplicaciones mostradas:** bolsa doypack, vasos de papel y plástico, porta-vasos, caja de regalo con moño, caja/estuche, tote bags, servilletas, stickers.

> ⚠️ Para la web se necesitan los **archivos originales** de fotografía en alta resolución y, para el efecto de scroll del hero, idealmente **render 3D o secuencia de imágenes** del producto (ver documento de planeación).

---

## 8. Checklist de material a solicitar al cliente / agencia

- [ ] Logotipo e ícono en SVG (todas las versiones de color).
- [ ] Elementos gráficos de apoyo en SVG (destello, palmera, monstera, "S", patrón).
- [ ] Confirmación del HEX de **Onion** (`#4B4327` vs `#6F6132`).
- [ ] Confirmación de crema `#F0EDE5` y dorado `#C6B17C` como colores oficiales.
- [ ] Aprobación del rol del verde `#74A12E` y del derivado `#4F6F1F`.
- [ ] Sistema tipográfico definitivo + licencias webfont.
- [ ] Versión canónica de cada slogan.
- [ ] Fotografía original en alta resolución.
- [ ] Assets para el hero con scroll (video, secuencia de frames o modelo 3D).
- [ ] Contenido real: menú/productos, precios, ubicación, horarios, redes sociales, contacto.
