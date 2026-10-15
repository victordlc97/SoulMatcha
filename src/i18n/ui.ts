import type { Locale } from './config';

/**
 * Textos de la interfaz. El español es la fuente de verdad: el tipo `Dictionary` sale de él,
 * así que el inglés no compila si falta una clave. Las páginas legales (prosa larga) no van aquí:
 * tienen una página completa por idioma.
 */
export const es = {
  site: {
    name: 'Soul Matcha',
    description: 'Soul Matcha: matcha premium con elegancia y lujo.',
  },
  a11y: {
    skipToContent: 'Ir al contenido',
    goHome: 'Soul Matcha, ir al inicio',
    mainNav: 'Principal',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    menuDialog: 'Menú principal',
    menuNav: 'Menú',
  },
  nav: {
    product: 'Producto',
    about: 'Nosotros',
    branches: 'Sucursales',
  },
  hero: {
    titleLead: 'Life is better with',
    titleAccent: 'matcha',
    ctaPrimary: 'Conoce Soul Matcha',
    ctaSecondary: 'Ver sucursales',
  },
  about: {
    title: 'Nosotros',
    pending: 'Texto de marca pendiente de contenido del cliente.',
    photo: 'Fotografía',
  },
  product: {
    title: 'Producto',
    photo: 'Fotografía',
  },
  branches: {
    title: 'Sucursales',
    metaTitle: 'Sucursales | Soul Matcha',
    description: 'Encuentra la sucursal de Soul Matcha más cercana.',
    pending: 'Pronto publicaremos las direcciones de cada sucursal.',
    map: 'Mapa',
  },
  footer: {
    home: 'Inicio',
    sitemap: 'Mapa del sitio',
    social: 'Redes sociales',
    comingSoon: 'Muy pronto.',
    branches: 'Sucursales',
    viewLocations: 'Ver ubicaciones',
    rights: 'Todos los derechos reservados.',
    legalNav: 'Legal',
    privacy: 'Aviso de privacidad',
    cookies: 'Cookies',
  },
  consent: {
    region: 'Preferencias de cookies',
    text: 'Solo usamos almacenamiento técnico para recordar tus preferencias. No rastreamos tu visita.',
    more: 'Más información',
    accept: 'Aceptar',
    essential: 'Solo necesarias',
    notChosen: 'Sin elegir',
    current: 'Elección actual:',
    change: 'Cambiar mi elección',
  },
  legal: {
    updated: 'Última actualización:',
  },
};

export type Dictionary = typeof es;

export const en: Dictionary = {
  site: {
    name: 'Soul Matcha',
    description: 'Soul Matcha: premium matcha with elegance and luxury.',
  },
  a11y: {
    skipToContent: 'Skip to content',
    goHome: 'Soul Matcha, go to home',
    mainNav: 'Main',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menuDialog: 'Main menu',
    menuNav: 'Menu',
  },
  nav: {
    product: 'Product',
    about: 'About us',
    branches: 'Locations',
  },
  hero: {
    titleLead: 'Life is better with',
    titleAccent: 'matcha',
    ctaPrimary: 'Discover Soul Matcha',
    ctaSecondary: 'See locations',
  },
  about: {
    title: 'About us',
    pending: 'Brand copy pending content from the client.',
    photo: 'Photograph',
  },
  product: {
    title: 'Product',
    photo: 'Photograph',
  },
  branches: {
    title: 'Locations',
    metaTitle: 'Locations | Soul Matcha',
    description: 'Find the Soul Matcha location nearest to you.',
    pending: 'We will publish the address of each location soon.',
    map: 'Map',
  },
  footer: {
    home: 'Home',
    sitemap: 'Sitemap',
    social: 'Social media',
    comingSoon: 'Coming soon.',
    branches: 'Locations',
    viewLocations: 'View locations',
    rights: 'All rights reserved.',
    legalNav: 'Legal',
    privacy: 'Privacy notice',
    cookies: 'Cookies',
  },
  consent: {
    region: 'Cookie preferences',
    text: "We only use technical storage to remember your preferences. We don't track your visit.",
    more: 'More information',
    accept: 'Accept',
    essential: 'Essential only',
    notChosen: 'Not chosen yet',
    current: 'Current choice:',
    change: 'Change my choice',
  },
  legal: {
    updated: 'Last updated:',
  },
};

const dictionaries: Record<Locale, Dictionary> = { es, en };

/** Textos de la interfaz en un idioma. */
export function useTranslations(locale: Locale): Dictionary {
  return dictionaries[locale];
}
