import type { Locale } from '../../i18n';
import type { BranchId } from '../../i18n/ui';

/**
 * Sucursales. Aquí solo van los DATOS que no cambian con el idioma (coordenadas, enlaces).
 * Nombre y dirección por idioma están en `src/i18n/ui.ts` (`branches.items`), con la misma clave `id`; ahí también van los horarios.
 * El orden del arreglo es el orden de las pestañas.
 */
export interface Branch {
  id: BranchId;
  /** `soon`: próxima apertura, sin dirección ni mapa todavía. */
  status: 'open' | 'soon';
  coords?: { lat: number; lng: number };
  /** Enlace oficial de la ficha en Google Maps. */
  mapsUrl?: string;
}

export const branches: Branch[] = [
  {
    id: 'roma-norte',
    status: 'open',
    coords: { lat: 19.4194586, lng: -99.1594429 },
    mapsUrl: 'https://maps.app.goo.gl/s1cHzrmcoWVeWFN57',
  },
  {
    id: 'lomas-de-chapultepec',
    status: 'open',
    coords: { lat: 19.4207807, lng: -99.2097527 },
    mapsUrl: 'https://maps.app.goo.gl/kRCnGnks8XAHm8Sh6',
  },
  {
    id: 'los-cabos',
    status: 'open',
    coords: { lat: 22.9195467, lng: -109.835455 },
    mapsUrl: 'https://maps.app.goo.gl/M9Ak4akvjXmZF6SU6',
  },
  { id: 'cancun', status: 'soon' },
];

/** URL de la vista incrustable de Google Maps (sin API key) centrada en unas coordenadas. */
export function mapEmbedUrl(
  { lat, lng }: { lat: number; lng: number },
  locale: Locale,
): string {
  const params = new URLSearchParams({
    q: `${lat},${lng}`,
    z: '17',
    hl: locale,
    output: 'embed',
  });
  return `https://www.google.com/maps?${params}`;
}
