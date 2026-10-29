/**
 * Construye una URL interna respetando `base` de Astro.
 *
 * `import.meta.env.BASE_URL` puede venir sin barra final (con un prefijo como "/SoulMatcha")
 * o con ella ("/", en el dominio propio), así que concatenarlo a mano produce rutas rotas.
 * Todo enlace interno debe pasar por aquí: cambiar `base` (p. ej. al migrar de hosting)
 * no rompe nada.
 */
export function withBase(
  path = '',
  base: string = import.meta.env.BASE_URL,
): string {
  const root = base.endsWith('/') ? base : `${base}/`;
  return root + path.replace(/^\//, '');
}
