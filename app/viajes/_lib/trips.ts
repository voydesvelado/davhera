export type TripCategory = "playa" | "ciudad" | "aventura" | "cultura";

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
};

export type Trip = {
  slug: string;
  name: string;
  destination: string;
  country: string;
  tagline: string;
  description: string;
  duration: string;
  priceFrom: number;
  coverImage: string;
  gallery: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  category: TripCategory;
};

// TODO: replace placeholders with the agency's own photography before launch.
// picsum.photos returns a stable, real photo for each seed and works without
// authentication — useful while the agency's image library is being shot.
const COVER = (seed: string) => `https://picsum.photos/seed/${seed}/2000/1400`;
const GALLERY = (seed: string) => `https://picsum.photos/seed/${seed}/1600/1200`;

export const trips: Trip[] = [
  {
    slug: "oaxaca-esencial",
    name: "Oaxaca esencial",
    destination: "Oaxaca de Juárez, México",
    country: "México",
    category: "cultura",
    tagline: "Mercados, mezcal y telares en la cuna del barro negro.",
    description:
      "Una ruta pausada por los Valles Centrales y la sierra norte, donde cada comida es un ritual y cada artesano cuenta una historia. Diseñado para quienes viajan a entender, no solo a fotografiar.",
    duration: "7 días / 6 noches",
    priceFrom: 42000,
    coverImage: COVER("oaxaca-market"),
    gallery: [
      GALLERY("oaxaca-market"),
      GALLERY("oaxaca-mezcal"),
      GALLERY("oaxaca-textiles"),
      GALLERY("oaxaca-ruins"),
    ],
    highlights: [
      "Mercado de Tlacolula con un cocinero local",
      "Taller de barro negro en San Bartolo Coyotepec",
      "Cata privada de mezcales en Matatlán",
      "Hierve el Agua al amanecer, sin multitudes",
      "Cena de degustación con vista al Templo de Santo Domingo",
    ],
    itinerary: [
      {
        day: 1,
        title: "Bienvenida en la capital",
        description:
          "Llegada y traslado al hotel boutique en el centro histórico. Tarde libre y cena de bienvenida con vistas a la sierra.",
      },
      {
        day: 2,
        title: "Mercados y barro negro",
        description:
          "Recorrido por el mercado 20 de Noviembre y visita a un maestro alfarero. Comida en una cocinera tradicional zapoteca.",
      },
      {
        day: 3,
        title: "Mitla y Hierve el Agua",
        description:
          "Sitios arqueológicos en privado y baño en las cascadas pétreas antes de que llegue la primera caravana.",
      },
      {
        day: 4,
        title: "Ruta del mezcal",
        description:
          "Tres palenques familiares, una cata guiada por un sommelier de mezcal y comida bajo los magueyes.",
      },
      {
        day: 5,
        title: "Sierra Norte",
        description:
          "Caminata suave entre los Pueblos Mancomunados. Noche en cabaña con cena alrededor del fuego.",
      },
      {
        day: 6,
        title: "Telares y textiles",
        description:
          "Taller con una tejedora de Teotitlán del Valle. Tarde libre. Cena de despedida en un comedor de autor.",
      },
      {
        day: 7,
        title: "Hasta pronto",
        description:
          "Desayuno tranquilo y traslado al aeropuerto. Te llevas el barro, el mezcal y las recetas.",
      },
    ],
  },
  {
    slug: "tulum-secreto",
    name: "Tulum secreto",
    destination: "Tulum, Quintana Roo",
    country: "México",
    category: "playa",
    tagline: "El Caribe mexicano lejos del feed.",
    description:
      "Cenotes privados, una hacienda henequenera y playas a las que solo se llega caminando. Una semana para reaprender a no hacer nada.",
    duration: "6 días / 5 noches",
    priceFrom: 58000,
    coverImage: COVER("tulum-beach"),
    gallery: [
      GALLERY("tulum-beach"),
      GALLERY("tulum-cenote"),
      GALLERY("tulum-jungle"),
      GALLERY("tulum-sunset"),
    ],
    highlights: [
      "Cenote privado al amanecer",
      "Cocina maya con un chef local en la selva",
      "Yoga de cierre frente al mar",
      "Visita guiada a la zona arqueológica antes de horario público",
      "Cena de cinco tiempos en una hacienda restaurada",
    ],
    itinerary: [
      {
        day: 1,
        title: "Llegada y mar",
        description:
          "Recepción en Cancún, traslado privado y cena ligera en la habitación frente a la playa.",
      },
      {
        day: 2,
        title: "Cenotes en privado",
        description:
          "Tres cenotes elegidos por luz y profundidad, con guía local y picnic en la selva.",
      },
      {
        day: 3,
        title: "Ruinas sin gente",
        description:
          "Tulum arqueológico antes del horario oficial. Tarde de hamaca y libro.",
      },
      {
        day: 4,
        title: "Hacienda y cocina maya",
        description:
          "Visita a una hacienda henequenera y clase de cocina con una abuela maya en su comunidad.",
      },
      {
        day: 5,
        title: "Playa secreta",
        description:
          "Travesía en lancha a una playa a la que solo se llega por mar. Comida en la orilla.",
      },
      {
        day: 6,
        title: "Regreso",
        description:
          "Yoga al amanecer, desayuno y traslado al aeropuerto.",
      },
    ],
  },
  {
    slug: "san-miguel-de-allende-arte-y-vino",
    name: "San Miguel: arte y vino",
    destination: "San Miguel de Allende, Guanajuato",
    country: "México",
    category: "ciudad",
    tagline: "Una semana en el pueblo más bonito del Bajío.",
    description:
      "Galerías, calles empedradas y viñedos de altura. Pensado para quienes disfrutan caminar sin prisa, comer despacio y volver al hotel con un cuaderno lleno.",
    duration: "5 días / 4 noches",
    priceFrom: 36000,
    coverImage: COVER("sma-parroquia"),
    gallery: [
      GALLERY("sma-parroquia"),
      GALLERY("sma-callejon"),
      GALLERY("sma-vino"),
      GALLERY("sma-galeria"),
    ],
    highlights: [
      "Tour de galerías con curador local",
      "Cata de vinos en un viñedo de altura",
      "Cena de autor con vista a la Parroquia",
      "Recorrido a caballo por el campo abierto",
      "Visita a un taller de cerámica artesanal",
    ],
    itinerary: [
      {
        day: 1,
        title: "Llegada al Bajío",
        description:
          "Traslado desde el Bajío Internacional y caminata orientativa por el centro al atardecer.",
      },
      {
        day: 2,
        title: "Arte y galerías",
        description:
          "Visitas guiadas a tres galerías clave con un curador local y comida en un restaurante con jardín.",
      },
      {
        day: 3,
        title: "Viñedos de Guanajuato",
        description:
          "Día completo en un viñedo de altura: cata, recorrido y comida maridada.",
      },
      {
        day: 4,
        title: "Campo abierto",
        description:
          "Cabalgata suave por el campo, tarde en spa y cena de despedida con vista a la Parroquia.",
      },
      {
        day: 5,
        title: "Regreso",
        description:
          "Desayuno y traslado al aeropuerto.",
      },
    ],
  },
  {
    slug: "patagonia-fin-del-mundo",
    name: "Patagonia: fin del mundo",
    destination: "Torres del Paine, Chile",
    country: "Chile",
    category: "aventura",
    tagline: "Glaciares, vientos y silencio absoluto.",
    description:
      "Una expedición curada por Torres del Paine y el canal Beagle, con guías de montaña certificados y lodges en lugares imposibles. Para quienes ya viajaron mucho y quieren más que un paisaje.",
    duration: "10 días / 9 noches",
    priceFrom: 185000,
    coverImage: COVER("patagonia-torres"),
    gallery: [
      GALLERY("patagonia-torres"),
      GALLERY("patagonia-glaciar"),
      GALLERY("patagonia-puma"),
      GALLERY("patagonia-estancia"),
    ],
    highlights: [
      "Trekking guiado al pie de las Torres",
      "Navegación entre glaciares del campo de hielo sur",
      "Lodge ecológico con vista al lago Pehoé",
      "Avistamiento de pumas con un rastreador local",
      "Cena de cordero al palo en estancia patagónica",
    ],
    itinerary: [
      {
        day: 1,
        title: "Santiago",
        description:
          "Llegada, noche en hotel boutique y cena ligera.",
      },
      {
        day: 2,
        title: "Hacia Punta Arenas",
        description:
          "Vuelo doméstico y traslado a la entrada del parque. Primer atardecer sobre el lago Sarmiento.",
      },
      {
        day: 3,
        title: "Base Torres",
        description:
          "Trekking guiado al mirador de las Torres con guía de montaña.",
      },
      {
        day: 4,
        title: "Glaciar Grey",
        description:
          "Navegación entre témpanos y caminata sobre morrenas.",
      },
      {
        day: 5,
        title: "Valle del Francés",
        description:
          "Ruta media en el corazón del parque. Picnic en altura.",
      },
      {
        day: 6,
        title: "Pumas",
        description:
          "Salida al amanecer con un rastreador local para avistar pumas en estado salvaje.",
      },
      {
        day: 7,
        title: "Estancia",
        description:
          "Día de cabalgata, esquila y cordero al palo en estancia familiar.",
      },
      {
        day: 8,
        title: "Ushuaia",
        description:
          "Cruce a Argentina y navegación por el canal Beagle.",
      },
      {
        day: 9,
        title: "Tierra del Fuego",
        description:
          "Tren del fin del mundo y caminata por el parque nacional.",
      },
      {
        day: 10,
        title: "Regreso",
        description:
          "Traslado al aeropuerto y vuelos de regreso vía Buenos Aires.",
      },
    ],
  },
  {
    slug: "kioto-en-flor",
    name: "Kioto en flor",
    destination: "Kioto, Japón",
    country: "Japón",
    category: "cultura",
    tagline: "La temporada de sakura, sin las multitudes que la cuentan mal.",
    description:
      "Templos a primera hora, un ryokan en las montañas y una cena kaiseki con un chef que aún cocina con leña. La vieja Japón, en su versión menos turística.",
    duration: "8 días / 7 noches",
    priceFrom: 165000,
    coverImage: COVER("kioto-fushimi"),
    gallery: [
      GALLERY("kioto-fushimi"),
      GALLERY("kioto-bambu"),
      GALLERY("kioto-machiya"),
      GALLERY("kioto-ryokan"),
    ],
    highlights: [
      "Templo Fushimi Inari antes del amanecer",
      "Ceremonia del té con una maestra de Urasenke",
      "Noche en ryokan con onsen privado",
      "Cena kaiseki con un chef de tres generaciones",
      "Mañana en el bosque de bambú de Arashiyama, en silencio",
    ],
    itinerary: [
      {
        day: 1,
        title: "Llegada a Kioto",
        description:
          "Tren desde Tokio y bienvenida en machiya restaurada del barrio Gion.",
      },
      {
        day: 2,
        title: "Higashiyama",
        description:
          "Caminata por callejones antiguos, visita al Kiyomizu-dera y cena en una cocina de barrio.",
      },
      {
        day: 3,
        title: "Fushimi Inari",
        description:
          "Salida antes del amanecer para subir los torii rojos antes de que llegue la primera multitud.",
      },
      {
        day: 4,
        title: "Té y caligrafía",
        description:
          "Ceremonia del té y taller breve de caligrafía con una maestra local.",
      },
      {
        day: 5,
        title: "Arashiyama",
        description:
          "Bosque de bambú, templos zen y paseo por el río Hozu.",
      },
      {
        day: 6,
        title: "Ryokan en la montaña",
        description:
          "Traslado a un ryokan tradicional con onsen privado y cena kaiseki frente al jardín.",
      },
      {
        day: 7,
        title: "Nara",
        description:
          "Día completo en Nara: gran Buda, ciervos sagrados y comida en una soba histórica.",
      },
      {
        day: 8,
        title: "Regreso",
        description:
          "Tren de regreso a Tokio o conexión directa desde Osaka.",
      },
    ],
  },
  {
    slug: "amalfi-lento",
    name: "Amalfi lento",
    destination: "Costa Amalfitana, Italia",
    country: "Italia",
    category: "playa",
    tagline: "La dolce vita, sin la versión de Instagram.",
    description:
      "Hoteles familiares en pueblos colgados del mar, una clase de cocina con una nonna que sigue amasando a mano y barcos privados para llegar a las calas que ya nadie recuerda.",
    duration: "9 días / 8 noches",
    priceFrom: 142000,
    coverImage: COVER("amalfi-positano"),
    gallery: [
      GALLERY("amalfi-positano"),
      GALLERY("amalfi-cala"),
      GALLERY("amalfi-capri"),
      GALLERY("amalfi-limoncello"),
    ],
    highlights: [
      "Clase de pasta con una nonna en Ravello",
      "Barco privado por las calas de Positano",
      "Cena en una terraza con vista a Capri",
      "Caminata por el Sendero de los Dioses",
      "Visita a un productor de limoncello familiar",
    ],
    itinerary: [
      {
        day: 1,
        title: "Llegada a Nápoles",
        description:
          "Traslado privado a la costa y cena ligera frente al mar.",
      },
      {
        day: 2,
        title: "Positano",
        description:
          "Día libre con recomendaciones curadas: dónde nadar, dónde comer, dónde no.",
      },
      {
        day: 3,
        title: "Cala privada",
        description:
          "Barco privado por las calas menos conocidas. Comida abordo.",
      },
      {
        day: 4,
        title: "Ravello",
        description:
          "Clase de pasta con una nonna local y visita a Villa Cimbrone.",
      },
      {
        day: 5,
        title: "Sendero de los Dioses",
        description:
          "Caminata guiada con vistas imposibles y comida campesina en altura.",
      },
      {
        day: 6,
        title: "Amalfi y limoncello",
        description:
          "Recorrido por Amalfi y visita a un productor familiar de limoncello.",
      },
      {
        day: 7,
        title: "Capri",
        description:
          "Día completo en Capri: gruta azul, almuerzo y atardecer en el Faraglioni.",
      },
      {
        day: 8,
        title: "Pompeya",
        description:
          "Visita privada con arqueóloga local. Última cena en una trattoria de barrio.",
      },
      {
        day: 9,
        title: "Regreso",
        description:
          "Traslado al aeropuerto de Nápoles.",
      },
    ],
  },
];

export function getTripBySlug(slug: string): Trip | undefined {
  return trips.find((t) => t.slug === slug);
}

export function getAllTripSlugs(): string[] {
  return trips.map((t) => t.slug);
}
