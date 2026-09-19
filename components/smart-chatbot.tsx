"use client";

import { Bot, CheckCircle2, Mail, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { company, whatsappHref } from "@/lib/company";

const quickReplies = [
  "Cotizar equipos tecnológicos",
  "Soporte técnico empresarial",
  "Microsoft 365 y cloud",
  "Redes e infraestructura",
  "Desarrollo web profesional",
  "Dashboards y análisis de datos",
];

type Channel = "whatsapp" | "email";

export function SmartChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [need, setNeed] = useState(quickReplies[0]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<Channel>("whatsapp");

  const preparedMessage = useMemo(() => {
    return [
      `Hola, soy ${name.trim() || "un visitante"}.`,
      `Necesito ayuda con: ${need}.`,
      message.trim() ? `Detalle: ${message.trim()}` : "Quiero que un asesor me contacte.",
    ].join("\n");
  }, [message, name, need]);

  const mailHref = useMemo(() => {
    const subject = encodeURIComponent(`Consulta desde chatbot FindTec: ${need}`);
    const body = encodeURIComponent(preparedMessage);
    return `mailto:${company.email}?subject=${subject}&body=${body}`;
  }, [need, preparedMessage]);

  const canSend = name.trim().length >= 2 || message.trim().length >= 8;
  const finalHref = channel === "whatsapp" ? whatsappHref(preparedMessage) : mailHref;
  const finalLabel = channel === "whatsapp" ? "Enviar por WhatsApp" : "Enviar por correo";

  useEffect(() => {
    const openChatbot = () => setIsOpen(true);

    window.addEventListener("open-findtec-chatbot", openChatbot);
    return () => window.removeEventListener("open-findtec-chatbot", openChatbot);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          className="mb-4 max-h-[calc(100vh-7rem)] w-[calc(100vw-2.5rem)] max-w-sm overflow-y-auto rounded-lg border border-border bg-card shadow-2xl shadow-foreground/15"
          aria-label="Chatbot de FindTec Soluciones"
        >
          <div className="bg-primary p-4 text-primary-foreground">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">FindTec Asistente</h2>
                  <div className="mt-1 flex items-center gap-2 text-xs text-white/85">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    Estamos en línea
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                aria-label="Cerrar chatbot"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4 p-4">
            <div className="rounded-lg bg-secondary p-4 text-sm leading-relaxed text-foreground">
              Hola. Primero entiendo tu necesidad y luego te conecto por WhatsApp o correo con el mensaje listo.
            </div>

            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                1. Elige el tema
              </span>
              <div className="grid grid-cols-2 gap-2">
                {quickReplies.map((reply) => {
                  const isActive = need === reply;

                  return (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => setNeed(reply)}
                      className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold transition ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {reply}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                2. Tu nombre o empresa
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Ejemplo: Carlos, empresa ABC"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                3. Describe tu solicitud
              </span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Ejemplo: necesito 10 laptops, instalación y soporte..."
              />
            </label>

            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                4. Canal de contacto
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel("whatsapp")}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                    channel === "whatsapp"
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setChannel("email")}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                    channel === "email"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  Correo
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-400/25 bg-emerald-500/10 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                Mensaje preparado
              </div>
              <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                {preparedMessage}
              </p>
            </div>

            <a
              href={canSend ? finalHref : undefined}
              target={channel === "whatsapp" && canSend ? "_blank" : undefined}
              rel={channel === "whatsapp" && canSend ? "noopener noreferrer" : undefined}
              aria-disabled={!canSend}
              className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition ${
                canSend
                  ? "btn-primary text-white"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              }`}
            >
              <Send className="h-4 w-4" />
              {canSend ? finalLabel : "Completa nombre o detalle"}
            </a>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="group flex h-16 items-center gap-3 rounded-full bg-[#25D366] px-5 text-white shadow-2xl shadow-emerald-900/25 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Cerrar chatbot" : "Abrir chatbot"}
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
          <MessageCircle className="h-6 w-6" />
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-[#25D366] bg-emerald-100" />
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-bold">Estamos en línea</span>
          <span className="block text-xs text-white/85">Chat inteligente</span>
        </span>
      </button>
    </div>
  );
}
