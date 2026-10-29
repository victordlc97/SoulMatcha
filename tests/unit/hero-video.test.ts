import { describe, expect, it } from 'vitest';
import { shouldAutoplay } from '../../src/shared/motion/hero-video';

describe('shouldAutoplay', () => {
  it('reproduce solo en una conexión normal y sin preferencias de ahorro', () => {
    expect(
      shouldAutoplay({
        reducedMotion: false,
        saveData: false,
        effectiveType: '4g',
      }),
    ).toBe(true);
  });

  it('no reproduce con movimiento reducido', () => {
    expect(
      shouldAutoplay({
        reducedMotion: true,
        saveData: false,
        effectiveType: '4g',
      }),
    ).toBe(false);
  });

  it('no reproduce si la persona activó el ahorro de datos', () => {
    expect(
      shouldAutoplay({
        reducedMotion: false,
        saveData: true,
        effectiveType: '4g',
      }),
    ).toBe(false);
  });

  it('no reproduce en conexiones lentas (slow-2g, 2g, 3g)', () => {
    for (const effectiveType of ['slow-2g', '2g', '3g']) {
      expect(
        shouldAutoplay({
          reducedMotion: false,
          saveData: false,
          effectiveType,
        }),
        effectiveType,
      ).toBe(false);
    }
  });

  it('si el navegador no informa la conexión (Safari), reproduce', () => {
    expect(
      shouldAutoplay({
        reducedMotion: false,
        saveData: undefined,
        effectiveType: undefined,
      }),
    ).toBe(true);
  });
});
