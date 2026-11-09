/**
 * Fuente única de verdad: los 6 servicios comerciales de la landing Findtec.
 * Usar en chatbot, cotización, contacto, knowledge y páginas de servicios.
 */

export type CommercialServiceId =
  | "web"
  | "ecommerce"
  | "apps"
  | "ia"
  | "cloud"
  | "soporte";

export type ServiceIconKey =
  | "globe"
  | "cart"
  | "layers"
  | "brain"
  | "shield"
  | "headphones";

export type CommercialService = {
  id: CommercialServiceId;
  value: CommercialServiceId;
  label: string;
  description: string;
  scope: string;
  benefits: string[];
  useCases: string[];
  synonyms: string[];
  intents: string[];
  icon: ServiceIconKey;
};

export const commercialServices: CommercialService[] = [
  {
    id: "web",
    value: "web",
    label: "Sitios web corporativos",
    description: "Presencia digital clara, rápida y orientada a conversión.",
    scope: "Diseño a medida, SEO técnico y sitios de alto rendimiento para marcas B2B.",
    benefits: ["Diseño a medida", "SEO técnico", "Carga optimizada"],
    useCases: [
      "Página corporativa",
      "Landing de captación",
      "Sitio institucional con formularios",
    ],
    synonyms: [
      "web",
      "página",
      "pagina",
      "sitio",
      "website",
      "landing",
      "corporativo",
      "presencia digital",
      "diseño web",
    ],
    intents: [
      "necesito una pagina web",
      "quiero una web para mi empresa",
      "rediseñar mi sitio",
      "landing page",
      "sitio corporativo",
    ],
    icon: "globe",
  },
  {
    id: "ecommerce",
    value: "ecommerce",
    label: "Tiendas online",
    description:
      "Comercio con pagos locales, stock y comprobantes alineados a tu operación.",
    scope: "E-commerce con pasarelas, inventario y facturación electrónica en Perú.",
    benefits: ["Pasarelas de pago", "Inventario en vivo", "Facturación electrónica"],
    useCases: [
      "Vender productos por internet",
      "Catálogo con checkout",
      "Tienda con stock y comprobantes",
    ],
    synonyms: [
      "tienda",
      "ecommerce",
      "e-commerce",
      "comercio",
      "vender online",
      "carrito",
      "pasarela",
      "shopify",
      "marketplace",
    ],
    intents: [
      "quiero vender por internet",
      "necesito una tienda online",
      "vender mis productos",
      "pasarela de pago",
      "comercio electronico",
    ],
    icon: "cart",
  },
  {
    id: "apps",
    value: "apps",
    label: "Aplicaciones web a medida",
    description:
      "Sistemas centralizados para ventas, compras y operaciones sin licencias por usuario.",
    scope: "ERP / sistemas de gestión con usuarios, roles, kardex y stack Laravel + Vue.",
    benefits: ["Usuarios y roles", "Kardex valorizado", "Laravel + Vue"],
    useCases: [
      "Control de operaciones",
      "Inventario y ventas",
      "Sistema interno a medida",
    ],
    synonyms: [
      "erp",
      "sistema",
      "gestion",
      "gestión",
      "aplicacion",
      "aplicación",
      "software",
      "kardex",
      "inventario",
      "operaciones",
      "a medida",
      "laravel",
    ],
    intents: [
      "sistema personalizado",
      "controlar mis operaciones",
      "software de gestion",
      "necesito un erp",
      "aplicacion a medida",
    ],
    icon: "layers",
  },
  {
    id: "ia",
    value: "ia",
    label: "Integraciones con IA",
    description:
      "Extracción de datos, APIs y automatización para acelerar procesos repetitivos.",
    scope: "APIs asíncronas, lectura de documentos y automatización con IA bajo control.",
    benefits: ["Lectura de documentos", "APIs asíncronas", "Datos bajo control"],
    useCases: [
      "Extraer datos de documentos",
      "Conectar sistema con API de IA",
      "Automatizar procesos repetitivos",
    ],
    synonyms: [
      "ia",
      "inteligencia artificial",
      "api",
      "automatizacion",
      "automatización",
      "ocr",
      "documentos",
      "prediccion",
      "chatbot",
      "fastapi",
      "integracion",
      "integración",
    ],
    intents: [
      "conectar mi sistema con una api",
      "automatizar procesos",
      "extraer datos de pdf",
      "integracion con ia",
      "api de ia",
    ],
    icon: "brain",
  },
  {
    id: "cloud",
    value: "cloud",
    label: "Cloud y seguridad TI",
    description: "Entornos cloud, VPN y Microsoft 365 para equipos que operan a diario.",
    scope: "Cloud, VPN WireGuard, backups y Microsoft 365 con accesos controlados.",
    benefits: ["VPN WireGuard", "Backups automatizados", "Microsoft 365"],
    useCases: [
      "Migrar a la nube",
      "VPN corporativa",
      "Microsoft 365 y seguridad",
    ],
    synonyms: [
      "cloud",
      "nube",
      "vpn",
      "microsoft 365",
      "office 365",
      "backup",
      "respaldo",
      "seguridad",
      "infraestructura",
      "servidor",
      "wireguard",
    ],
    intents: [
      "necesito vpn",
      "migrar a la nube",
      "microsoft 365",
      "seguridad ti",
      "backups",
    ],
    icon: "shield",
  },
  {
    id: "soporte",
    value: "soporte",
    label: "Mantenimiento y soporte",
    description: "Mesa de ayuda con ingenieros que conocen tu infraestructura.",
    scope: "Soporte presencial y remoto, respuesta < 24h y monitoreo preventivo.",
    benefits: ["Respuesta < 24h", "Presencial y remoto", "Monitoreo preventivo"],
    useCases: [
      "Mesa de ayuda TI",
      "Mantenimiento preventivo",
      "Incidencias de infraestructura",
    ],
    synonyms: [
      "soporte",
      "mantenimiento",
      "mesa de ayuda",
      "ticket",
      "incidencia",
      "falla",
      "ayuda tecnica",
      "ayuda técnica",
      "monitoreo",
    ],
    intents: [
      "necesito soporte tecnico",
      "mi sistema fallo",
      "mantenimiento ti",
      "mesa de ayuda",
      "incidente",
    ],
    icon: "headphones",
  },
];

/** Opciones de formulario: 6 servicios + Otro */
export const serviceOptions = [
  ...commercialServices.map((service) => ({
    value: service.value,
    label: service.label,
  })),
  { value: "otro", label: "Otro" },
] as const;

export type ServiceOptionValue = (typeof serviceOptions)[number]["value"];

/** Claves legacy → oferta actual de la landing */
export const SERVICE_ALIASES: Record<string, ServiceOptionValue> = {
  "software-gestion": "apps",
  automatizacion: "ia",
  datos: "cloud",
  redes: "cloud",
  seguridad: "cloud",
  hardware: "otro",
  consultoria: "otro",
  b2g: "otro",
  automotriz: "otro",
  mantenimiento: "soporte",
};

export function resolveServiceValue(value?: string | null): ServiceOptionValue | "" {
  if (!value) return "";
  const direct = serviceOptions.find((item) => item.value === value);
  if (direct) return direct.value;
  return SERVICE_ALIASES[value] || "";
}

export function getCommercialService(id?: string | null) {
  const resolved = resolveServiceValue(id);
  return commercialServices.find((service) => service.id === resolved) || null;
}

export function getServiceOption(id?: string | null) {
  const resolved = resolveServiceValue(id) || id;
  return serviceOptions.find((item) => item.value === resolved) || null;
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Clasificación por sinónimos + intenciones + texto del catálogo. */
export function matchCommercialService(query: string) {
  const text = normalize(query);
  let best: CommercialService | null = null;
  let bestScore = 0;

  for (const service of commercialServices) {
    let score = 0;
    const label = normalize(service.label);
    if (text.includes(label) || label.includes(text)) score += 8;

    for (const synonym of service.synonyms) {
      const syn = normalize(synonym);
      if (syn.length < 3) continue;
      if (text.includes(syn)) score += syn.length > 6 ? 5 : 3;
    }

    for (const intent of service.intents) {
      const intentNorm = normalize(intent);
      const overlap = intentNorm
        .split(/\s+/)
        .filter((token) => token.length > 3 && text.includes(token)).length;
      if (overlap >= 2) score += 6;
      if (text.includes(intentNorm)) score += 10;
    }

    if (score > bestScore) {
      bestScore = score;
      best = service;
    }
  }

  const confidence = bestScore <= 0 ? 0 : Math.min(0.96, 0.35 + bestScore * 0.06);

  return {
    service: best,
    option: best
      ? { value: best.value, label: best.label }
      : { value: "otro" as const, label: "Otro" },
    score: bestScore,
    confidence,
  };
}
