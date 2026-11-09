"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Mail,
  Loader2,
  User,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { WhatsAppBadge, WhatsAppIcon } from "@/components/whatsapp-icon";
import { company, whatsappHref } from "@/lib/company";
import { parseQuoteFromHash, QUOTE_EVENT, type QuotePayload } from "@/lib/quote";
import {
  getServiceOption,
  resolveServiceValue,
  serviceOptions,
} from "@/lib/services";
import { cn } from "@/lib/utils";

interface ContactForm {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  servicio: string;
  mensaje: string;
}

const initialForm: ContactForm = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  servicio: "",
  mensaje: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isWhatsAppOrEmail(value: string) {
  const v = value.trim();
  if (emailPattern.test(v)) return true;
  return v.replace(/\D/g, "").length >= 7;
}

function applyQuoteToForm(
  setForm: React.Dispatch<React.SetStateAction<ContactForm>>,
  payload: Partial<QuotePayload>,
) {
  const resolved = resolveServiceValue(payload.servicio);
  const match =
    getServiceOption(resolved) || getServiceOption(payload.servicio);
  if (!match && !resolved && !payload.mensaje) return;

  setForm((current) => ({
    ...current,
    servicio: resolved || match?.value || current.servicio,
    mensaje:
      payload.mensaje?.trim() ||
      (match ? `Quiero cotizar: ${match.label}.` : current.mensaje),
  }));
}

const inputClass =
  "min-h-11 w-full rounded-lg border border-black/[0.08] bg-slate-50/90 px-3.5 py-2.5 text-base text-slate-900 placeholder-zinc-400 outline-none transition-[border-color,box-shadow,background-color] focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/25 sm:min-h-0 sm:text-sm dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:placeholder-zinc-500 dark:focus:bg-white/[0.07]";

export function CtaSection() {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [highlighted, setHighlighted] = useState(false);
  const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
  const servicePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applyFromLocation = () => {
      const parsed = parseQuoteFromHash();
      if (!parsed) return;
      applyQuoteToForm(setForm, parsed);
      setHighlighted(true);
      const timer = window.setTimeout(() => setHighlighted(false), 2400);
      return () => window.clearTimeout(timer);
    };

    applyFromLocation();

    const handleCustomQuote = (event: Event) => {
      const detail = (event as CustomEvent<QuotePayload>).detail;
      if (!detail) return;
      applyQuoteToForm(setForm, detail);
      setHighlighted(true);
      window.setTimeout(() => setHighlighted(false), 2400);
    };

    window.addEventListener("hashchange", applyFromLocation);
    window.addEventListener(QUOTE_EVENT, handleCustomQuote as EventListener);

    return () => {
      window.removeEventListener("hashchange", applyFromLocation);
      window.removeEventListener(QUOTE_EVENT, handleCustomQuote as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!serviceMenuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const root = servicePickerRef.current;
      if (!root || root.contains(event.target as Node)) return;
      setServiceMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServiceMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [serviceMenuOpen]);

  const selectService = (value: string) => {
    setForm((current) => ({ ...current, servicio: value }));
    setErrorMessage("");
    setServiceMenuOpen(false);
  };

  const selectedServiceLabel = useMemo(() => {
    return getServiceOption(form.servicio)?.label || "Servicio tecnológico";
  }, [form.servicio]);

  const directWhatsappUrl = useMemo(() => {
    const text =
      `Hola Findtec, soy ${form.nombre || "un contacto"}${form.empresa ? ` de ${form.empresa}` : ""}. Me interesa consultar sobre: ${selectedServiceLabel}. ${form.mensaje || ""}`.trim();
    return whatsappHref(text);
  }, [form, selectedServiceLabel]);

  const updateField =
    (field: keyof ContactForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrorMessage("");
    };

  const validateForm = () => {
    if (!form.nombre.trim()) return "Por favor ingresa tu nombre completo.";
    if (!isWhatsAppOrEmail(form.email)) {
      return "Ingresa un WhatsApp (con código de país) o un correo válido.";
    }
    if (!form.servicio) return "Selecciona el servicio de tu interés.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    try {
      setIsSending(true);
      setErrorMessage("");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, origen: "cta_dual_section" }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Error al procesar el envío.");
      }

      toast.success("Solicitud enviada", {
        description: "Te contactaremos en menos de 24 horas.",
      });

      setForm(initialForm);
      setServiceMenuOpen(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo enviar el formulario.";
      toast.error("Error al enviar", {
        description: "Puedes escribirnos directamente por WhatsApp.",
      });
      setErrorMessage(msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section
      id="contacto"
      aria-labelledby="cta-heading"
      className="section-cinematic relative isolate overflow-hidden py-12 text-foreground sm:py-20 lg:py-24"
    >
      <div className="container-pro relative z-10">
        <div className="grid items-start gap-7 sm:gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="max-w-xl lg:col-span-5"
          >
            <SectionEyebrow align="left">Contacto</SectionEyebrow>
            <h2
              id="cta-heading"
              className="mt-2.5 font-display text-balance text-[1.65rem] font-extrabold leading-tight tracking-tight text-foreground sm:mt-3 sm:text-5xl lg:text-[3.4rem]"
            >
              Hablemos de tu{" "}
              <span className="bg-gradient-to-r from-sky-400 to-primary bg-clip-text text-transparent">
                próximo proyecto
              </span>
            </h2>

            <p className="mt-3 font-sans text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:mt-4 sm:text-lg">
              Cuéntanos el alcance y los plazos. Te devolvemos una propuesta técnica
              desglosada, sin compromiso.
            </p>

            <ul className="mt-5 grid grid-cols-1 gap-2.5 border-t border-black/[0.06] pt-4 dark:border-white/[0.08] sm:mt-8 sm:space-y-0 sm:gap-3.5 sm:pt-6">
              {[
                "Respuesta en menos de 24 horas",
                "Propuesta personalizada con alcance y plazo",
                "Acuerdos de confidencialidad",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] text-zinc-700 dark:text-zinc-300 sm:items-center sm:gap-3 sm:text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400 sm:mt-0 sm:size-5" />
                  <span className="font-medium leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/12 px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-[#25D366]/18 dark:border-[#25D366]/35 dark:bg-[#25D366]/14"
              >
                <WhatsAppBadge className="size-7" iconClassName="size-3.5" />
                <span>{company.phone}</span>
              </a>
              <a
                href={`mailto:${company.email}`}
                className="inline-flex min-h-11 max-w-full items-center justify-center gap-2.5 truncate rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:border-primary/40 dark:bg-white/[0.04]"
              >
                <Mail className="size-4 shrink-0 text-primary" />
                <span className="truncate">{company.email}</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 320, damping: 32, delay: 0.05 }}
            className="lg:col-span-7"
          >
            <div
              className={`rounded-2xl border p-4 backdrop-blur-xl transition-all duration-300 sm:p-8 ${
                highlighted
                  ? "scale-[1.01] border-primary bg-white/95 shadow-[0_0_48px_rgba(37,99,235,0.32)] dark:bg-zinc-900/80"
                  : "glass-card border-black/[0.06] bg-white/95 dark:border-white/[0.08] dark:bg-zinc-900/70 dark:shadow-[0_28px_64px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.07)]"
              }`}
            >
              <h3 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Solicita una cotización
              </h3>
              <p className="mt-1 font-sans text-sm text-zinc-500 dark:text-zinc-400">
                Completa los datos y te respondemos con una propuesta clara.
              </p>

              {errorMessage ? (
                <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-300">
                  {errorMessage}
                </div>
              ) : null}

              {isSubmitted ? (
                <div className="space-y-3 py-12 text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-500">
                    <CheckCircle2 className="size-7" />
                  </div>
                  <h4 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    Solicitud recibida
                  </h4>
                  <p className="mx-auto max-w-md text-sm text-zinc-600 dark:text-zinc-400">
                    Evaluaremos tu requerimiento y te contactaremos en menos de 24 horas.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="cta-nombre"
                        className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        Nombre *
                      </label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-zinc-400" />
                        <input
                          id="cta-nombre"
                          type="text"
                          required
                          value={form.nombre}
                          onChange={updateField("nombre")}
                          placeholder="Tu nombre"
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="cta-email"
                        className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        WhatsApp o email *
                      </label>
                      <div className="relative">
                        <WhatsAppIcon className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-[#25D366]" />
                        <input
                          id="cta-email"
                          type="text"
                          required
                          inputMode="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={updateField("email")}
                          placeholder="+51 9… o correo@empresa.com"
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="cta-servicio"
                      id="cta-servicio-label"
                      className="mb-2 block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Servicio *
                    </label>

                    {/* Móvil / tablet: lista inline (siempre hacia abajo, touch-friendly) */}
                    <div ref={servicePickerRef} className="relative lg:hidden">
                      <button
                        id="cta-servicio"
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={serviceMenuOpen}
                        aria-controls="cta-servicio-list"
                        aria-labelledby="cta-servicio-label"
                        onClick={() => setServiceMenuOpen((open) => !open)}
                        className={cn(
                          inputClass,
                          "flex min-h-11 w-full items-center justify-between gap-3 text-left active:scale-[0.99] sm:min-h-11",
                          !form.servicio && "text-zinc-400 dark:text-zinc-500",
                          serviceMenuOpen &&
                            "border-primary bg-white ring-2 ring-primary/25 dark:bg-white/[0.07]",
                        )}
                      >
                        <span className="min-w-0 flex-1 truncate text-base sm:text-sm">
                          {form.servicio
                            ? serviceOptions.find((o) => o.value === form.servicio)
                                ?.label
                            : "Selecciona un servicio"}
                        </span>
                        <ChevronDown
                          aria-hidden
                          className={cn(
                            "size-4 shrink-0 text-zinc-400 transition-transform duration-200 dark:text-zinc-500",
                            serviceMenuOpen && "rotate-180 text-primary",
                          )}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {serviceMenuOpen ? (
                          <motion.div
                            key="cta-servicio-panel"
                            initial={
                              reduceMotion ? false : { opacity: 0, y: -8, height: 0 }
                            }
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={
                              reduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, y: -6, height: 0 }
                            }
                            transition={{ type: "spring", stiffness: 320, damping: 32 }}
                            className="overflow-hidden"
                          >
                            <ul
                              id="cta-servicio-list"
                              role="listbox"
                              aria-labelledby="cta-servicio-label"
                              className={cn(
                                "mt-2 max-h-60 overflow-y-auto overscroll-contain rounded-xl border p-1.5 [-webkit-overflow-scrolling:touch]",
                                "border-black/[0.08] bg-white",
                                "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_12px_28px_rgba(0,0,0,0.12)]",
                                "dark:border-white/[0.1] dark:bg-zinc-900",
                                "dark:shadow-[0_24px_48px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.06)]",
                              )}
                            >
                              {serviceOptions.map((opt) => {
                                const selected = form.servicio === opt.value;
                                return (
                                  <li key={opt.value} role="none">
                                    <button
                                      type="button"
                                      role="option"
                                      aria-selected={selected}
                                      onClick={() => selectService(opt.value)}
                                      className={cn(
                                        "flex w-full items-start gap-2.5 rounded-lg px-3 py-3 text-left text-[15px] leading-snug transition-colors active:scale-[0.99] sm:py-2.5 sm:text-sm",
                                        selected
                                          ? "bg-primary/12 font-semibold text-primary dark:bg-primary/20 dark:text-sky-300"
                                          : "text-slate-800 hover:bg-primary/8 hover:text-primary dark:text-zinc-200 dark:hover:bg-primary/15 dark:hover:text-sky-300",
                                      )}
                                    >
                                      <span className="min-w-0 flex-1">{opt.label}</span>
                                      {selected ? (
                                        <Check
                                          aria-hidden
                                          className="mt-0.5 size-4 shrink-0 text-primary dark:text-sky-300"
                                        />
                                      ) : null}
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>

                    {/* Desktop: chips */}
                    <div
                      role="group"
                      aria-labelledby="cta-servicio-label"
                      className="hidden flex-wrap gap-2 lg:flex"
                    >
                      {serviceOptions.map((opt) => {
                        const selected = form.servicio === opt.value;
                        return (
                          <motion.button
                            key={opt.value}
                            type="button"
                            onClick={() => selectService(opt.value)}
                            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 28,
                              mass: 0.8,
                            }}
                            aria-pressed={selected}
                            className={
                              selected
                                ? "rounded-full border border-primary/50 bg-primary px-3 py-1.5 text-left text-[11px] font-semibold text-primary-foreground shadow-[0_0_16px_rgba(37,99,235,0.35)] sm:text-xs"
                                : "rounded-full border border-border bg-card px-3 py-1.5 text-left text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary dark:bg-white/[0.04] sm:text-xs"
                            }
                          >
                            {opt.label}
                          </motion.button>
                        );
                      })}
                    </div>
                    <input
                      required
                      value={form.servicio}
                      onChange={() => undefined}
                      className="sr-only"
                      tabIndex={-1}
                      aria-hidden
                    />
                    {!form.servicio ? (
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        Elige un servicio para continuar.
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="cta-mensaje" className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Mensaje
                    </label>
                    <textarea
                      id="cta-mensaje"
                      rows={4}
                      value={form.mensaje}
                      onChange={updateField("mensaje")}
                      placeholder="Describe el alcance, usuarios o plazos..."
                      className={`${inputClass} resize-y`}
                    />
                  </div>

                  {/* Hidden optional fields still posted when filled via quote flow */}
                  <input type="hidden" name="empresa" value={form.empresa} readOnly />
                  <input type="hidden" name="telefono" value={form.telefono} readOnly />

                  <motion.button
                    type="submit"
                    disabled={isSending}
                    whileTap={reduceMotion || isSending ? undefined : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.8 }}
                    className="inline-flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_28px_rgba(37,99,235,0.45)] transition-shadow hover:bg-blue-500 hover:shadow-[0_0_36px_rgba(59,130,246,0.55)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <span>Pide tu cotización</span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
