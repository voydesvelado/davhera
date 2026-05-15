/**
 * Manifesto copy. Substance and voice drawn from
 * _research/solo-practitioner-research.html (Doc № 001).
 */

export const manifesto = {
  cover: {
    metaLeft: ["Vera · Documento № 001", "Manifesto · v1.0"],
    metaRight: ["Davhera · 2026", "Rio de Janeiro"],
    eyebrow: "Manifesto",
    titleLines: [
      "Por qué el consultorio independiente",
      { before: "merece ", emphasis: "su propio software", after: "." },
    ],
    deck:
      "Sobre la diferencia entre una herramienta y un directorio — y por qué esa diferencia es todo el producto.",
    footMeta: "Por Davhera · Rio de Janeiro · Mayo 2026",
  },

  toc: [
    { id: "i",   label: "La premisa" },
    { id: "ii",  label: "El directorio no es una herramienta" },
    { id: "iii", label: "WhatsApp como sistema operativo" },
    { id: "iv",  label: "Calma, no clínica" },
    { id: "v",   label: "La regla de los dos minutos" },
    { id: "vi",  label: "Los recordatorios son el producto" },
    { id: "vii", label: "La confianza es diseño" },
  ],

  sections: {
    i: {
      num: "Sección I",
      title: { before: "La doctora que no tiene ", emphasis: "software", after: "." },
      lede:
        "Hay un tipo particular de profesional mexicana que vive entre dos mundos. Tiene treinta y dos años, está en Roma Norte —o en Polanco, o en Guadalajara—, gestiona su cuenta de Instagram con más cuidado que su agenda, y atiende quince o veinte sesiones a la semana en un consultorio que rentó hace año y medio.",
      paragraphs: [
        "Cobra entre seiscientos y mil quinientos pesos por sesión. Tiene casi cuatro mil seguidores que la encontraron por una historia que reposteó alguna amiga. No tiene recepcionista, no tiene equipo, no tiene un sistema. Tiene una libreta al lado del sillón, un Google Calendar que actualiza cuando se acuerda, y un teléfono que vibra de las siete de la mañana a las once de la noche con la misma pregunta: «Doctora, ¿tendrá espacio el jueves?».",
        "Ella es, por toda medida razonable, un pequeño negocio. Y está, por toda medida razonable, sin software. Los productos que existen para ella son directorios que venden su nombre como un lead. Los productos hechos para clínicas asumen una administradora que no tiene. Lo que le queda es WhatsApp, una libreta, y la memoria.",
        "El gap no es un problema de descubrimiento. Doctoralia ya resuelve descubrimiento, aunque mal. El gap es un problema de herramientas: la doctora independiente no tiene una capa operativa diseñada para cómo realmente trabaja —sola, en WhatsApp, móvil primero, con su marca personal como su canal principal de marketing.",
      ],
      pullQuote:
        "El profesional de la salud independiente no necesita digitalizar la medicina. Necesita el mismo soporte de producto que ya espera el dueño de una cafetería moderna.",
    },

    ii: {
      num: "Sección II",
      title: { before: "La ", emphasis: "trampa", after: " del directorio." },
      paragraphs: [
        "Doctoralia, en México, trata a la doctora como inventario que se monetiza —no como cliente. En su propia página de perfil aparecen tarjetas de competidores. Para aparecer arriba, la doctora paga. La plataforma vende su nombre como un lead al lado del de otras doctoras que ofrecen lo mismo, en la misma colonia, por el mismo precio.",
        "Esto genera un resentimiento de bajo grado, persistente. La doctora lo siente cuando recibe el correo mensual de Doctoralia. Lo siente cuando una paciente pregunta «¿es usted la que tiene tres estrellas en Doctoralia?» y la conversación tiene que empezar defendiendo una calificación que ella no eligió. Lo siente cada vez que se da cuenta de que el producto no está de su lado.",
        "Esa fricción es una apertura. Un producto que esté, sin ambigüedad, del lado de la doctora —que cobre por suscripción y no por leads, que no muestre competidores en su perfil, que se entienda como herramienta y no como mercado— ocupa un espacio que el incumbente, por su modelo de negocio, no puede ocupar.",
      ],
    },

    iii: {
      num: "Sección III",
      title: { before: "Encuentros, no ", emphasis: "integraciones", after: "." },
      paragraphs: [
        "WhatsApp no es una integración. Es el sistema operativo del trabajo de la doctora. Es donde la paciente le escribe, donde ella confirma, donde manda el recordatorio el día anterior, donde acuerda los cambios de hora. Cualquier producto que trate a WhatsApp como un canal opcional —algo que se puede activar en una configuración avanzada— ha entendido al revés cuál es la base y cuál es la rama.",
        "El correo electrónico, en este contexto, es el respaldo. El push notification es el respaldo. La aplicación móvil no debería ser obligatoria. Lo que tiene que funcionar, perfectamente, es la mensajería: cada confirmación, cada recordatorio, cada enlace de reagendamiento llega por WhatsApp, en español de México, con la voz de un asistente atento y la copia exacta cada vez.",
      ],
      sidenote: {
        label: "Realidad operativa",
        body:
          "La WhatsApp Business API de Meta requiere verificación, aprobación de plantillas, y un proveedor (Twilio, 360dialog o Gupshup). La realidad operativa de un v1 mexicano: las plantillas utilitarias se aprueban en 24–48 horas; las de marketing pueden tardar o rechazarse. Hay que reservar dos semanas de margen para la primera aprobación.",
      },
    },

    iv: {
      num: "Sección IV",
      title: { before: "El tono importa tanto como el ", emphasis: "flujo", after: "." },
      paragraphs: [
        "El software clínico que existe falla porque habla el idioma equivocado. Habla con la voz de una marca corporativa, con signos de exclamación y emojis de pulgar arriba, con copia que dice «¡Tu cita ha sido confirmada exitosamente!» cuando lo correcto es «Tu cita está confirmada. Te enviamos los detalles a tu WhatsApp.». La diferencia parece pequeña. No lo es.",
        "El tono está más cerca de un asistente competente —discreto, claro, sin sobreactuar— que de una marca de salud. Sin emojis en mensajes transaccionales; uno como máximo en recordatorios, y solo si suma claridad (un calendario antes de la fecha, por ejemplo). Sin signos de exclamación en copia de producto. El silencio bien colocado dice más que un mensaje extra.",
      ],
      pullQuote:
        "Lo que el producto le manda a la paciente lo lee como si lo hubiera escrito la doctora. Cualquier desviación de esa voz es una grieta de confianza.",
    },

    v: {
      num: "Sección V",
      title: { before: "Si no está vivo en dos minutos, ", emphasis: "no es para mí", after: "." },
      paragraphs: [
        "La primera sesión con el producto es el pitch completo. Si la doctora no tiene una página presentable y compartible en dos minutos, ha decidido —silenciosamente, irreversiblemente— que el producto no es para ella. No regresa. No escribe correo de soporte. Cierra la pestaña.",
        "El onboarding, entonces, se diseña hacia atrás desde ese momento. Lo que se le pide en los primeros dos minutos: nombre, especialidad, un servicio (con duración y precio), una disponibilidad básica, su número de WhatsApp. Lo demás —foto, biografía, servicios adicionales, ubicación, branding— viene después, como sugerencias amables del dashboard. Nada en los primeros dos minutos bloquea el estado de «página lista para recibir reservas».",
      ],
    },

    vi: {
      num: "Sección VI",
      title: { before: "El recordatorio es el ", emphasis: "momento", after: " más importante." },
      paragraphs: [
        "El recordatorio de veinticuatro horas antes es la microinteracción de mayor apalancamiento en todo el flujo. Donde está ausente, los no-shows suben. Donde está presente y bien hecho, la paciente se siente cuidada. No es una característica configurable. No es un add-on. Es el producto.",
        "La plantilla, en su forma actual, es así:",
      ],
      template:
        "Hola Laura, recordatorio: mañana jueves a las 16:00 tienes tu Consulta inicial con Dra. Sofía. Ubicación: Av. Álvaro Obregón 145. ¿Necesitas reagendar? Aquí ›",
      paragraphsAfter: [
        "Veintiocho palabras. Una sola frase de cierre. Un enlace tokenizado que abre el flujo de reagendamiento sin pedir login. Esa es toda la microinteracción. Bien diseñada, salva entre el diez y el veinte por ciento de los ingresos perdidos por no-shows.",
      ],
    },

    vii: {
      num: "Sección VII",
      title: { before: "La calidad visual del perfil es ", emphasis: "todo el producto", after: "." },
      paragraphs: [
        "En una categoría donde la confianza es todo el producto, la calidad visual del perfil es la señal más fuerte que se puede transmitir. Tipografía considerada. Fotografía elegida con cuidado. Espacio generoso. Cédula profesional mostrada con limpieza, sin la insignia genérica de un directorio. La biografía escrita en la voz de la doctora —no en un template.",
        "Esto no es estética por estética. Es la diferencia entre el perfil que se siente como un negocio serio y el perfil que se siente como un anuncio. La paciente que llega por Instagram y aterriza en una página que respira la misma calidad que la cuenta que la trajo, ya ha decidido reservar antes de leer el precio.",
      ],
    },
  },

  closing: {
    lede:
      "Este documento es la versión condensada de una investigación más larga. La versión completa, incluyendo el scope técnico, los flujos de usuario, los riesgos operativos del despliegue, y el modelo de costos del v1, vive en /projects/vera/sistema y en los documentos enlazados desde la página principal.",
    pullQuote: {
      body: "El trabajo no es construir el producto correctamente. El trabajo es saber para qué es. Todo lo demás compila.",
      attribution: "Hipótesis de trabajo",
    },
  },

  colophon:
    "Set in Fraunces and Newsreader. Composed in Rio de Janeiro, May 2026. Primero de cinco documentos en serie.",
} as const;
