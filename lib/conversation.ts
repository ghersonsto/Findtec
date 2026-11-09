import { company, whatsappHref } from "@/lib/company";
import { retrieveKnowledge, suggestServiceFromQuery } from "@/lib/knowledge";
import { quoteHref } from "@/lib/quote";
import {
  commercialServices,
  getCommercialService,
  matchCommercialService,
  type CommercialService,
  type CommercialServiceId,
} from "@/lib/services";

export type ConversationIntent =
  | "greeting"
  | "catalog"
  | "informational"
  | "commercial"
  | "quote"
  | "pricing"
  | "technical"
  | "support"
  | "b2g"
  | "human_handoff"
  | "clarify"
  | "affirm"
  | "deny"
  | "reference"
  | "offtopic";

export type QualificationStep =
  | "discover"
  | "confirm_service"
  | "goal"
  | "current_state"
  | "assets"
  | "scope"
  | "timeline"
  | "ready_quote";

export type ConversationSession = {
  visitorName?: string;
  serviceId?: CommercialServiceId | "otro";
  serviceLabel?: string;
  goal?: string;
  projectType?: string;
  currentState?: string;
  hasAssets?: boolean;
  features: string[];
  timeline?: string;
  notes: string[];
  pendingSlot?: QualificationStep;
  quoteReady?: boolean;
  lastIntent?: ConversationIntent;
  turnCount: number;
};

export type ChatTurn = {
  role: "user" | "agent";
  text: string;
};

export type QuickReply = {
  label: string;
  agent: "orquestador" | "cotizacion" | "soporte" | "tecnico" | "b2g";
  prompt: string;
};

export type ConversationResult = {
  reply: string;
  intent: ConversationIntent;
  session: ConversationSession;
  confidence: number;
  suggestedService: { value: string; label: string } | null;
  quickReplies: QuickReply[];
  sources: Array<{ id: string; title: string; excerpt: string; score: number }>;
  nextSteps: string[];
  actions: {
    whatsapp: string;
    contactAnchor: string;
    quoteServicio: string;
  };
  quoteSummary: string;
};

const emptySession = (): ConversationSession => ({
  features: [],
  notes: [],
  turnCount: 0,
  pendingSlot: "discover",
});

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function pick<T>(items: T[], seed: number) {
  return items[Math.abs(seed) % items.length];
}

function extractName(message: string) {
  const match = message.match(
    /(?:me llamo|soy|mi nombre es)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ]{2,40})/i,
  );
  return match?.[1]?.trim();
}

function detectReference(
  message: string,
  history: ChatTurn[],
): CommercialService | null {
  const text = normalize(message);
  const ordinalMatch = text.match(
    /(?:el|la|del)?\s*(primer|primero|1(?:er|ro)?|segundo|2(?:do)?|tercer|tercero|3(?:er|ro)?|cuarto|4(?:to)?|quinto|5(?:to)?|sexto|6(?:to)?)\s*(servicio)?/,
  );
  if (ordinalMatch) {
    const map: Record<string, number> = {
      primer: 0,
      primero: 0,
      "1": 0,
      "1er": 0,
      "1ro": 0,
      segundo: 1,
      "2": 1,
      "2do": 1,
      tercer: 2,
      tercero: 2,
      "3": 2,
      "3er": 2,
      "3ro": 2,
      cuarto: 3,
      "4": 3,
      "4to": 3,
      quinto: 4,
      "5": 4,
      "5to": 4,
      sexto: 5,
      "6": 5,
      "6to": 5,
    };
    const key = Object.keys(map).find((item) =>
      normalize(ordinalMatch[1]).startsWith(item),
    );
    if (key != null && commercialServices[map[key]]) {
      return commercialServices[map[key]];
    }
  }

  const lastAgent = [...history].reverse().find((turn) => turn.role === "agent");
  if (!lastAgent) return null;
  for (const service of commercialServices) {
    if (normalize(lastAgent.text).includes(normalize(service.label))) {
      if (/ese|este|el mismo|la misma|eso|lo mismo|cotizarlo|ese servicio/.test(text)) {
        return service;
      }
    }
  }
  return null;
}

export function classifyIntent(
  message: string,
  session: ConversationSession,
): ConversationIntent {
  const text = normalize(message);

  if (/^(hola|buenas|buen dia|buen día|hey|saludos)\b/.test(text) && text.length < 40) {
    return "greeting";
  }
  if (
    /hablar con (una )?persona|asesor humano|llamar|whatsapp|contacto humano|alguien real/.test(
      text,
    )
  ) {
    return "human_handoff";
  }
  if (/cu[aá]nto (cuesta|vale|sale)|precio|tarifa|presupuesto aproximado/.test(text)) {
    return "pricing";
  }
  if (/cotiz|presupuesto|propuesta comercial|quiero cotizar/.test(text)) {
    return "quote";
  }
  if (/qu[eé] servicios|qu[eé] ofrecen|cat[aá]logo|soluciones tienen/.test(text)) {
    return "catalog";
  }
  if (/estado|p[uú]blico|b2g|rnp|gobierno|entidad|osce|instituci[oó]n/.test(text)) {
    return "b2g";
  }
  if (/falla|ticket|no funciona|incidencia|soporte|lento|ayuda t[eé]cnica/.test(text)) {
    return "support";
  }
  if (/docker|laravel|api|vpn|arquitectura|mysql|servidor|infraestructura t[eé]cnica/.test(text)) {
    return "technical";
  }
  if (/^(si|sí|claro|exacto|correcto|afirmativo|dale|ok|okay|de acuerdo)\b/.test(text)) {
    return "affirm";
  }
  if (/^(no|nop|para nada|negativo)\b/.test(text)) {
    return "deny";
  }
  if (/ese|este|el segundo|el primero|la misma|lo mismo|ese servicio/.test(text)) {
    return "reference";
  }
  if (session.serviceId && session.serviceId !== "otro") {
    return "commercial";
  }
  const matched = matchCommercialService(message);
  if (matched.service && matched.score >= 3) return "commercial";
  if (message.trim().length < 18) return "clarify";
  return "informational";
}

function extractSlots(message: string, session: ConversationSession): ConversationSession {
  const next: ConversationSession = {
    ...session,
    features: [...session.features],
    notes: [...session.notes],
  };
  const text = normalize(message);
  const name = extractName(message);
  if (name) next.visitorName = name;

  if (/presentar (mi )?empresa|corporativ|presencia|solo informaci[oó]n|vitrina/.test(text)) {
    next.goal = "presentar la empresa";
    next.projectType = "corporativo";
  }
  if (/vender|ventas online|e-?commerce|tienda|pagos|carrito/.test(text)) {
    next.goal = "vender productos online";
    next.projectType = "ecommerce";
  }
  if (/automatizar|integrar api|extraer datos|documentos/.test(text)) {
    next.goal = "automatizar o integrar procesos";
  }
  if (/controlar operaciones|inventario|erp|sistema interno|gesti[oó]n/.test(text)) {
    next.goal = "centralizar operaciones";
    next.projectType = "sistema";
  }

  if (/desde cero|no tengo (web|p[aá]gina|sitio)|nuevo proyecto/.test(text)) {
    next.currentState = "desde cero";
  }
  if (/ya tengo (web|p[aá]gina|sitio)|rediseñar|mejorar (mi )?web|migrar/.test(text)) {
    next.currentState = "proyecto existente";
  }

  if (/tengo (logo|todo|contenido|informaci[oó]n)|cuento con/.test(text)) {
    next.hasAssets = true;
  }
  if (/no tengo logo|falta contenido|sin informaci[oó]n/.test(text)) {
    next.hasAssets = false;
  }

  if (/urgente|esta semana|este mes|pronto|lo antes posible/.test(text)) {
    next.timeline = "corto plazo";
  }
  if (/sin apuro|flexible|pr[oó]ximo trimestre|el pr[oó]ximo a[nñ]o/.test(text)) {
    next.timeline = "flexible";
  }

  if (/pasarela|pago|yape|plin|culqi|niubiz/.test(text)) next.features.push("pagos");
  if (/inventario|stock|kardex/.test(text)) next.features.push("inventario");
  if (/seo/.test(text)) next.features.push("SEO");
  if (/vpn|microsoft 365|backup|respaldo/.test(text)) next.features.push("infraestructura");

  next.features = [...new Set(next.features)];
  if (message.trim().length > 12 && !next.notes.includes(message.trim().slice(0, 160))) {
    next.notes = [...next.notes.slice(-5), message.trim().slice(0, 160)];
  }
  return next;
}

function resolveService(
  message: string,
  history: ChatTurn[],
  session: ConversationSession,
): ConversationSession {
  const next = { ...session };
  const referenced = detectReference(message, history);
  if (referenced) {
    next.serviceId = referenced.id;
    next.serviceLabel = referenced.label;
    return next;
  }

  const matchedNow = matchCommercialService(message);
  // Si el mensaje apunta con fuerza a otro servicio, actualizar la intención.
  if (matchedNow.service && matchedNow.score >= 5) {
    if (!next.serviceId || matchedNow.service.id !== next.serviceId) {
      next.serviceId = matchedNow.service.id;
      next.serviceLabel = matchedNow.service.label;
      if (matchedNow.service.id !== session.serviceId) {
        next.goal = undefined;
        next.currentState = undefined;
        next.hasAssets = undefined;
        next.pendingSlot = "goal";
      }
      return next;
    }
  }

  if (!next.serviceId) {
    const suggestion = suggestServiceFromQuery(message);
    if (suggestion.service && suggestion.confidence >= 0.42) {
      next.serviceId = suggestion.service.id;
      next.serviceLabel = suggestion.service.label;
    }
  }
  return next;
}

function nextPendingSlot(session: ConversationSession): QualificationStep {
  if (!session.serviceId || session.serviceId === "otro") return "discover";
  if (!session.goal) return "goal";
  if (session.serviceId === "web" || session.serviceId === "ecommerce") {
    if (!session.currentState) return "current_state";
    if (session.hasAssets == null) return "assets";
  }
  if (session.serviceId && session.goal) return "ready_quote";
  return "scope";
}

function buildQuoteSummary(session: ConversationSession) {
  const parts = [
    session.serviceLabel ? `Servicio: ${session.serviceLabel}` : null,
    session.goal ? `Objetivo: ${session.goal}` : null,
    session.currentState ? `Estado: ${session.currentState}` : null,
    session.hasAssets == null
      ? null
      : session.hasAssets
        ? "Cuenta con materiales base"
        : "Aún no cuenta con todos los materiales",
    session.features.length ? `Funciones: ${session.features.join(", ")}` : null,
    session.timeline ? `Plazo: ${session.timeline}` : null,
  ].filter(Boolean);
  return parts.join(". ") || "Solicitud de orientación comercial Findtec.";
}

function contextualQuickReplies(
  intent: ConversationIntent,
  session: ConversationSession,
): QuickReply[] {
  if (intent === "human_handoff") {
    return [
      {
        label: "WhatsApp",
        agent: "orquestador",
        prompt: "Prefiero continuar por WhatsApp",
      },
      {
        label: "Cotizar aquí",
        agent: "cotizacion",
        prompt: "Prefiero dejar una cotización desde el sitio",
      },
    ];
  }

  if (session.serviceId === "ecommerce") {
    return [
      {
        label: "Medios de pago",
        agent: "cotizacion",
        prompt: "¿Qué medios de pago puedo integrar en la tienda online?",
      },
      {
        label: "Inventario",
        agent: "cotizacion",
        prompt: "Necesito gestión de productos e inventario en la tienda",
      },
      {
        label: "Cotizar tienda",
        agent: "cotizacion",
        prompt: "Quiero cotizar una tienda online",
      },
    ];
  }

  if (session.serviceId === "web") {
    return [
      {
        label: "Desde cero",
        agent: "cotizacion",
        prompt: "Sería un proyecto desde cero",
      },
      {
        label: "Rediseño",
        agent: "cotizacion",
        prompt: "Ya tengo una web y quiero mejorarla",
      },
      {
        label: "Cotizar web",
        agent: "cotizacion",
        prompt: "Quiero cotizar un sitio web corporativo",
      },
    ];
  }

  if (session.serviceId === "apps") {
    return [
      {
        label: "Inventario",
        agent: "cotizacion",
        prompt: "Necesito controlar inventario y operaciones",
      },
      {
        label: "Usuarios y roles",
        agent: "tecnico",
        prompt: "Necesito usuarios con roles y permisos",
      },
      {
        label: "Cotizar sistema",
        agent: "cotizacion",
        prompt: "Quiero cotizar una aplicación web a medida",
      },
    ];
  }

  if (session.serviceId === "ia") {
    return [
      {
        label: "APIs",
        agent: "tecnico",
        prompt: "Quiero conectar mi sistema con una API de IA",
      },
      {
        label: "Documentos",
        agent: "cotizacion",
        prompt: "Necesito extraer datos de documentos",
      },
      {
        label: "Cotizar IA",
        agent: "cotizacion",
        prompt: "Quiero cotizar una integración con IA",
      },
    ];
  }

  if (session.serviceId === "cloud" || intent === "technical") {
    return [
      {
        label: "VPN",
        agent: "tecnico",
        prompt: "Necesito una VPN corporativa",
      },
      {
        label: "Microsoft 365",
        agent: "tecnico",
        prompt: "Quiero implementar Microsoft 365",
      },
      {
        label: "Cotizar cloud",
        agent: "cotizacion",
        prompt: "Quiero cotizar cloud y seguridad TI",
      },
    ];
  }

  if (session.serviceId === "soporte" || intent === "support") {
    return [
      {
        label: "Incidencia",
        agent: "soporte",
        prompt: "Tengo una incidencia técnica urgente",
      },
      {
        label: "Mantenimiento",
        agent: "soporte",
        prompt: "Necesito mantenimiento preventivo",
      },
      {
        label: "Contactar soporte",
        agent: "soporte",
        prompt: "Quiero contactar a soporte por WhatsApp",
      },
    ];
  }

  if (intent === "catalog" || !session.serviceId) {
    return [
      {
        label: "Sitio web",
        agent: "cotizacion",
        prompt: "Necesito una página web para mi empresa",
      },
      {
        label: "Tienda online",
        agent: "cotizacion",
        prompt: "Quiero vender mis productos por internet",
      },
      {
        label: "Sistema / ERP",
        agent: "cotizacion",
        prompt: "Necesito un sistema personalizado para controlar mis operaciones",
      },
      {
        label: "Ver los 6",
        agent: "cotizacion",
        prompt: "¿Qué servicios ofrece Findtec Soluciones?",
      },
    ];
  }

  if (session.quoteReady) {
    return [
      {
        label: "Abrir cotización",
        agent: "cotizacion",
        prompt: "Sí, quiero preparar la cotización con lo conversado",
      },
      {
        label: "Añadir detalle",
        agent: "cotizacion",
        prompt: "Quiero agregar más detalle antes de cotizar",
      },
    ];
  }

  return [
    {
      label: "Cotizar",
      agent: "cotizacion",
      prompt: "Quiero cotizar con lo que ya conversamos",
    },
    {
      label: "Ver servicios",
      agent: "cotizacion",
      prompt: "¿Qué servicios ofrece Findtec Soluciones?",
    },
  ];
}

function askOneQuestion(session: ConversationSession, seed: number) {
  const service = session.serviceLabel || "tu proyecto";
  switch (session.pendingSlot) {
    case "goal":
      if (session.serviceId === "web") {
        return pick(
          [
            `¿La necesitas principalmente para presentar tu empresa o también quieres vender productos desde la misma página?`,
            `Para afinarte mejor: ¿buscas una vitrina corporativa o una web orientada a captar leads?`,
          ],
          seed,
        );
      }
      if (session.serviceId === "ecommerce") {
        return `¿Qué tipo de productos quieres vender y ya tienes definido el catálogo?`;
      }
      if (session.serviceId === "apps") {
        return `¿Qué proceso quieres centralizar primero: ventas, inventario, compras u operaciones?`;
      }
      return `¿Cuál es el objetivo principal que quieres lograr con ${service}?`;
    case "current_state":
      return pick(
        [
          `¿Ya tienes una página actualmente o sería un proyecto desde cero?`,
          `¿Partimos de algo existente o lo armamos desde cero?`,
        ],
        seed,
      );
    case "assets":
      return `¿Ya cuentas con logo e información de tu empresa, o también necesitamos apoyo en ese contenido?`;
    case "timeline":
      return `¿Hay alguna fecha aproximada en la que te gustaría tenerlo listo?`;
    case "scope":
      return `¿Hay alguna funcionalidad clave que no pueda faltar?`;
    default:
      return `Cuéntame un poco más sobre lo que necesitas y te oriento con el servicio adecuado.`;
  }
}

function humanReply(params: {
  message: string;
  intent: ConversationIntent;
  session: ConversationSession;
  service: CommercialService | null;
  knowledgeText?: string;
  seed: number;
}): string {
  const { message, intent, session, service, knowledgeText, seed } = params;
  const name = session.visitorName ? `${session.visitorName}, ` : "";

  if (intent === "greeting") {
    return pick(
      [
        `${name}Hola. Soy el asistente virtual de Findtec. ¿En qué te puedo orientar hoy?`,
        `${name}Bienvenido. Puedo ayudarte a encontrar el servicio adecuado entre nuestras seis soluciones. ¿Qué estás buscando?`,
        `${name}Hola. Dime qué necesitas resolver y te acompaño paso a paso.`,
      ],
      seed,
    );
  }

  if (intent === "human_handoff") {
    return `${name}Claro. Puedes escribirnos por WhatsApp al ${company.phone} o dejar una cotización en el sitio para que el equipo te responda. ¿Qué prefieres?`;
  }

  if (intent === "catalog") {
    const list = commercialServices
      .map((item, index) => `${index + 1}. **${item.label}** — ${item.description}`)
      .join("\n");
    return `${name}Trabajamos con estos seis servicios:\n\n${list}\n\n¿Cuál se acerca más a lo que necesitas?`;
  }

  if (intent === "pricing") {
    if (!service) {
      return `${name}Los proyectos se cotizan según alcance, no con una tarifa fija. Si me cuentas qué necesitas, te ayudo a preparar una solicitud sin compromiso.`;
    }
    return `${name}Para **${service.label}** no hay un precio único: depende del alcance y las funcionalidades. ${askOneQuestion({ ...session, pendingSlot: session.pendingSlot || "goal" }, seed)}`;
  }

  if (intent === "support") {
    return `${name}${
      knowledgeText ||
      "Para orientarte con soporte, dime qué está fallando, en qué equipo o sistema ocurre y qué tan urgente es."
    }`;
  }

  if (intent === "technical") {
    return `${name}${
      service
        ? `En **${service.label}**, ${service.scope}`
        : knowledgeText ||
          "Puedo orientarte con base en nuestras capacidades documentadas (web, APIs, cloud, VPN y sistemas a medida)."
    } ${session.quoteReady ? "Si quieres, preparamos una cotización con este alcance." : askOneQuestion(session, seed)}`;
  }

  if (intent === "b2g") {
    return `${name}Para instituciones atendemos con RNP vigente y documentación formal. ${
      service
        ? `Podemos encajarlo como **${service.label}**.`
        : "¿Qué tipo de solución necesitan: web, sistema, cloud o soporte?"
    }`;
  }

  if (intent === "affirm" && session.quoteReady) {
    return `${name}Perfecto. Con lo conversado puedo prepararte la solicitud de cotización${
      session.serviceLabel ? ` para **${session.serviceLabel}**` : ""
    }. Cuando quieras, usa el botón Cotizar y el formulario quedará precargado.`;
  }

  if (service && (intent === "commercial" || intent === "quote" || intent === "reference" || intent === "affirm" || intent === "deny")) {
    if (session.pendingSlot && session.pendingSlot !== "ready_quote" && intent !== "quote") {
      const openers = [
        `${name}Entiendo.`,
        `${name}De acuerdo.`,
        `${name}Anotado.`,
        `${name}Tiene sentido.`,
      ];
      if (intent === "commercial" && session.turnCount <= 1) {
        return `${pick(openers, seed)} Suena a **${service.label}**: ${service.description}\n\n${askOneQuestion(session, seed + 1)}`;
      }
      return `${pick(openers, seed)} ${askOneQuestion(session, seed + 2)}`;
    }

    const summaryBits = [
      session.goal ? `objetivo: ${session.goal}` : null,
      session.currentState ? `partida: ${session.currentState}` : null,
      session.hasAssets == null
        ? null
        : session.hasAssets
          ? "ya tienes materiales base"
          : "aún faltan algunos materiales",
    ].filter(Boolean);

    return `${name}Por lo conversado, encaja **${service.label}**${
      summaryBits.length ? ` (${summaryBits.join("; ")})` : ""
    }. ${service.scope}\n\nSi te parece, podemos preparar tu solicitud para que el equipo de Findtec revise los detalles.`;
  }

  if (intent === "clarify" || !service) {
    return `${name}${
      knowledgeText
        ? `${knowledgeText.slice(0, 220)} `
        : ""
    }Para orientarte mejor, ¿me cuentas qué problema quieres resolver o qué resultado esperas?`;
  }

  return `${name}${
    knowledgeText?.slice(0, 240) ||
    "Puedo ayudarte con sitios web, tiendas online, apps a medida, IA, cloud y soporte."
  }\n\n${askOneQuestion(session, seed)}`;
}

export function advanceConversation(params: {
  message: string;
  history?: ChatTurn[];
  session?: ConversationSession | null;
  preferredAgent?: "orquestador" | "cotizacion" | "soporte" | "tecnico" | "b2g";
}): ConversationResult {
  const history = params.history || [];
  let session = {
    ...emptySession(),
    ...(params.session || {}),
    features: [...(params.session?.features || [])],
    notes: [...(params.session?.notes || [])],
  };
  session.turnCount = (session.turnCount || 0) + 1;

  const intent = classifyIntent(params.message, session);
  session = extractSlots(params.message, session);
  session = resolveService(params.message, history, session);
  session.lastIntent = intent;
  session.pendingSlot = nextPendingSlot(session);
  session.quoteReady = session.pendingSlot === "ready_quote" || intent === "quote";

  if (intent === "affirm" && session.serviceId && session.serviceId !== "otro") {
    if (session.pendingSlot === "current_state" && !session.currentState) {
      // leave for ask
    } else if (session.pendingSlot === "assets" && session.hasAssets == null) {
      session.hasAssets = true;
      session.pendingSlot = nextPendingSlot(session);
      session.quoteReady = session.pendingSlot === "ready_quote";
    }
  }

  if (intent === "deny" && session.pendingSlot === "assets") {
    session.hasAssets = false;
    session.pendingSlot = nextPendingSlot(session);
    session.quoteReady = session.pendingSlot === "ready_quote";
  }

  const service =
    getCommercialService(session.serviceId) ||
    matchCommercialService(params.message).service ||
    null;

  const suggestion = suggestServiceFromQuery(
    [params.message, session.goal, session.serviceLabel].filter(Boolean).join(" "),
  );
  const knowledge = retrieveKnowledge(params.message, 3);
  const knowledgeText = knowledge[0]?.chunk.text;
  const seed = session.turnCount + params.message.length;

  const reply = humanReply({
    message: params.message,
    intent,
    session,
    service,
    knowledgeText,
    seed,
  });

  const suggestedService = service
    ? { value: service.value, label: service.label }
    : suggestion.option.value !== "otro"
      ? { value: suggestion.option.value, label: suggestion.option.label }
      : null;

  const quoteSummary = buildQuoteSummary(session);
  const whatsappMessage = [
    session.visitorName ? `Hola, soy ${session.visitorName}.` : "Hola,",
    "Contacto vía asistente virtual de Findtec.",
    quoteSummary,
    `Detalle reciente: ${params.message}`,
  ].join(" ");

  return {
    reply,
    intent,
    session,
    confidence: suggestion.confidence,
    suggestedService,
    quickReplies: contextualQuickReplies(intent, session),
    sources: suggestion.sources,
    nextSteps: session.quoteReady
      ? ["Revisar resumen", "Abrir cotización", "Seguimiento por WhatsApp"]
      : ["Aclarar necesidad", "Confirmar servicio", "Cotizar cuando esté listo"],
    actions: {
      whatsapp: whatsappHref(whatsappMessage),
      contactAnchor: quoteHref(
        suggestedService?.value || "otro",
        quoteSummary,
      ),
      quoteServicio: suggestedService?.value || "otro",
    },
    quoteSummary,
  };
}

export function welcomeConversation(businessHours?: boolean) {
  const greetings = businessHours
    ? [
        "Hola. Soy el asistente virtual de Findtec. Estoy disponible para orientarte en sitios web, tiendas, sistemas, IA, cloud y soporte.\n\n¿Qué necesitas resolver?",
        "Bienvenido. Puedo ayudarte a encontrar la solución adecuada entre nuestros seis servicios.\n\n¿Por dónde quieres empezar?",
      ]
    : [
        "Hola. Soy el asistente virtual de Findtec. Aunque sea fuera de horario comercial, puedo orientarte y dejarte lista una cotización.\n\n¿Qué estás buscando?",
        "Gracias por escribir. Soy el asistente digital de Findtec y te ayudo a identificar el servicio correcto.\n\n¿Qué necesitas hoy?",
      ];

  return {
    reply: greetings[Math.floor(Date.now() / 1000 / 60) % greetings.length],
    session: emptySession(),
    quickReplies: contextualQuickReplies("catalog", emptySession()),
  };
}
