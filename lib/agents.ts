import {
  advanceConversation,
  welcomeConversation,
  type ChatTurn,
  type ConversationSession,
  type QuickReply,
} from "@/lib/conversation";
import { commercialServices } from "@/lib/services";

export type AgentId = "orquestador" | "cotizacion" | "soporte" | "tecnico" | "b2g";

export type AgentProfile = {
  id: AgentId;
  name: string;
  role: string;
  tone: string;
  keywords: string[];
};

export type { ChatTurn, ConversationSession, QuickReply };

type IncomingSession = Partial<ConversationSession> & {
  features?: string[];
  notes?: string[];
  turnCount?: number;
};

export const agents: AgentProfile[] = [
  {
    id: "orquestador",
    name: "Asistente Findtec",
    role: "Orientación comercial",
    tone: "Cercano, claro y profesional. Escucha antes de recomendar.",
    keywords: ["hola", "inicio", "ayuda", "info", "quién", "findtec", "servicios"],
  },
  {
    id: "cotizacion",
    name: "Cotizaciones",
    role: "Especialista comercial",
    tone: "Acompaña la necesidad hasta una cotización bien planteada.",
    keywords: [
      "cotiz",
      "precio",
      "presupuesto",
      "propuesta",
      "comprar",
      "contratar",
      "servicio",
      "web",
      "tienda",
      "ecommerce",
      "erp",
      "sistema",
      "ia",
      "api",
      "cloud",
      "365",
      "soporte",
    ],
  },
  {
    id: "soporte",
    name: "Soporte TI",
    role: "Mesa de ayuda",
    tone: "Empático y práctico ante incidencias.",
    keywords: ["soporte", "falla", "error", "ticket", "ayuda", "incidente", "lento", "no funciona"],
  },
  {
    id: "tecnico",
    name: "Arquitectura TI",
    role: "Especialista técnico",
    tone: "Preciso, sin inventar capacidades no documentadas.",
    keywords: [
      "red",
      "vpn",
      "servidor",
      "docker",
      "laravel",
      "api",
      "arquitectura",
      "infraestructura",
      "mysql",
      "seguridad",
    ],
  },
  {
    id: "b2g",
    name: "Sector público",
    role: "Especialista B2G",
    tone: "Formal, claro y orientado a contratación institucional.",
    keywords: ["estado", "público", "b2g", "rnp", "gobierno", "entidad", "contratación"],
  },
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function routeAgent(message: string, preferred?: AgentId): AgentProfile {
  if (preferred && preferred !== "orquestador") {
    return agents.find((agent) => agent.id === preferred) || agents[0];
  }

  const text = normalize(message);
  let best: AgentProfile = agents[0];
  let bestScore = 0;

  for (const agent of agents) {
    if (agent.id === "orquestador") continue;
    let score = 0;
    for (const keyword of agent.keywords) {
      if (text.includes(keyword)) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = agent;
    }
  }

  if (bestScore === 0) {
    return agents.find((agent) => agent.id === "cotizacion")!;
  }
  return best;
}

export function buildAgentReply(
  message: string,
  agent: AgentProfile,
  name?: string,
  history?: ChatTurn[],
  session?: IncomingSession | null,
) {
  const baseSession: ConversationSession = {
    features: session?.features || [],
    notes: session?.notes || [],
    turnCount: session?.turnCount || 0,
    ...session,
  };
  const conversation = advanceConversation({
    message,
    history,
    session: name?.trim()
      ? { ...baseSession, visitorName: name.trim() }
      : session
        ? baseSession
        : null,
    preferredAgent: agent.id,
  });

  // Force agent focus when user explicitly selected a category with weak commercial signal
  let reply = conversation.reply;
  if (agent.id === "soporte" && conversation.intent !== "support" && !conversation.session.serviceId) {
    reply = `${conversation.session.visitorName ? `${conversation.session.visitorName}, ` : ""}Estoy en modo soporte. Cuéntame el síntoma, el sistema afectado y la urgencia para orientarte.`;
  }
  if (agent.id === "b2g" && conversation.intent !== "b2g" && !/estado|público|b2g|rnp|gobierno/i.test(message)) {
    reply = `${conversation.session.visitorName ? `${conversation.session.visitorName}, ` : ""}Para sector público trabajamos con RNP vigente y documentación formal. ¿Qué solución necesita la entidad?`;
  }

  return {
    reply,
    confidence: conversation.confidence,
    agent,
    suggestedService: conversation.suggestedService || {
      value: "otro",
      label: "Otro",
    },
    sources: conversation.sources,
    nextSteps: conversation.nextSteps,
    actions: conversation.actions,
    catalogHint: commercialServices.map((item) => item.label),
    quickReplies: conversation.quickReplies,
    session: conversation.session,
    quoteSummary: conversation.quoteSummary,
    intent: conversation.intent,
  };
}

export function welcomeMessage(businessHours?: boolean) {
  const welcome = welcomeConversation(businessHours);
  const orquestador = agents[0];
  return {
    agent: orquestador,
    reply: welcome.reply,
    quickReplies: welcome.quickReplies,
    session: welcome.session,
  };
}
