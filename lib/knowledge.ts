import { company } from "@/lib/company";
import {
  commercialServices,
  getServiceOption,
  matchCommercialService,
  serviceOptions,
  type CommercialService,
} from "@/lib/services";

export type KnowledgeChunk = {
  id: string;
  title: string;
  service?: string;
  text: string;
  keywords: string[];
};

function serviceChunk(service: CommercialService): KnowledgeChunk {
  return {
    id: service.id,
    title: service.label,
    service: service.id,
    text: `${service.label}: ${service.description} Alcance: ${service.scope} Beneficios: ${service.benefits.join(", ")}. Casos de uso: ${service.useCases.join("; ")}.`,
    keywords: [
      ...service.synonyms,
      ...service.benefits.map((item) => item.toLowerCase()),
      service.label.toLowerCase(),
    ],
  };
}

/** Corpus RAG local alineado a los 6 servicios de la landing. */
export const knowledgeBase: KnowledgeChunk[] = [
  {
    id: "empresa",
    title: "Findtec Soluciones",
    text: `${company.name} (${company.legalName}, RUC ${company.ruc}) ofrece sitios web, tiendas online, aplicaciones a medida, integraciones con IA, cloud/seguridad TI y soporte en Perú. Contacto: ${company.email}, ${company.phone}. ${company.address}.`,
    keywords: ["findtec", "empresa", "lima", "perú", "contacto", "quiénes", "nosotros", "ruc"],
  },
  ...commercialServices.map(serviceChunk),
  {
    id: "b2g",
    title: "Sector público B2G",
    service: "otro",
    text: "Atención a entidades del Estado con RNP vigente, documentación técnica y procesos de contratación pública. Los proyectos B2G se cotizan según el servicio requerido (web, sistemas, cloud, etc.).",
    keywords: ["estado", "público", "b2g", "rnp", "gobierno", "entidad", "contratación", "osce"],
  },
  {
    id: "proceso",
    title: "Cómo trabajamos",
    text: "1) Diagnóstico de necesidad y prioridad. 2) Propuesta con alcance y entregables. 3) Implementación segura. 4) Soporte y seguimiento post entrega. Cotización personalizada sin compromiso; respuesta en menos de 24 h.",
    keywords: ["proceso", "cómo", "pasos", "metodología", "cotización", "alcance", "plazo"],
  },
  {
    id: "catalogo",
    title: "Catálogo de servicios Findtec",
    text: `Oferta comercial: ${commercialServices.map((service) => service.label).join("; ")}.`,
    keywords: [
      "servicios",
      "catálogo",
      "catalogo",
      "ofrecen",
      "qué hacen",
      "que hacen",
      "soluciones",
    ],
  },
];

function tokenize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9áéíóúñü]+/i)
    .filter((token) => token.length > 2);
}

export function retrieveKnowledge(query: string, limit = 3) {
  const tokens = tokenize(query);
  if (!tokens.length) return [];

  const scored = knowledgeBase.map((chunk) => {
    const haystack = tokenize(`${chunk.title} ${chunk.text} ${chunk.keywords.join(" ")}`);
    let score = 0;

    for (const token of tokens) {
      if (chunk.keywords.some((keyword) => keyword.includes(token) || token.includes(keyword))) {
        score += 3;
      }
      if (haystack.includes(token)) score += 2;
      if (chunk.title.toLowerCase().includes(token)) score += 1;
    }

    return { chunk, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function suggestServiceFromQuery(query: string) {
  const matched = matchCommercialService(query);
  const hits = retrieveKnowledge(query, 4);

  if (matched.service && matched.score >= 3) {
    return {
      option: { value: matched.service.value, label: matched.service.label },
      confidence: matched.confidence,
      sources: hits.map((hit) => ({
        id: hit.chunk.id,
        title: hit.chunk.title,
        excerpt: hit.chunk.text.slice(0, 160),
        score: hit.score,
      })),
      service: matched.service,
    };
  }

  const withService = hits.find((hit) => hit.chunk.service);
  const value = withService?.chunk.service || "otro";
  const option =
    getServiceOption(value) ||
    serviceOptions.find((service) => service.value === "otro")!;

  const topScore = hits[0]?.score ?? 0;
  const confidence = Math.min(0.9, 0.32 + topScore * 0.07);

  return {
    option: { value: option.value, label: option.label },
    confidence,
    sources: hits.map((hit) => ({
      id: hit.chunk.id,
      title: hit.chunk.title,
      excerpt: hit.chunk.text.slice(0, 160),
      score: hit.score,
    })),
    service: commercialServices.find((item) => item.id === option.value) || null,
  };
}
