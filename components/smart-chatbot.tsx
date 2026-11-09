"use client";

import {
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  Globe,
  Headphones,
  Layers,
  MessageCircle,
  Send,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import { FindtecMark } from "@/components/brand-logo";
import { useSiteStatus } from "@/hooks/use-site-status";
import type { AgentId, ConversationSession, QuickReply } from "@/lib/agents";
import { company } from "@/lib/company";
import { startQuote } from "@/lib/quote";
import {
  commercialServices,
  type CommercialService,
  type ServiceIconKey,
} from "@/lib/services";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "agent";
  text: string;
  agentName?: string;
  agentRole?: string;
  agentId?: AgentId;
  streaming?: boolean;
};

const AGENT_CHIPS: { id: AgentId; name: string }[] = [
  { id: "orquestador", name: "General" },
  { id: "cotizacion", name: "Cotización" },
  { id: "soporte", name: "Soporte" },
  { id: "tecnico", name: "Técnico" },
  { id: "b2g", name: "B2G" },
];

const SERVICE_ICONS: Record<ServiceIconKey, LucideIcon> = {
  globe: Globe,
  cart: ShoppingCart,
  layers: Layers,
  brain: BrainCircuit,
  shield: ShieldCheck,
  headphones: Headphones,
};

const panelSpring = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.85 };
const tapSpring = { type: "spring" as const, stiffness: 400, damping: 28, mass: 0.8 };

function msgId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatAgentText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground dark:text-slate-50">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function SmartChatbot() {
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [activeAgent, setActiveAgent] = useState<AgentId>("orquestador");
  const [statusLine, setStatusLine] = useState("disponible");
  const [isTyping, setIsTyping] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [suggestedService, setSuggestedService] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [actions, setActions] = useState<{ whatsapp?: string; contactAnchor?: string }>({});
  const [nudge, setNudge] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [booted, setBooted] = useState(false);
  const [stickToBottom, setStickToBottom] = useState(true);
  const [showJumpBottom, setShowJumpBottom] = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [conversationSession, setConversationSession] = useState<ConversationSession | null>(
    null,
  );
  const [quoteSummary, setQuoteSummary] = useState("");
  const [quoteReady, setQuoteReady] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionRef = useRef<ConversationSession | null>(null);
  const lastFailedPrompt = useRef<{ text: string; agent?: AgentId } | null>(null);
  const { status: siteStatus } = useSiteStatus();

  useEffect(() => {
    sessionRef.current = conversationSession;
  }, [conversationSession]);

  const online =
    Boolean(siteStatus.businessHours) || statusLine.toLowerCase().includes("disponible");

  useEffect(() => {
    const openChatbot = () => {
      setIsOpen(true);
      setNudge(false);
    };
    window.addEventListener("open-findtec-chatbot", openChatbot);
    return () => window.removeEventListener("open-findtec-chatbot", openChatbot);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTrigger(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
        if (entry.isIntersecting) setIsOpen(false);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const fabVisible = showTrigger && !footerVisible && !isOpen;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    const key = "findtec-chat-nudge";
    if (sessionStorage.getItem(key)) return;
    const timer = window.setTimeout(() => {
      if (!isOpen) {
        setNudge(true);
        sessionStorage.setItem(key, "1");
      }
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || booted) return;

    const boot = async () => {
      setIsTyping(true);
      setStatusLine("Conectando…");
      try {
        const response = await fetch("/api/agents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "welcome",
            businessHours: siteStatus.businessHours,
          }),
        });
        const payload = await response.json();
        if (!response.ok || !payload.ok) throw new Error("welcome_fail");

        setActiveAgent(payload.agent?.id || "orquestador");
        setQuickReplies(payload.quickReplies || []);
        if (payload.session) setConversationSession(payload.session);
        setStatusLine("disponible");
        setMessages([
          {
            id: msgId(),
            role: "agent",
            text: payload.reply,
            agentName: payload.agent?.name,
            agentRole: "Asistente virtual",
            agentId: payload.agent?.id,
          },
        ]);
        setBooted(true);
      } catch {
        setMessages([
          {
            id: msgId(),
            role: "agent",
            text: "Hola. Soy el asistente virtual de Findtec. Puedo orientarte en sitios web, tiendas online, apps a medida, IA, cloud y soporte.\n\n¿Qué necesitas resolver?",
            agentName: "Asistente Findtec",
            agentRole: "Asistente virtual",
            agentId: "orquestador",
          },
        ]);
        setBooted(true);
        setStatusLine("disponible");
      } finally {
        setIsTyping(false);
      }
    };

    void boot();
  }, [isOpen, booted, siteStatus.businessHours]);

  useEffect(() => {
    setShowServicePicker(activeAgent === "cotizacion");
  }, [activeAgent]);

  const scrollToBottom = useCallback(
    (smooth = true) => {
      const el = listRef.current;
      if (!el) return;
      el.scrollTo({
        top: el.scrollHeight,
        behavior: reduceMotion || !smooth ? "auto" : "smooth",
      });
    },
    [reduceMotion],
  );

  const onListScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distance < 64;
    setStickToBottom(nearBottom);
    setShowJumpBottom(!nearBottom && messages.length > 2);
  };

  useLayoutEffect(() => {
    if (!stickToBottom) return;
    scrollToBottom(true);
  }, [messages, isTyping, stickToBottom, scrollToBottom]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = window.requestAnimationFrame(() => textareaRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 88)}px`;
  };

  useEffect(() => {
    resizeTextarea();
  }, [input]);

  const streamAgentReply = async (text: string, preferredAgent?: AgentId) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setInput("");
    setQuickReplies([]);
    setSuggestedService(null);
    setSendError(false);
    setStickToBottom(true);
    lastFailedPrompt.current = null;

    const historyPayload = [
      ...messages
        .filter((message) => message.text.trim() && !message.streaming)
        .slice(-7)
        .map((message) => ({
          role: message.role,
          text: message.text.slice(0, 500),
        })),
      { role: "user" as const, text: trimmed.slice(0, 500) },
    ];

    setMessages((current) => [...current, { id: msgId(), role: "user", text: trimmed }]);
    setIsTyping(true);
    setStatusLine("pensando…");

    const streamId = msgId();
    setMessages((current) => [
      ...current,
      {
        id: streamId,
        role: "agent",
        text: "",
        streaming: true,
        agentName: "Asistente Findtec",
        agentRole: "Asistente virtual",
      },
    ]);

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          agentId: preferredAgent || activeAgent,
          businessHours: siteStatus.businessHours,
          stream: true,
          history: historyPayload,
          session: sessionRef.current,
        }),
      });

      if (!response.ok || !response.body) throw new Error("fail");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          const json = JSON.parse(line.replace(/^data:\s*/, ""));

          if (json.type === "meta") {
            setActiveAgent(json.agent?.id || "cotizacion");
            const suggested = json.suggestedService as
              | { value: string; label: string }
              | undefined;
            setSuggestedService(
              suggested && suggested.value !== "otro" ? suggested : null,
            );
            setQuoteReady(Boolean(json.session?.quoteReady));
            if (json.session) setConversationSession(json.session);
            if (json.quoteSummary) setQuoteSummary(json.quoteSummary);
            if (Array.isArray(json.quickReplies)) setQuickReplies(json.quickReplies);
            setActions(json.actions || {});
            setStatusLine("escribiendo…");
            setMessages((current) =>
              current.map((message) =>
                message.id === streamId
                  ? {
                      ...message,
                      agentName: json.agent?.name || "Asistente Findtec",
                      agentRole: "Asistente virtual",
                      agentId: json.agent?.id,
                    }
                  : message,
              ),
            );
          }

          if (json.type === "token") {
            setMessages((current) =>
              current.map((message) =>
                message.id === streamId
                  ? { ...message, text: `${message.text}${json.text}` }
                  : message,
              ),
            );
          }

          if (json.type === "done") {
            setMessages((current) =>
              current.map((message) =>
                message.id === streamId ? { ...message, streaming: false } : message,
              ),
            );
            setStatusLine("disponible");
          }
        }
      }
    } catch {
      lastFailedPrompt.current = { text: trimmed, agent: preferredAgent || activeAgent };
      setSendError(true);
      setMessages((current) =>
        current.map((message) =>
          message.id === streamId
            ? {
                ...message,
                streaming: false,
                agentName: "Asistente Findtec",
                agentRole: "Asistente virtual",
                text: "Se interrumpió la respuesta. Puedes reintentar o escribirnos por WhatsApp.",
              }
            : message,
        ),
      );
      setStatusLine("disponible");
    } finally {
      setIsTyping(false);
    }
  };

  const selectCommercialService = (service: CommercialService) => {
    setActiveAgent("cotizacion");
    setShowServicePicker(false);
    setConversationSession((current) => ({
      features: current?.features || [],
      notes: current?.notes || [],
      turnCount: current?.turnCount || 0,
      ...current,
      serviceId: service.id,
      serviceLabel: service.label,
      pendingSlot: "goal",
    }));
    void streamAgentReply(
      `Necesito orientación sobre ${service.label}.`,
      "cotizacion",
    );
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void streamAgentReply(input);
  };

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void streamAgentReply(input);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end p-3 sm:p-5">
      <div className="pointer-events-auto relative flex w-full max-w-[min(100%,22rem)] flex-col items-end gap-2.5">
        <AnimatePresence>
          {nudge && !isOpen && fabVisible ? (
            <motion.button
              type="button"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.96 }}
              transition={reduceMotion ? { duration: 0.01 } : panelSpring}
              onClick={() => {
                setIsOpen(true);
                setNudge(false);
              }}
              className="mb-0.5 max-w-[200px] rounded-2xl border border-black/[0.06] bg-white/95 px-3 py-2 text-left text-sm shadow-[0_12px_28px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/[0.1] dark:bg-[#101A2C]/95"
            >
              <span className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none" />
                Asistente Findtec
              </span>
              <span className="mt-0.5 block text-[11px] text-muted-foreground">
                Orientación en 6 servicios.
              </span>
            </motion.button>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen ? (
            <motion.div
              key="findtec-chat"
              role="dialog"
              aria-modal="true"
              aria-label="Asistente Findtec Soluciones"
              initial={
                reduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, scale: 0.96, y: 12, transformOrigin: "bottom right" }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
              transition={reduceMotion ? { duration: 0.01 } : panelSpring}
              style={{ transformOrigin: "bottom right" }}
              className={cn(
                "relative flex w-[min(100%,340px)] flex-col overflow-hidden",
                "h-[min(460px,calc(100dvh-100px))] max-h-[calc(100dvh-100px)]",
                "rounded-[1.15rem] border border-black/[0.08] bg-[#F8FAFC]/96",
                "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_48px_rgba(15,23,42,0.16)]",
                "backdrop-blur-xl",
                "dark:border-white/[0.1] dark:bg-[#080E1A]/94",
                "dark:shadow-[0_0_0_1px_rgba(37,99,235,0.14),0_24px_56px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.06)]",
              )}
            >
              <div
                className="pointer-events-none absolute -right-8 -top-12 size-32 rounded-full bg-primary/20 blur-3xl dark:bg-primary/25"
                aria-hidden
              />

              <header className="relative z-10 shrink-0 border-b border-black/[0.06] bg-white/85 px-3 pb-2.5 pt-2.5 dark:border-white/[0.08] dark:bg-[#101A2C]/92">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="relative shrink-0">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/30 blur-md"
                        animate={
                          reduceMotion
                            ? undefined
                            : { opacity: [0.35, 0.7, 0.35], scale: [0.95, 1.05, 0.95] }
                        }
                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                        aria-hidden
                      />
                      <FindtecMark
                        className="relative size-9 ring-2 ring-primary/30"
                        title="Asistente Findtec"
                      />
                      {online ? (
                        <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-white bg-emerald-400 dark:border-[#101A2C]" />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-display text-[13px] font-bold tracking-tight text-foreground">
                        Asistente Findtec
                      </h2>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {statusLine}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                    transition={tapSpring}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-black/[0.03] text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground dark:border-white/[0.08] dark:bg-white/[0.04]"
                    aria-label="Cerrar asistente"
                  >
                    <X className="size-3.5" />
                  </motion.button>
                </div>

                <div className="mt-2 flex gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {AGENT_CHIPS.map((chip) => {
                    const active = activeAgent === chip.id;
                    return (
                      <motion.button
                        key={chip.id}
                        type="button"
                        onClick={() => {
                          setActiveAgent(chip.id);
                          if (chip.id === "cotizacion") setShowServicePicker(true);
                        }}
                        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                        transition={tapSpring}
                        className={cn(
                          "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors",
                          active
                            ? "border-primary/50 bg-primary text-primary-foreground shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                            : "border-black/[0.06] bg-[#F1F5F9] text-zinc-600 hover:border-primary/30 hover:text-primary dark:border-white/[0.08] dark:bg-[#152238] dark:text-slate-300",
                        )}
                      >
                        {chip.name}
                      </motion.button>
                    );
                  })}
                </div>
              </header>

              <div className="relative min-h-0 flex-1">
                <div
                  ref={listRef}
                  onScroll={onListScroll}
                  className="h-full space-y-2.5 overflow-y-auto overscroll-contain px-3 py-3 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/15"
                >
                  {messages.map((message) => {
                    const isUser = message.role === "user";
                    return (
                      <motion.div
                        key={message.id}
                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={
                          reduceMotion
                            ? { duration: 0.01 }
                            : { type: "spring", stiffness: 400, damping: 28 }
                        }
                        className={cn("flex", isUser ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "rounded-2xl px-3 py-2 text-[13px] leading-relaxed",
                            isUser
                              ? "max-w-[85%] rounded-br-md bg-primary text-primary-foreground shadow-[0_6px_16px_rgba(37,99,235,0.28)]"
                              : "max-w-[90%] rounded-bl-md border border-black/[0.05] bg-white text-zinc-800 shadow-sm dark:border-white/[0.08] dark:bg-[#152238] dark:text-slate-100",
                          )}
                        >
                          {!isUser && message.agentName ? (
                            <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-primary dark:text-sky-300">
                              {message.agentName}
                              {message.agentRole ? ` · ${message.agentRole}` : ""}
                            </p>
                          ) : null}
                          <div className="whitespace-pre-wrap break-words">
                            {isUser ? message.text : formatAgentText(message.text)}
                          </div>
                          {message.streaming ? (
                            <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-primary align-middle dark:bg-sky-300" />
                          ) : null}
                        </div>
                      </motion.div>
                    );
                  })}

                  {isTyping && !messages.some((message) => message.streaming) ? (
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex gap-1">
                        <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:120ms]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:240ms]" />
                      </span>
                      Procesando…
                    </div>
                  ) : null}

                  {showServicePicker && !isTyping ? (
                    <div className="rounded-xl border border-black/[0.06] bg-white/80 p-2 dark:border-white/[0.08] dark:bg-[#101A2C]/80">
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary dark:text-sky-300">
                          6 servicios
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowServicePicker(false)}
                          className="text-[10px] font-medium text-muted-foreground hover:text-foreground"
                        >
                          Ocultar
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {commercialServices.map((service) => {
                          const Icon = SERVICE_ICONS[service.icon];
                          const selected = suggestedService?.value === service.value;
                          return (
                            <motion.button
                              key={service.id}
                              type="button"
                              disabled={isTyping}
                              whileHover={reduceMotion ? undefined : { y: -1 }}
                              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                              transition={tapSpring}
                              onClick={() => selectCommercialService(service)}
                              className={cn(
                                "rounded-xl border px-2 py-2 text-left transition-colors",
                                selected
                                  ? "border-primary/50 bg-primary/15 shadow-[0_0_0_1px_rgba(37,99,235,0.25)]"
                                  : "border-black/[0.06] bg-[#F8FAFC] hover:border-primary/35 dark:border-white/[0.08] dark:bg-[#152238] dark:hover:border-primary/40",
                              )}
                            >
                              <span className="mb-1 flex size-6 items-center justify-center rounded-lg bg-primary/15 text-primary">
                                <Icon className="size-3.5" />
                              </span>
                              <span className="block text-[11px] font-semibold leading-tight text-foreground">
                                {service.label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {activeAgent === "cotizacion" && !showServicePicker && !isTyping ? (
                    <button
                      type="button"
                      onClick={() => setShowServicePicker(true)}
                      className="text-[11px] font-semibold text-primary hover:underline dark:text-sky-300"
                    >
                      Ver los 6 servicios
                    </button>
                  ) : null}

                  {quickReplies.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {quickReplies.map((item) => (
                        <motion.button
                          key={item.label}
                          type="button"
                          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                          transition={tapSpring}
                          onClick={() => void streamAgentReply(item.prompt, item.agent)}
                          className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition hover:border-primary/45 dark:text-sky-300"
                        >
                          {item.label}
                        </motion.button>
                      ))}
                    </div>
                  ) : null}

                  {suggestedService && !isTyping ? (
                    <div className="rounded-xl border border-primary/25 bg-primary/[0.08] p-2.5 dark:bg-primary/10">
                      <p className="text-[10px] font-semibold text-primary dark:text-sky-300">
                        {quoteReady ? "Listo para cotizar" : "Servicio identificado"}
                      </p>
                      <p className="mt-0.5 text-[13px] font-semibold text-foreground">
                        {suggestedService.label}
                      </p>
                      {quoteSummary ? (
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                          {quoteSummary}
                        </p>
                      ) : null}
                      <div className="mt-2 grid grid-cols-2 gap-1.5">
                        <motion.button
                          type="button"
                          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                          transition={tapSpring}
                          onClick={() => {
                            setIsOpen(false);
                            startQuote({
                              servicio: suggestedService.value,
                              label: suggestedService.label,
                              mensaje:
                                quoteSummary ||
                                `Quiero cotizar: ${suggestedService.label}.`,
                            });
                          }}
                          className="inline-flex h-9 items-center justify-center gap-1 rounded-xl bg-primary text-[11px] font-semibold text-primary-foreground"
                        >
                          Cotizar
                          <ArrowUpRight className="size-3.5" />
                        </motion.button>
                        {actions.whatsapp ? (
                          <a
                            href={actions.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-[#25D366]/35 bg-[#25D366]/10 text-[11px] font-semibold text-[#128C7E] dark:text-[#25D366]"
                          >
                            WhatsApp
                            <MessageCircle className="size-3.5" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {sendError && lastFailedPrompt.current ? (
                    <button
                      type="button"
                      onClick={() => {
                        const failed = lastFailedPrompt.current;
                        if (!failed) return;
                        void streamAgentReply(failed.text, failed.agent);
                      }}
                      className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300"
                    >
                      Reintentar última consulta
                    </button>
                  ) : null}
                </div>

                <AnimatePresence>
                  {showJumpBottom ? (
                    <motion.button
                      type="button"
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        setStickToBottom(true);
                        scrollToBottom(true);
                      }}
                      className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-black/[0.08] bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-foreground shadow-md dark:border-white/10 dark:bg-[#152238]"
                    >
                      <ArrowDown className="size-3" />
                      Último
                    </motion.button>
                  ) : null}
                </AnimatePresence>
              </div>

              <form
                className="relative z-10 shrink-0 border-t border-black/[0.06] bg-white/90 p-2.5 dark:border-white/[0.08] dark:bg-[#101A2C]/95"
                onSubmit={onSubmit}
              >
                <div className="flex items-end gap-1.5">
                  <textarea
                    ref={textareaRef}
                    id="agent-message"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={onComposerKeyDown}
                    rows={1}
                    disabled={isTyping}
                    placeholder="Escribe tu consulta…"
                    className={cn(
                      "max-h-22 min-h-10 flex-1 resize-none rounded-xl border px-3 py-2 text-[13px] outline-none transition-[border-color,box-shadow,background-color]",
                      "border-black/[0.08] bg-[#F8FAFC] text-zinc-900 placeholder:text-zinc-400",
                      "focus:border-primary/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.16)]",
                      "dark:border-white/[0.1] dark:bg-[#152238] dark:text-slate-100 dark:placeholder:text-slate-500",
                      "dark:focus:border-primary/45 dark:focus:bg-[#1a2a42]",
                      "disabled:opacity-60",
                    )}
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    whileTap={
                      reduceMotion || !input.trim() || isTyping
                        ? undefined
                        : { scale: 0.94 }
                    }
                    transition={tapSpring}
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_6px_16px_rgba(37,99,235,0.35)] transition enabled:hover:bg-[#3B82F6] disabled:cursor-not-allowed disabled:opacity-45"
                    aria-label="Enviar mensaje"
                  >
                    <Send className="size-3.5" />
                  </motion.button>
                </div>
                <p className="mt-1.5 text-center text-[9px] text-muted-foreground">
                  {company.shortName} · {company.phone}
                </p>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {fabVisible ? (
            <motion.button
              key="chat-fab"
              type="button"
              onClick={() => {
                setIsOpen(true);
                setNudge(false);
              }}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 8 }}
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -2, boxShadow: "0 12px 28px rgba(37,99,235,0.45)" }
              }
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              transition={reduceMotion ? { duration: 0.01 } : tapSpring}
              className={cn(
                "group relative flex items-center overflow-hidden",
                "size-[56px] justify-center rounded-full sm:h-[50px] sm:w-[150px] sm:justify-start sm:gap-2 sm:pl-1.5 sm:pr-3.5",
                "border border-blue-300/30 bg-gradient-to-b from-[#3B82F6] via-[#2563EB] to-[#1d4ed8]",
                "text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_8px_22px_rgba(37,99,235,0.4)]",
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30",
              )}
              aria-expanded={false}
              aria-label="Abrir asistente Findtec"
              title="Asistente Findtec"
            >
              <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                <motion.span
                  animate={reduceMotion ? undefined : { rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="size-3.5" />
                </motion.span>
                <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full border border-[#2563EB] bg-emerald-300" />
              </span>
              <span className="hidden min-w-0 text-left leading-tight sm:block">
                <span className="block text-[12px] font-bold tracking-tight">Asistente</span>
                <span className="block text-[10px] text-white/80">Findtec</span>
              </span>
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
