import { describe, expect, it } from 'vitest';
import { branches, mapEmbedUrl } from '../../src/features/branches/branches';
import { en, es } from '../../src/i18n/ui';

describe('branches', () => {
  it('Roma Norte va primero, luego Lomas, Los Cabos y al final Cancún (próxima)', () => {
    expect(branches.map((b) => b.id)).toEqual([
      'roma-norte',
      'lomas-de-chapultepec',
      'los-cabos',
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

describe('textos de sucursales', () => {
  it('cada sucursal tiene nombre y dirección en español e inglés', () => {
    for (const dict of [es, en]) {
      for (const b of branches) {
        const item = dict.branches.items[b.id];
        expect(item.name).not.toBe('');
        expect(item.address).not.toBe('');
      }
    }
  });

  it('Lomas de Chapultepec abre todos los días de 9:30 a 18:30', () => {
    expect(es.branches.items['lomas-de-chapultepec'].hours).toEqual([
      { days: 'Lunes a domingo', time: '9:30 am – 6:30 pm' },
    ]);
  });

  it('Roma Norte tiene dos horarios: lunes a jueves y viernes a domingo', () => {
    const hours = es.branches.items['roma-norte'].hours;
    expect(hours.map((h) => h.days)).toEqual([
      'Lunes a jueves',
      'Viernes a domingo',
    ]);
    expect(hours[1].time).toBe('10:00 am – 7:00 pm');
  });

  it('el nombre antiguo "Monte Athos" ya no es el de la sucursal', () => {
    expect(es.branches.items['lomas-de-chapultepec'].tab).toBe(
      'Lomas de Chapultepec',
    );
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
