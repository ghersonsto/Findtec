import { NextResponse } from "next/server";
import { z } from "zod";

import { agents, buildAgentReply, routeAgent, welcomeMessage, type AgentId } from "@/lib/agents";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const sessionSchema = z
  .object({
    visitorName: z.string().max(80).optional(),
    serviceId: z
      .enum(["web", "ecommerce", "apps", "ia", "cloud", "soporte", "otro"])
      .optional(),
    serviceLabel: z.string().max(120).optional(),
    goal: z.string().max(200).optional(),
    projectType: z.string().max(80).optional(),
    currentState: z.string().max(80).optional(),
    hasAssets: z.boolean().optional(),
    features: z.array(z.string().max(60)).max(12).optional(),
    timeline: z.string().max(80).optional(),
    notes: z.array(z.string().max(200)).max(8).optional(),
    pendingSlot: z
      .enum([
        "discover",
        "confirm_service",
        "goal",
        "current_state",
        "assets",
        "scope",
        "timeline",
        "ready_quote",
      ])
      .optional(),
    quoteReady: z.boolean().optional(),
    lastIntent: z.string().max(40).optional(),
    turnCount: z.number().int().min(0).max(200).optional(),
  })
  .optional();

const schema = z.object({
  message: z.string().trim().min(1).max(800).optional().or(z.literal("")),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  agentId: z
    .enum(["orquestador", "cotizacion", "soporte", "tecnico", "b2g"])
    .optional(),
  mode: z.enum(["chat", "welcome"]).optional(),
  businessHours: z.boolean().optional(),
  stream: z.boolean().optional(),
  session: sessionSchema.nullable().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "agent"]),
        text: z.string().max(800),
      }),
    )
    .max(12)
    .optional(),
});

export async function GET() {
  return NextResponse.json({
    ok: true,
    realtime: true,
    agents: agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      role: agent.role,
      tone: agent.tone,
    })),
  });
}

export async function POST(request: Request) {
  try {
    const limited = rateLimit(`agents:${clientIp(request)}`, 40, 60_000);
    if (!limited.ok) return rateLimitResponse(limited.retryAfterSec);

    const body = await request.json();
    const data = schema.parse(body);

    if (data.mode === "welcome" || !data.message?.trim()) {
      const welcome = welcomeMessage(Boolean(data.businessHours));
      return NextResponse.json({
        ok: true,
        mode: "welcome",
        ...welcome,
        agent: {
          id: welcome.agent.id,
          name: welcome.agent.name,
          role: welcome.agent.role,
        },
        realtime: true,
      });
    }

    const agent = routeAgent(data.message, data.agentId as AgentId | undefined);
    const incomingSession = data.session
      ? {
          visitorName: data.session.visitorName,
          serviceId: data.session.serviceId,
          serviceLabel: data.session.serviceLabel,
          goal: data.session.goal,
          projectType: data.session.projectType,
          currentState: data.session.currentState,
          hasAssets: data.session.hasAssets,
          features: data.session.features || [],
          timeline: data.session.timeline,
          notes: data.session.notes || [],
          pendingSlot: data.session.pendingSlot,
          quoteReady: data.session.quoteReady,
          turnCount: data.session.turnCount || 0,
        }
      : null;
    const result = buildAgentReply(
      data.message,
      agent,
      data.name,
      data.history,
      incomingSession,
    );

    const payload = {
      ok: true,
      mode: "chat" as const,
      reply: result.reply,
      confidence: result.confidence,
      agent: {
        id: result.agent.id,
        name: result.agent.name,
        role: result.agent.role,
      },
      suggestedService: {
        value: result.suggestedService.value,
        label: result.suggestedService.label,
      },
      sources: result.sources,
      nextSteps: result.nextSteps,
      actions: result.actions,
      catalogHint: result.catalogHint,
      quickReplies: result.quickReplies,
      session: result.session,
      quoteSummary: result.quoteSummary,
      intent: result.intent,
      handoff:
        data.agentId && data.agentId !== result.agent.id
          ? `Derivado a ${result.agent.name}`
          : `Agente activo: ${result.agent.name}`,
      realtime: true,
    };

    if (!data.stream) {
      return NextResponse.json(payload);
    }

    const encoder = new TextEncoder();
    const reply = result.reply;
    const chunkSize = 3;

    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "meta",
              agent: payload.agent,
              suggestedService: payload.suggestedService,
              actions: payload.actions,
              confidence: payload.confidence,
              handoff: payload.handoff,
              quickReplies: payload.quickReplies,
              session: payload.session,
              quoteSummary: payload.quoteSummary,
              intent: payload.intent,
            })}\n\n`,
          ),
        );

        await new Promise((resolve) => setTimeout(resolve, 140));

        for (let i = 0; i < reply.length; i += chunkSize) {
          const chunk = reply.slice(i, i + chunkSize);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "token", text: chunk })}\n\n`),
          );
          await new Promise((resolve) => setTimeout(resolve, 14 + Math.random() * 18));
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "No se pudo procesar el mensaje del agente." },
      { status: 400 },
    );
  }
}
