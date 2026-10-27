import { describe, expect, it } from 'vitest';
import { branches, mapEmbedUrl } from '../../src/features/branches/branches';

describe('branches', () => {
  it('Roma Norte va primero, luego Monte Athos y al final Cancún', () => {
    expect(branches.map((b) => b.id)).toEqual([
      'roma-norte',
      'monte-athos',
      'cancun',
    ]);
  });

  it('las sucursales abiertas tienen coordenadas y enlace a Google Maps; la próxima no', () => {
    for (const b of branches) {
      if (b.status === 'open') {
        expect(b.coords).toBeDefined();
        expect(b.mapsUrl).toMatch(/^https:\/\/maps\.app\.goo\.gl\//);
      } else {
        expect(b.coords).toBeUndefined();
      }
    }
  });
});

describe('mapEmbedUrl', () => {
  it('apunta a la incrustación de Google Maps con las coordenadas y el idioma', () => {
    const url = new URL(
      mapEmbedUrl({ lat: 19.4194586, lng: -99.1594429 }, 'en'),
    );
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps');
    expect(url.searchParams.get('q')).toBe('19.4194586,-99.1594429');
    expect(url.searchParams.get('output')).toBe('embed');
    expect(url.searchParams.get('hl')).toBe('en');
  });
});
