import { defaultLocale, type Locale } from './config';

/**
 * Páginas del sitio y su ruta en cada idioma. Las rutas se TRADUCEN (/sucursales/ ↔ /en/branches/):
 * es mejor para SEO y para quien lee la URL. Cada ruta termina en "/" y es relativa a `base`.
 */
export const routes = {
  home: { es: '', en: 'en/' },
  branches: { es: 'sucursales/', en: 'en/branches/' },
  privacy: { es: 'privacidad/', en: 'en/privacy/' },
  cookies: { es: 'cookies/', en: 'en/cookies/' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

/** Ruta (sin `base`) de una página en un idioma. */
export function routePath(key: RouteKey, locale: Locale): string {
  return routes[key][locale];
}

/**
 * Dado un pathname ya sin `base` ("sucursales/", "en/branches/"...), devuelve la clave de página
 * y el idioma, o `null` si no es una página conocida.
 */
export function matchRoute(
  path: string,
): { key: RouteKey; locale: Locale } | null {
  const clean = path.replace(/^\/+/, '');
  const normalized = clean === '' || clean.endsWith('/') ? clean : `${clean}/`;
  for (const key of Object.keys(routes) as RouteKey[]) {
    for (const locale of Object.keys(routes[key]) as Locale[]) {
      if (routes[key][locale] === normalized) return { key, locale };
    }
  }
  return null;
}

/** Idioma de un pathname ya sin `base`: el prefijo `en/` indica inglés, si no, el predeterminado. */
export function localeFromPath(path: string): Locale {
  const first = path.replace(/^\/+/, '').split('/')[0];
  return first === 'en' ? 'en' : defaultLocale;
}
