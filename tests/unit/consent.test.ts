import { describe, expect, it } from 'vitest';
import {
  CONSENT_KEY,
  clearConsent,
  isConsent,
  readConsent,
  saveConsent,
} from '../../src/shared/consent';

/** Storage falso en memoria. */
function memoryStore(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  };
}

/** Storage que siempre falla, como en modo privado con almacenamiento bloqueado. */
const brokenStore = {
  getItem: () => {
    throw new Error('blocked');
  },
  setItem: () => {
    throw new Error('blocked');
  },
  removeItem: () => {
    throw new Error('blocked');
  },
};

describe('isConsent', () => {
  it('acepta solo los dos valores válidos', () => {
    expect(isConsent('accepted')).toBe(true);
    expect(isConsent('essential')).toBe(true);
    expect(isConsent('rejected')).toBe(false);
    expect(isConsent(null)).toBe(false);
    expect(isConsent(undefined)).toBe(false);
  });
});

describe('readConsent', () => {
  it('devuelve null si nunca se eligió', () => {
    expect(readConsent(memoryStore())).toBeNull();
  });

  it('devuelve la elección guardada', () => {
    expect(readConsent(memoryStore({ [CONSENT_KEY]: 'accepted' }))).toBe(
      'accepted',
    );
  });

  it('ignora valores inválidos (almacenamiento manipulado)', () => {
    expect(
      readConsent(memoryStore({ [CONSENT_KEY]: 'lo-que-sea' })),
    ).toBeNull();
  });

  it('no lanza si el almacenamiento está bloqueado', () => {
    expect(readConsent(brokenStore)).toBeNull();
  });
});

describe('saveConsent / clearConsent', () => {
  it('guarda y se puede leer de vuelta', () => {
    const store = memoryStore();
    expect(saveConsent('essential', store)).toBe(true);
    expect(readConsent(store)).toBe('essential');
  });

  it('clearConsent borra la elección', () => {
    const store = memoryStore({ [CONSENT_KEY]: 'accepted' });
    clearConsent(store);
    expect(readConsent(store)).toBeNull();
  });

  it('avisa con false si no se pudo guardar, sin lanzar', () => {
    expect(saveConsent('accepted', brokenStore)).toBe(false);
    expect(() => clearConsent(brokenStore)).not.toThrow();
  });
});
