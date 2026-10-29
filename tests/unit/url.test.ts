import { describe, expect, it } from 'vitest';
import { withBase } from '../../src/shared/url';

describe('withBase', () => {
  it('une base sin barra final y ruta con exactamente una barra', () => {
    expect(withBase('favicon.svg', '/SoulMatcha')).toBe(
      '/SoulMatcha/favicon.svg',
    );
  });

  it('acepta una base que ya termina en barra', () => {
    expect(withBase('favicon.svg', '/SoulMatcha/')).toBe(
      '/SoulMatcha/favicon.svg',
    );
  });

  it('ignora la barra inicial de la ruta', () => {
    expect(withBase('/galeria/', '/SoulMatcha')).toBe('/SoulMatcha/galeria/');
  });

  it('sin ruta devuelve la raíz del sitio', () => {
    expect(withBase('', '/SoulMatcha')).toBe('/SoulMatcha/');
  });

  it('conserva los anclajes', () => {
    expect(withBase('#nosotros', '/SoulMatcha')).toBe('/SoulMatcha/#nosotros');
  });

  it('funciona con base raíz (migración a Vercel)', () => {
    expect(withBase('galeria/', '/')).toBe('/galeria/');
    expect(withBase('', '/')).toBe('/');
  });

  it('con base "/" (dominio propio) no duplica barras', () => {
    expect(withBase('', '/')).toBe('/');
    expect(withBase('sucursales/', '/')).toBe('/sucursales/');
    expect(withBase('/en/', '/')).toBe('/en/');
    expect(withBase('#nosotros', '/')).toBe('/#nosotros');
  });
});
