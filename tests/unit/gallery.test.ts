import { describe, expect, it } from 'vitest';
import { pickCategory } from '../../src/features/gallery/gallery';

describe('pickCategory', () => {
  const entries = {
    './producto/producto-10.jpg': 'p10',
    './producto/producto-02.jpg': 'p2',
    './producto/producto-01.jpg': 'p1',
    './proceso/proceso-01.jpg': 'q1',
  };

  it('devuelve solo las fotos de la carpeta de esa categoría', () => {
    expect(pickCategory(entries, 'proceso')).toEqual(['q1']);
  });

  it('las ordena por nombre de archivo, con orden numérico natural', () => {
    expect(pickCategory(entries, 'producto')).toEqual(['p1', 'p2', 'p10']);
  });

  it('una categoría sin fotos da una lista vacía', () => {
    expect(pickCategory(entries, 'historia')).toEqual([]);
  });

  it('no confunde categorías que comparten prefijo', () => {
    expect(pickCategory({ './producto-extra/a.jpg': 'x' }, 'producto')).toEqual(
      [],
    );
  });
});
