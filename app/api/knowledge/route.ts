import { NextResponse } from "next/server";

import { knowledgeBase, retrieveKnowledge } from "@/lib/knowledge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";

  if (q) {
    const hits = retrieveKnowledge(q, 5);
    return NextResponse.json({
      ok: true,
      query: q,
      count: hits.length,
      results: hits.map((hit) => ({
        id: hit.chunk.id,
        title: hit.chunk.title,
        service: hit.chunk.service ?? null,
        text: hit.chunk.text,
        score: hit.score,
      })),
    });
  }

  return NextResponse.json({
    ok: true,
    count: knowledgeBase.length,
    documents: knowledgeBase.map((chunk) => ({
      id: chunk.id,
      title: chunk.title,
      service: chunk.service ?? null,
      keywords: chunk.keywords,
    })),
  });
}
