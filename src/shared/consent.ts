/**
 * Preferencia sobre cookies/almacenamiento.
 *
 * Hoy el sitio solo usa almacenamiento técnico (ver /cookies/), así que elegir
 * no cambia nada. La preferencia existe para que, si algún día se agrega analítica,
 * solo se active con `accepted` (ver `readConsent()`).
 */
export type Consent = 'accepted' | 'essential';

export const CONSENT_KEY = 'sm-cookie-consent';

/** Lo mínimo que usamos de Storage (permite inyectar uno falso en pruebas). */
type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function isConsent(value: unknown): value is Consent {
  return value === 'accepted' || value === 'essential';
}

/** Devuelve la elección guardada, o `null` si no hay, es inválida o no hay almacenamiento. */
export function readConsent(store?: Store): Consent | null {
  try {
    const raw = (store ?? localStorage).getItem(CONSENT_KEY);
    return isConsent(raw) ? raw : null;
  } catch {
    return null;
  }
}

/** Guarda la elección. Devuelve `false` si el navegador no permite almacenar (modo privado). */
export function saveConsent(value: Consent, store?: Store): boolean {
  try {
    (store ?? localStorage).setItem(CONSENT_KEY, value);
    return true;
  } catch {
    return false;
  }
}

export function clearConsent(store?: Store): void {
  try {
    (store ?? localStorage).removeItem(CONSENT_KEY);
  } catch {
    // Sin almacenamiento no hay nada que borrar.
  }
}
