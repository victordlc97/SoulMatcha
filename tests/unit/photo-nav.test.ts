import { describe, expect, it } from 'vitest';
import { stepIndex } from '../../src/features/gallery/lightbox';
import { scrollState } from '../../src/features/gallery/rail';

describe('stepIndex', () => {
  it('avanza y retrocede dentro del rango', () => {
    expect(stepIndex(1, 1, 5)).toBe(2);
    expect(stepIndex(3, -1, 5)).toBe(2);
  });

  it('da la vuelta al llegar a los extremos', () => {
    expect(stepIndex(4, 1, 5)).toBe(0);
    expect(stepIndex(0, -1, 5)).toBe(4);
  });

  it('con una sola foto se queda en ella y con ninguna devuelve 0', () => {
    expect(stepIndex(0, 1, 1)).toBe(0);
    expect(stepIndex(0, -1, 1)).toBe(0);
    expect(stepIndex(0, 1, 0)).toBe(0);
  });
});

describe('scrollState', () => {
  it('al inicio solo se puede avanzar', () => {
    expect(scrollState(0, 400, 1200)).toEqual({ prev: false, next: true });
  });

  it('en medio se puede en ambos sentidos', () => {
    expect(scrollState(300, 400, 1200)).toEqual({ prev: true, next: true });
  });

  it('al final solo se puede retroceder (con 1 px de tolerancia por subpíxeles)', () => {
    expect(scrollState(800, 400, 1200)).toEqual({ prev: true, next: false });
    expect(scrollState(799.4, 400, 1200)).toEqual({ prev: true, next: false });
  });

  it('si todo cabe no hay nada que desplazar', () => {
    expect(scrollState(0, 400, 400)).toEqual({ prev: false, next: false });
  });
});
