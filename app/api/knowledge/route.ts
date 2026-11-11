import { NextResponse } from "next/server";
import { z } from "zod";

import { knowledgeBase, retrieveKnowledge } from "@/lib/knowledge";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const querySchema = z.object({
  q: z.string().trim().min(2).max(120),
});

export async function GET(request: Request) {
  const limited = rateLimit(`knowledge:${clientIp(request)}`, 40, 60_000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfterSec);

  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("q")?.trim() || "";

  if (raw) {
    const parsed = querySchema.safeParse({ q: raw });
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Consulta inválida." },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const hits = retrieveKnowledge(parsed.data.q, 5);
    return NextResponse.json(
      {
        ok: true,
        query: parsed.data.q,
        count: hits.length,
        results: hits.map((hit) => ({
          id: hit.chunk.id,
          title: hit.chunk.title,
          service: hit.chunk.service ?? null,
          text: hit.chunk.text,
          score: hit.score,
        })),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  // Sin query: solo índice público mínimo (sin keywords completos).
  return NextResponse.json(
    {
      ok: true,
      count: knowledgeBase.length,
      documents: knowledgeBase.map((chunk) => ({
        id: chunk.id,
        title: chunk.title,
        service: chunk.service ?? null,
      })),
    },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
