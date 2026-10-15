// Genera los íconos de pestaña a partir del isotipo (src/shared/assets/iso.png).
// Uso: npm run icons   (volver a correrlo si cambia el isotipo)
//
// El isotipo es una "S" alta y ROSA con fondo transparente: sobre una pestaña clara del navegador
// (el caso más común) casi desaparece (~1.2:1). Por eso se coloca sobre una pastilla café de marca.
// El apple-touch-icon va a sangre (iOS aplica sus propias esquinas). El .ico incluye 16/32/48 px
// como PNG embebidos.
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SRC = 'src/shared/assets/iso.png';
const OUT = 'public';
const BROWN = { r: 0x58, g: 0x4f, b: 0x32, alpha: 1 }; // --color-west-coast
const PAD = 0.16; // margen alrededor de la S, como fracción del lienzo
const RADIUS = 0.22; // esquinas de la pastilla, como fracción del lienzo

async function tile(size, { rounded = true } = {}) {
  const inner = Math.round(size * (1 - PAD * 2));
  const glyph = await sharp(SRC)
    .resize({ width: inner, height: inner, fit: 'inside' })
    .png()
    .toBuffer();
  const base = await sharp({
    create: { width: size, height: size, channels: 4, background: BROWN },
  })
    .composite([{ input: glyph, gravity: 'center' }])
    .png()
    .toBuffer();
  if (!rounded) return base;
  const r = Math.round(size * RADIUS);
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}"/></svg>`,
  );
  return sharp(base)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** .ico con imágenes PNG embebidas (válido en todos los navegadores actuales). */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // tipo: ícono
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size === 256 ? 0 : size, 0);
    e.writeUInt8(size === 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); // planos
    e.writeUInt16LE(32, 6); // bits por píxel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const sizes = [16, 32, 48];
const images = [];
for (const size of sizes) images.push({ size, data: await tile(size) });
writeFileSync(`${OUT}/favicon.ico`, ico(images));

writeFileSync(`${OUT}/icon-192.png`, await tile(192));
writeFileSync(`${OUT}/icon-512.png`, await tile(512));
writeFileSync(
  `${OUT}/apple-touch-icon.png`,
  await tile(180, { rounded: false }),
);

console.log(
  'Íconos generados en public/: favicon.ico, icon-192.png, icon-512.png, apple-touch-icon.png',
);
