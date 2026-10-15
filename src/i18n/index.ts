import { withBase } from '../shared/url';
import { type Locale } from './config';
import { routePath, type RouteKey } from './routes';

export * from './config';
export { routePath, routes, type RouteKey } from './routes';
export { useTranslations, type Dictionary } from './ui';

/**
 * URL interna (con `base`) de una página en un idioma, con ancla opcional.
 * Ejemplo: href('home', 'en', '#producto') → "/SoulMatcha/en/#producto".
 */
export function href(key: RouteKey, locale: Locale, hash = ''): string {
  return withBase(routePath(key, locale)) + hash;
}
