import type { ImageMetadata } from 'astro';

/**
 * GALERÍA. Cada categoría es una carpeta (`producto/`, `proceso/`, `historia/`) y TODA foto que se
 * suelte dentro aparece sola, ordenada por nombre. Así las fotos nuevas del cliente (producto en
 * otras presentaciones) solo se agregan a su carpeta, sin tocar código ni pelearse con las demás.
 * Para una categoría nueva: crear la carpeta y añadir su nombre a `GalleryCategory` y a `ui.ts`.
 */
export type GalleryCategory = 'producto' | 'proceso' | 'historia';

const modules = import.meta.glob<{ default: ImageMetadata }>(
  './*/*.{jpg,jpeg,png,webp}',
  { eager: true },
);

/** Valores de las entradas cuya ruta está directamente dentro de `./<categoría>/`, en orden natural. */
export function pickCategory<T>(
  entries: Record<string, T>,
  category: GalleryCategory,
): T[] {
  const prefix = `./${category}/`;
  return Object.keys(entries)
    .filter((path) => path.startsWith(prefix))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .map((path) => entries[path]);
}

/** Fotos de una categoría, listas para `<Image>`. */
export function galleryImages(category: GalleryCategory): ImageMetadata[] {
  return pickCategory(modules, category).map((m) => m.default);
}
