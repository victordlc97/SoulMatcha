import { describe, expect, it } from 'vitest';
import { surfaceRootMargin } from '../../src/shared/motion/header-surface';

describe('surfaceRootMargin', () => {
  it('reduce la zona observada a la franja que cubre la barra', () => {
    expect(surfaceRootMargin(900, 78)).toBe('0px 0px -822px 0px');
  });

  it('redondea hacia arriba para no dejar un píxel sin observar', () => {
    expect(surfaceRootMargin(900, 77.4)).toBe('0px 0px -822px 0px');
  });

  it('si la barra ocupa toda la pantalla no recorta nada', () => {
    expect(surfaceRootMargin(600, 700)).toBe('0px 0px 0px 0px');
  });
});
