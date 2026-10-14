/**
 * Construye una URL interna respetando `base` de Astro.
 *
 * `import.meta.env.BASE_URL` puede venir sin barra final ("/SoulMatcha"),
 * así que concatenarlo a mano produce "/SoulMatchafavicon.svg".
 * Todo enlace interno debe pasar por aquí: cambiar `base` al migrar a
 * Vercel no rompe nada.
 */
export function withBase(
  path = '',
  base: string = import.meta.env.BASE_URL,
): string {
  const root = base.endsWith('/') ? base : `${base}/`;
  return root + path.replace(/^\//, '');
}
