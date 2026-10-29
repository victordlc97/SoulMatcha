import type { Locale } from './config';

/**
 * Textos de la interfaz. El español es la fuente de verdad: el tipo `Dictionary` sale de él,
 * así que el inglés no compila si falta una clave. Las páginas legales (prosa larga) no van aquí:
 * tienen una página completa por idioma.
 */

/** Identificador de sucursal: es la clave de `branches.items` y de `features/branches/branches.ts`. */
export type BranchId =
  'roma-norte' | 'lomas-de-chapultepec' | 'los-cabos' | 'cancun';

/** Texto de una sucursal en un idioma. `hours` vacío = horario aún sin confirmar (no se muestra). */
export interface BranchText {
  tab: string;
  name: string;
  address: string;
  hours: { days: string; time: string }[];
}

const esBranchItems: Record<BranchId, BranchText> = {
  'roma-norte': {
    tab: 'Roma Norte',
    name: 'Soul Matcha Roma Norte',
    address: 'Tabasco 151, Colonia Roma Norte, CDMX',
    hours: [
      { days: 'Lunes a jueves', time: '9:30 am – 6:30 pm' },
      { days: 'Viernes a domingo', time: '10:00 am – 7:00 pm' },
    ],
  },
  'lomas-de-chapultepec': {
    tab: 'Lomas de Chapultepec',
    name: 'Soul Matcha Lomas de Chapultepec',
    address: 'Monte Athos 130, Lomas de Chapultepec, CDMX',
    hours: [{ days: 'Lunes a domingo', time: '9:30 am – 6:30 pm' }],
  },
  'los-cabos': {
    tab: 'Anima Village Los Cabos',
    name: 'Soul Matcha Anima Village Los Cabos',
    address: 'Dentro de la plaza Anima Village, Los Cabos, BCS',
    hours: [],
  },
  cancun: {
    tab: 'Cancún',
    name: 'Soul Matcha Cancún',
    address: 'Cancún, México',
    hours: [],
  },
};

const enBranchItems: Record<BranchId, BranchText> = {
  'roma-norte': {
    tab: 'Roma Norte',
    name: 'Soul Matcha Roma Norte',
    address: 'Tabasco 151, Colonia Roma Norte, Mexico City',
    hours: [
      { days: 'Monday to Thursday', time: '9:30 am – 6:30 pm' },
      { days: 'Friday to Sunday', time: '10:00 am – 7:00 pm' },
    ],
  },
  'lomas-de-chapultepec': {
    tab: 'Lomas de Chapultepec',
    name: 'Soul Matcha Lomas de Chapultepec',
    address: 'Monte Athos 130, Lomas de Chapultepec, Mexico City',
    hours: [{ days: 'Monday to Sunday', time: '9:30 am – 6:30 pm' }],
  },
  'los-cabos': {
    tab: 'Anima Village Los Cabos',
    name: 'Soul Matcha Anima Village Los Cabos',
    address: 'Inside the Anima Village plaza, Los Cabos, BCS',
    hours: [],
  },
  cancun: {
    tab: 'Cancún',
    name: 'Soul Matcha Cancún',
    address: 'Cancún, Mexico',
    hours: [],
  },
};

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
    pauseVideo: 'Pausar video',
    playVideo: 'Reproducir video',
  },
  nav: {
    product: 'Producto',
    about: 'Nosotros',
    branches: 'Sucursales',
    wholesale: 'Wholesale',
  },
  hero: {
    sloganTop: 'I love',
    sloganItalic: 'you so',
    sloganBottom: 'matcha',
    ctaPrimary: 'Conoce Soul Matcha',
    ctaSecondary: 'Ver sucursales',
  },
  about: {
    title: 'Nosotros',
    story1:
      'Soul Matcha es una casa de matcha refinada, dedicada a ofrecer una experiencia elevada y placentera. Con matcha de primera cosecha de Uji, Japón, celebramos la maestría artesanal, la pureza y la tradición en cada taza.',
    story2:
      'Nuestra misión es crear un ambiente fresco y acogedor donde el servicio excepcional se encuentra con un matcha de clase mundial. Cada detalle está pensado para inspirar momentos de placer, conexión y bienestar, y dejarte una sensación de euforia sin esfuerzo desde el primer sorbo.',
  },
  mission: {
    text: 'Nuestra misión es hacer el matcha accesible y transformar la industria de la cafeína.',
  },
  origin: {
    title: '¿De dónde viene nuestro matcha?',
    lead: 'Nuestro matcha viene de Uji, Japón, y siempre es de primera cosecha.',
    quality:
      'No todo el matcha es igual. Aunque los distintos grados pueden ofrecer beneficios similares para la salud, la diferencia real está en el sabor, el aroma, la textura y el disfrute. Elegimos un matcha de perfil suave y naturalmente dulce, con un umami profundo y un final limpio.',
    craft:
      'Un gran matcha empieza mucho antes de la cosecha. El suelo, la ubicación, el clima, los métodos de cultivo y la variedad de la planta definen el resultado. Las mejores plantas de té se cubren con sombra durante periodos largos, lo que aumenta los aminoácidos y da el verde intenso, la dulzura delicada y el umami característico del matcha premium.',
    farmers:
      'Trabajamos directamente con agricultores locales de Uji, cuna del matcha más célebre del mundo. Muchas de estas familias llevan generaciones dedicadas al cultivo del té y han transmitido sus conocimientos, tradiciones y pasión. Su legado, unido a una artesanía meticulosa, nos permite ofrecer a cada cliente una experiencia de matcha auténtica y extraordinaria.',
  },
  wholesale: {
    metaTitle: 'Wholesale y alianzas | Soul Matcha',
    description:
      'Lleva Soul Matcha a tu negocio: una barra de matcha para tus eventos y condiciones de wholesale.',
    title: 'Wholesale y alianzas',
    barTitle: 'Una barra Soul Matcha, donde quieras',
    bar1: 'Por primera vez, las personas pueden vivir una barra Soul Matcha completamente experiencial en cualquier lugar. Reúne toda nuestra oferta principal con un menú exclusivo y artículos de mercancía.',
    bar2: 'Creemos que nuestro concepto de matcha encaja con organizaciones que valoran las experiencias cuidadas, el diseño, el bienestar y el sentido de comunidad. Más que una bebida, Soul Matcha es una experiencia de estilo de vida basada en la artesanía, el bienestar, la hospitalidad y el servicio excepcional.',
    bar3: 'Nos encantaría explorar cómo Soul Matcha puede formar parte de tu menú y de la experiencia de tus invitados.',
    mayoreoTitle: 'Wholesale',
    mayoreoText:
      'Si tu negocio vende más de 5 kilogramos de matcha al mes, escríbenos para conocer las condiciones de wholesale y los descuentos por volumen.',
    contact: 'Escríbenos a',
    closing: 'Matchas gracias!',
  },
  product: {
    title: 'Producto',
    lead: 'Matcha de primera cosecha de Uji, Japón: de la plantación a tu taza.',
  },
  gallery: {
    producto: 'Fotografía de producto Soul Matcha',
    proceso: 'Fotografía del proceso del matcha',
    historia: 'Fotografía de la historia de Soul Matcha',
    enlarge: 'Ampliar',
    dialog: 'Foto ampliada',
    close: 'Cerrar',
    prev: 'Foto anterior',
    next: 'Foto siguiente',
    railPrev: 'Ver fotos anteriores',
    railNext: 'Ver más fotos',
  },
  branches: {
    title: 'Sucursales',
    metaTitle: 'Sucursales | Soul Matcha',
    description: 'Encuentra la sucursal de Soul Matcha más cercana.',
    tabsLabel: 'Elige una sucursal',
    hoursTitle: 'Horario',
    openInMaps: 'Abrir en Google Maps',
    loadMap: 'Ver mapa',
    mapOf: 'Mapa de',
    mapNote:
      'El mapa lo sirve Google: al cargarlo, Google puede guardar cookies en tu navegador.',
    soonBadge: 'Próxima apertura',
    soonText: 'Muy pronto abriremos en Cancún, México. ¡Te esperamos!',
    items: esBranchItems,
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
    pauseVideo: 'Pause video',
    playVideo: 'Play video',
  },
  nav: {
    product: 'Product',
    about: 'About us',
    branches: 'Locations',
    wholesale: 'Wholesale',
  },
  hero: {
    sloganTop: 'I love',
    sloganItalic: 'you so',
    sloganBottom: 'matcha',
    ctaPrimary: 'Discover Soul Matcha',
    ctaSecondary: 'See locations',
  },
  about: {
    title: 'About us',
    story1:
      'Soul Matcha is a refined matcha house dedicated to delivering an elevated and indulgent experience. Sourced exclusively from first-harvest matcha in Uji, Japan, we celebrate craftsmanship, purity and tradition in every cup.',
    story2:
      'Our mission is to create a fresh, welcoming atmosphere where exceptional service meets world-class matcha. Every detail is curated to inspire moments of pleasure, connection and well-being, leaving you with a sense of effortless euphoria from the very first sip.',
  },
  mission: {
    text: 'Our mission is to make matcha accessible and disrupt the caffeine industry.',
  },
  origin: {
    title: 'Where does our matcha come from?',
    lead: 'Our matcha comes from Uji, Japan, and it is always first harvest.',
    quality:
      'Not all matcha is created equal. Although different grades may offer similar health benefits, the true distinction lies in flavor, aroma, texture and overall enjoyment. We select matcha with a smooth, naturally sweet profile, a rich umami character and a clean finish.',
    craft:
      'Great matcha begins long before harvest. Soil quality, location, climate, cultivation methods and cultivar all shape the final product. The finest tea plants are shaded for extended periods, which raises amino acids and creates the vibrant green color, delicate sweetness and signature umami of premium matcha.',
    farmers:
      "We work directly with local farmers in Uji, the birthplace of the world's most celebrated matcha. Many of these families have dedicated generations to tea cultivation, passing down their knowledge, traditions and passion. Their legacy, combined with meticulous craftsmanship, lets us bring an authentic and extraordinary matcha experience to every customer.",
  },
  wholesale: {
    metaTitle: 'Wholesale and partnerships | Soul Matcha',
    description:
      'Bring Soul Matcha to your business: a matcha bar for your events and wholesale terms.',
    title: 'Wholesale and partnerships',
    barTitle: 'A Soul Matcha bar, anywhere',
    bar1: 'For the first time, people can immerse themselves in a fully experiential Soul Matcha bar at any place. It brings all our core offerings together with an exclusive menu and merchandise items.',
    bar2: 'We believe our matcha concept fits organizations that value curated experiences, thoughtful design, wellness and a strong sense of community. More than a beverage, Soul Matcha is a lifestyle experience built on craftsmanship, wellness, hospitality and exceptional service.',
    bar3: "We would be delighted to explore how Soul Matcha can become part of your menu and your guests' experience.",
    mayoreoTitle: 'Wholesale',
    mayoreoText:
      'If your business sells more than 5 kilograms of matcha per month, write to us to learn about our wholesale terms and volume discounts.',
    contact: 'Write to us at',
    closing: 'Matchas gracias!',
  },
  product: {
    title: 'Product',
    lead: 'First-harvest matcha from Uji, Japan: from the plantation to your cup.',
  },
  gallery: {
    producto: 'Soul Matcha product photograph',
    proceso: 'Photograph of the matcha process',
    historia: 'Photograph of the Soul Matcha story',
    enlarge: 'Enlarge',
    dialog: 'Enlarged photo',
    close: 'Close',
    prev: 'Previous photo',
    next: 'Next photo',
    railPrev: 'See previous photos',
    railNext: 'See more photos',
  },
  branches: {
    title: 'Locations',
    metaTitle: 'Locations | Soul Matcha',
    description: 'Find the Soul Matcha location nearest to you.',
    tabsLabel: 'Choose a location',
    hoursTitle: 'Opening hours',
    openInMaps: 'Open in Google Maps',
    loadMap: 'Show map',
    mapOf: 'Map of',
    mapNote:
      'The map is served by Google: when it loads, Google may store cookies in your browser.',
    soonBadge: 'Opening soon',
    soonText: 'We will be opening in Cancún, Mexico very soon. See you there!',
    items: enBranchItems,
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
