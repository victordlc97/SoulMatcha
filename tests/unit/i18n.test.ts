import { describe, expect, it } from 'vitest';
import {
  alternateLocale,
  getLocale,
  isLocale,
  localeInfo,
  locales,
} from '../../src/i18n/config';
import {
  localeFromPath,
  matchRoute,
  routePath,
  routes,
} from '../../src/i18n/routes';
import { en, es } from '../../src/i18n/ui';

describe('config', () => {
  it('el español es el predeterminado y hay alternativa para cada idioma', () => {
    expect(alternateLocale('es')).toBe('en');
    expect(alternateLocale('en')).toBe('es');
    expect(isLocale('es')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });

  it('getLocale cae al predeterminado si Astro no resuelve un idioma válido', () => {
    expect(getLocale({ currentLocale: 'en' })).toBe('en');
    expect(getLocale({ currentLocale: undefined })).toBe('es');
    expect(getLocale({ currentLocale: 'xx' })).toBe('es');
  });

  it('cada idioma tiene su ficha para el selector', () => {
    for (const locale of locales) {
      expect(localeInfo[locale].short).toHaveLength(2);
    }
  });
});

describe('routes', () => {
  it('traduce las rutas', () => {
    expect(routePath('branches', 'es')).toBe('sucursales/');
    expect(routePath('branches', 'en')).toBe('en/branches/');
    expect(routePath('home', 'es')).toBe('');
    expect(routePath('home', 'en')).toBe('en/');
  });

  it('todas las rutas terminan en barra (o son la raíz) y no se repiten', () => {
    const all = Object.values(routes).flatMap((r) => Object.values(r));
    for (const path of all)
      expect(path === '' || path.endsWith('/')).toBe(true);
    expect(new Set(all).size).toBe(all.length);
  });

  it('las rutas en inglés empiezan por en/', () => {
    for (const r of Object.values(routes))
      expect(r.en.startsWith('en/')).toBe(true);
  });

  it('matchRoute reconoce la página y el idioma, con o sin barra final', () => {
    expect(matchRoute('en/privacy/')).toEqual({ key: 'privacy', locale: 'en' });
    expect(matchRoute('en/privacy')).toEqual({ key: 'privacy', locale: 'en' });
    expect(matchRoute('/privacidad/')).toEqual({
      key: 'privacy',
      locale: 'es',
    });
    expect(matchRoute('')).toEqual({ key: 'home', locale: 'es' });
    expect(matchRoute('no-existe/')).toBeNull();
  });

  it('localeFromPath distingue el prefijo en/', () => {
    expect(localeFromPath('en/branches/')).toBe('en');
    expect(localeFromPath('/en/')).toBe('en');
    expect(localeFromPath('sucursales/')).toBe('es');
    expect(localeFromPath('')).toBe('es');
    // "entrada/" empieza con "en" pero no es el prefijo.
    expect(localeFromPath('entrada/')).toBe('es');
  });
});

describe('diccionarios', () => {
  /** Todas las claves anidadas de un objeto, como "footer.rights". */
  function keys(obj: Record<string, unknown>, prefix = ''): string[] {
    return Object.entries(obj).flatMap(([k, v]) =>
      v && typeof v === 'object'
        ? keys(v as Record<string, unknown>, `${prefix}${k}.`)
        : [`${prefix}${k}`],
    );
  }

  it('inglés y español tienen exactamente las mismas claves', () => {
    expect(keys(en).sort()).toEqual(keys(es).sort());
  });

  it('ningún texto del inglés está vacío', () => {
    for (const key of keys(en)) {
      const value = key
        .split('.')
        .reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], en);
      expect(String(value).trim().length, key).toBeGreaterThan(0);
    }
  });
});
