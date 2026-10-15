/** Idiomas del sitio. El español es el predeterminado y vive en la raíz (sin prefijo). */
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export function isLocale(value: unknown): value is Locale {
  return locales.includes(value as Locale);
}

/**
 * Cómo se presenta cada idioma en el selector. Siempre en SU PROPIO idioma:
 * quien no entiende la página actual debe poder reconocer el suyo.
 */
export const localeInfo: Record<
  Locale,
  { short: string; name: string; ariaLabel: string }
> = {
  es: { short: 'ES', name: 'Español', ariaLabel: 'Ver el sitio en español' },
  en: { short: 'EN', name: 'English', ariaLabel: 'Read this site in English' },
};

export function alternateLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}

/** Lee el idioma que Astro resuelve para la página (`Astro.currentLocale`). */
export function getLocale(astro: { currentLocale?: string }): Locale {
  return isLocale(astro.currentLocale) ? astro.currentLocale : defaultLocale;
}
