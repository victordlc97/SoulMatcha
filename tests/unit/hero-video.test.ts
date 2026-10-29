import { describe, expect, it } from 'vitest';
import { shouldAutoplay } from '../../src/shared/motion/hero-video';

describe('shouldAutoplay', () => {
  it('reproduce solo por defecto', () => {
    expect(shouldAutoplay({ reducedMotion: false, saveData: false })).toBe(
      true,
    );
  });

  it('no reproduce con movimiento reducido (regla de accesibilidad del proyecto)', () => {
    expect(shouldAutoplay({ reducedMotion: true, saveData: false })).toBe(
      false,
    );
    expect(shouldAutoplay({ reducedMotion: true, saveData: undefined })).toBe(
      false,
    );
  });

  it('no reproduce si la persona activó el ahorro de datos (decisión explícita suya)', () => {
    expect(shouldAutoplay({ reducedMotion: false, saveData: true })).toBe(
      false,
    );
  });

  it('si el navegador no informa el ahorro de datos (Safari), reproduce', () => {
    expect(shouldAutoplay({ reducedMotion: false, saveData: undefined })).toBe(
      true,
    );
  });

  it('no mira el tipo de conexión: es una estimación del navegador que suele equivocarse', () => {
    // Un contexto con `effectiveType: '3g'` no cambia el resultado (la propiedad ya no existe).
    const ctx = { reducedMotion: false, saveData: false, effectiveType: '3g' };
    expect(shouldAutoplay(ctx)).toBe(true);
  });
});
