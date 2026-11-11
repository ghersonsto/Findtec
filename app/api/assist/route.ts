import { NextResponse } from "next/server";
import { z } from "zod";

import { whatsappHref } from "@/lib/company";
import { retrieveKnowledge, suggestServiceFromQuery } from "@/lib/knowledge";
import { quoteHref } from "@/lib/quote";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const assistSchema = z.object({
  message: z.string().trim().min(3).max(800),
  name: z.string().trim().max(120).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  try {
    const limited = rateLimit(`assist:${clientIp(request)}`, 20, 60_000);
    if (!limited.ok) return rateLimitResponse(limited.retryAfterSec);

    const body = await request.json();
    const data = assistSchema.parse(body);
    const { option, confidence, sources } = suggestServiceFromQuery(data.message);
    const chunks = retrieveKnowledge(data.message, 3);

    const greeting = data.name?.trim() ? `${data.name.trim()}, ` : "";
    const contextLine = chunks[0]
      ? chunks[0].chunk.text
      : "Cuéntanos servicio, cantidad o urgencia y te orientamos con una ruta clara.";

    const reply = chunks.length
      ? `${greeting}Según tu consulta, encaja con **${option.label}**. ${contextLine}`
      : `${greeting}Cuéntanos un poco más (servicio, cantidad o urgencia) y te orientamos con una ruta clara.`;

    const whatsappMessage = [
      data.name?.trim() ? `Hola, soy ${data.name.trim()}.` : "Hola,",
      `Necesito ayuda con: ${option.label}.`,
      `Detalle: ${data.message}`,
    ].join(" ");

    return NextResponse.json({
      ok: true,
      reply: reply.replace(/\*\*/g, ""),
      confidence,
      suggestedService: {
        value: option.value,
        label: option.label,
      },
      sources,
      nextSteps: [
        "Confirmar alcance y prioridad",
        "Recibir recomendación o cotización",
        "Agendar seguimiento por WhatsApp o correo",
      ],
      actions: {
        whatsapp: whatsappHref(whatsappMessage),
        contactAnchor: quoteHref(option.value, data.message),
      },
      rag: {
        mode: "local-retrieval",
        hits: chunks.length,
      },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "No se pudo interpretar el mensaje. Intenta de nuevo.",
      },
      { status: 400 },
    );
  }
}
