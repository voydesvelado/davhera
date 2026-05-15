/**
 * Centralized Spanish copy for the Vera marketing surface.
 * Keeps strings in one place for easy refinement after the layout
 * is in front of human eyes.
 */

export const landing = {
  cover: {
    metaLeft: ["Vera · Proyecto en concepto", "Davhera · 2026"],
    metaRight: ["Demo interactiva", "Mayo 2026"],
    eyebrow: "Producto en concepto",
    titleLines: [
      "Tu consultorio.",
      { before: "En una sola ", emphasis: "página", after: "." },
    ],
    deck:
      "Una plataforma de reservas diseñada para el profesional de la salud independiente en México. Investigada, diseñada y construida de principio a fin, en código.",
    footMeta: "Rio de Janeiro · Concepto activo · Demo interactiva abajo",
  },

  modePicker: {
    eyebrow: "Probar la demo",
    intro:
      "La demo está viva: cada reserva persiste, cada enlace tokenizado funciona, cada estado se conserva entre visitas. No hay costos detrás — lo que se envía por WhatsApp se renderiza como artefacto de diseño, no como mensaje real.",
  },

  problem: {
    eyebrow: "El problema",
    title: { before: "La doctora que no tiene ", emphasis: "software", after: "." },
    body: [
      "Una psicóloga en Roma Norte. Una nutrióloga en Guadalajara. Una fisioterapeuta que viaja a las casas de sus pacientes en Puebla. Cobra entre 600 y 1,500 pesos por sesión, ve quince o veinte pacientes a la semana, y gestiona toda su agenda por WhatsApp en el mismo teléfono con el que habla con su mamá.",
      "Las herramientas que existen le fallan. Doctoralia la monetiza vendiendo su nombre como un lead al lado de sus competidores. Los EMRs clínicos asumen una recepcionista que no tiene. El resultado es una libreta al lado del sillón, un Google Calendar a medio actualizar, y un teléfono que vibra de las 7 a las 11 de la noche.",
    ],
    pullQuote:
      "La oportunidad no es digitalizar la medicina. Es darle al profesional independiente el mismo soporte de producto que ya espera el dueño de una cafetería moderna.",
  },

  propose: {
    eyebrow: "La propuesta",
    title: { before: "Tres ", emphasis: "principios", after: "." },
    principles: [
      {
        title: "Una página, no un directorio.",
        body:
          "Su perfil le pertenece a ella. Sin anuncios de competidores. Sin tarjetas de «doctores similares». Sin upsells.",
      },
      {
        title: "WhatsApp como sistema, no como integración.",
        body:
          "Cada confirmación, cada recordatorio, cada reagendamiento llega por el canal donde la doctora y sus pacientes ya viven.",
      },
      {
        title: "Calma, no clínica.",
        body:
          "El tono está más cerca de un asistente atento que de una marca de salud. Sin signos de exclamación. Sin emojis en transacciones.",
      },
    ],
  },

  live: {
    eyebrow: "Lo que está vivo",
    title: { before: "Superficies ", emphasis: "navegables", after: "." },
    items: [
      "El perfil público de la Dra. Sofía Ramírez",
      "El flujo de reserva, de 60 segundos, sin crear cuenta",
      "El panel de la doctora — vista de hoy, semana, disponibilidad",
      "El onboarding de 2 minutos — de cero a página en vivo",
      "Confirmaciones tokenizadas — reagendar y cancelar sin login",
      "La previsualización de WhatsApp como pieza de diseño",
    ],
  },

  research: {
    eyebrow: "La investigación detrás",
    title: { before: "Primero el ", emphasis: "documento", after: ", después la pantalla." },
    body:
      "Este producto comenzó como investigación, no como mockup. Antes de la primera línea de código vinieron cuatro documentos sobre quién es la doctora, qué progreso intenta hacer, y qué scope respeta el principio de los dos minutos. La página se construyó contra esos documentos.",
    links: [
      { label: "El manifesto", href: "/projects/vera/manifesto", note: "Por qué este producto existe" },
      { label: "El sistema de diseño", href: "/projects/vera/sistema", note: "Tokens, tipografía, componentes" },
      { label: "Scope del build", href: "#scope", note: "Qué es real, qué está diseñado como artefacto" },
    ],
  },

  footer: {
    left: "Vera · Una pieza de portafolio de Davhera",
    right: "Diseñado y construido en Rio de Janeiro · 2026",
  },
} as const;
