import { NextResponse } from "next/server";

import { company, serviceOptions } from "@/lib/company";
import { heroReel } from "@/lib/media";

function getLimaBusinessContext(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Lima",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const isWeekday = !["Sat", "Sun"].includes(weekday);
  const businessHours = isWeekday && hour >= 9 && hour < 19;

  return { businessHours, hour, weekday };
}

export async function GET() {
  const mailConfigured = Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.CONTACT_TO,
  );

  const { businessHours } = getLimaBusinessContext();

  return NextResponse.json({
    ok: true,
    brand: company.name,
    tagline: "Software, IA y digitalización con soporte cercano",
    online: true,
    businessHours,
    mailConfigured,
    channels: {
      whatsapp: Boolean(company.whatsappNumber),
      email: Boolean(company.email),
      form: mailConfigured,
      phone: Boolean(company.phone),
    },
    contact: {
      email: company.email,
      phone: company.phone,
      whatsapp: company.whatsappNumber,
      city: company.shortAddress,
    },
    servicesCount: serviceOptions.length,
    services: serviceOptions.map((item) => ({
      value: item.value,
      label: item.label,
    })),
    metrics: [
      { label: "Clientes", value: "100+" },
      { label: "Enfoque", value: "B2B / B2G" },
      { label: "Soporte", value: "Continuo" },
    ],
    stack: ["Laravel", "Vue.js", "MySQL", "Docker", "Python", "FastAPI", "Microsoft 365"],
    reel: heroReel,
    responseHint:
      "Cuéntanos tu necesidad. Te respondemos con una recomendación o cotización de alcance claro.",
    updatedAt: new Date().toISOString(),
  });
}
