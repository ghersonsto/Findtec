import { NextResponse } from "next/server";

import { company, serviceOptions } from "@/lib/company";
import { heroReel, imageForService } from "@/lib/media";

const catalog = [
  {
    value: "software-gestion",
    title: "Software de gestión",
    category: "Digitalización",
    description:
      "Sistemas a medida para ordenar ventas, operaciones, inventarios y reportes.",
  },
  {
    value: "ia",
    title: "Integraciones con IA",
    category: "Inteligencia",
    description:
      "Asistentes, automatización inteligente y flujos que reducen trabajo manual.",
  },
  {
    value: "web",
    title: "Desarrollo web",
    category: "Software",
    description: "Sitios y aplicaciones con Laravel, Vue.js y buenas prácticas.",
  },
  {
    value: "cloud",
    title: "Cloud y Microsoft 365",
    category: "Productividad",
    description: "Implementación, licencias, seguridad y administración cloud.",
  },
  {
    value: "soporte",
    title: "Soporte técnico",
    category: "Operación",
    description: "Mesa de ayuda remota y presencial con seguimiento documentado.",
  },
  {
    value: "redes",
    title: "Redes e infraestructura",
    category: "Conectividad",
    description: "LAN/WAN, Wi-Fi corporativo, respaldos y continuidad.",
  },
  {
    value: "hardware",
    title: "Hardware empresarial",
    category: "Equipamiento",
    description: "Equipos listos para operar con garantía y documentación.",
  },
  {
    value: "datos",
    title: "Análisis de datos",
    category: "Data",
    description: "Dashboards, indicadores y modelos para decidir mejor.",
  },
  {
    value: "automotriz",
    title: "Consultoría automotriz",
    category: "Especialidad",
    description: "Analytics y optimización de procesos para el sector automotriz.",
  },
  {
    value: "mantenimiento",
    title: "Mantenimiento preventivo",
    category: "Continuidad",
    description: "Revisión de equipos, software, respaldos y recomendaciones.",
  },
];

export async function GET() {
  const services = catalog.map((item) => ({
    ...item,
    image: imageForService(item.value),
    cta: "Cotizar este servicio",
  }));

  return NextResponse.json({
    ok: true,
    brand: company.name,
    count: services.length,
    services,
    formOptions: serviceOptions,
    reel: heroReel,
    updatedAt: new Date().toISOString(),
  });
}
