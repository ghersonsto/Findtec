"use client";

import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Loader2,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Reveal } from "@/components/reveal";
import { BrandLogo } from "@/components/brand-logo";
import { useSiteStatus } from "@/hooks/use-site-status";
import { company, serviceOptions, whatsappHref } from "@/lib/company";
import { contactHeroImage } from "@/lib/media";
import { parseQuoteFromHash, QUOTE_EVENT, type QuotePayload } from "@/lib/quote";

type ContactForm = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  servicio: string;
  mensaje: string;
};

const initialForm: ContactForm = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  servicio: "",
  mensaje: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sendSpring = { type: "spring" as const, stiffness: 400, damping: 25 };

const fieldClass =
  "w-full rounded-xl border border-black/[0.08] bg-white/80 px-4 py-3 text-sm text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45)] outline-none backdrop-blur-sm transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/60 focus-visible:border-blue-500/50 focus-visible:ring-2 focus-visible:ring-blue-500/30 dark:border-white/[0.08] dark:bg-zinc-900/40 dark:shadow-none";

const quotedFieldClass =
  "border-blue-500/55 shadow-[0_0_0_3px_rgba(37,99,235,0.16)] dark:border-blue-400/50";

function applyQuoteToForm(
  setForm: React.Dispatch<React.SetStateAction<ContactForm>>,
  payload: Partial<QuotePayload>,
) {
  const match = serviceOptions.find((item) => item.value === payload.servicio);
  if (!match && !payload.mensaje) return;

  setForm((current) => ({
    ...current,
    servicio: match?.value || current.servicio,
    mensaje:
      payload.mensaje?.trim() ||
      (match ? `Quiero cotizar: ${match.label}.` : current.mensaje),
  }));
}

type ContactSectionProps = {
  initialServicio?: string;
  initialMensaje?: string;
  compact?: boolean;
};

export function ContactSection({
  initialServicio,
  initialMensaje,
  compact = false,
}: ContactSectionProps = {}) {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [highlighted, setHighlighted] = useState(false);
  const { status, loaded } = useSiteStatus();

  useEffect(() => {
    const applyFromLocation = () => {
      const parsed = parseQuoteFromHash();
      if (!parsed) return;
      applyQuoteToForm(setForm, parsed);
      setHighlighted(true);
      window.setTimeout(() => setHighlighted(false), 2200);
    };

    applyFromLocation();

    const onQuote = (event: Event) => {
      const detail = (event as CustomEvent<QuotePayload>).detail;
      if (!detail) return;
      applyQuoteToForm(setForm, detail);
      setHighlighted(true);
      window.setTimeout(() => setHighlighted(false), 2200);
    };

    window.addEventListener(QUOTE_EVENT, onQuote as EventListener);
    window.addEventListener("hashchange", applyFromLocation);
    return () => {
      window.removeEventListener(QUOTE_EVENT, onQuote as EventListener);
      window.removeEventListener("hashchange", applyFromLocation);
    };
  }, []);

  useEffect(() => {
    if (!initialServicio && !initialMensaje) return;
    applyQuoteToForm(setForm, { servicio: initialServicio, mensaje: initialMensaje });
    setHighlighted(true);
    const timer = window.setTimeout(() => setHighlighted(false), 2200);
    return () => window.clearTimeout(timer);
  }, [initialServicio, initialMensaje]);

  const whatsappMessage = useMemo(() => {
    const serviceLabel =
      serviceOptions.find((service) => service.value === form.servicio)?.label ||
      "servicios de Findtec Soluciones";

    return whatsappHref(
      `Hola, soy ${form.nombre || "un contacto"}. Quiero información sobre ${serviceLabel}. ${form.mensaje || ""}`.trim(),
    );
  }, [form]);

  const selectedLabel =
    serviceOptions.find((service) => service.value === form.servicio)?.label || null;

  const updateField =
    (field: keyof ContactForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrorMessage("");
    };

  const validateForm = () => {
    if (!form.nombre.trim()) return "Ingresa tu nombre completo.";
    if (!emailPattern.test(form.email.trim())) return "Ingresa un correo electrónico válido.";
    if (!form.servicio) return "Selecciona el servicio de interés.";
    if (form.telefono && form.telefono.replace(/\D/g, "").length < 7) {
      return "Ingresa un teléfono válido o deja el campo vacío.";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsSending(true);
      setErrorMessage("");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, origen: "formulario" }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "No se pudo enviar el formulario.");
      }

      toast.success("Solicitud enviada correctamente", {
        description: "Nos pondremos en contacto contigo a la brevedad.",
      });
      setForm(initialForm);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 4000);
    } catch (error) {
      toast.error("Error al enviar", {
        description: "No pudimos enviar tu mensaje. Inténtalo de nuevo o contáctanos por WhatsApp.",
      });
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo enviar el formulario. Puedes escribirnos por WhatsApp.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section
      id="contacto"
      className={`relative overflow-hidden ${compact ? "pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-28 lg:pt-16" : "section-pad"}`}
    >
      <div className="absolute inset-0 bg-background" />

      <div className="container-pro relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          {compact ? null : (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Contacto</p>
              <h2 className="font-display mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Solicita una <span className="text-gradient">cotización</span>
              </h2>
            </>
          )}
          <p className={`${compact ? "mt-0" : "mt-4"} text-base text-muted-foreground sm:text-lg`}>
            {loaded
              ? status.responseHint
              : "Indica el servicio, el alcance y un contacto. Te respondemos con una propuesta clara."}
          </p>
          {selectedLabel ? (
            <p className="mt-3 text-sm font-semibold text-primary animate-fade-up">
              Producto seleccionado: {selectedLabel}
            </p>
          ) : null}
        </Reveal>

        <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card/40 shadow-xl shadow-black/5 lg:mt-14 lg:grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative hidden min-h-[520px] lg:block">
            <Image
              src={contactHeroImage}
              alt="Oficina moderna Findtec Soluciones para atención B2B y B2G"
              fill
              className="object-cover"
              sizes="45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/55 to-[#070b14]/25" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-white">
              <BrandLogo tone="onDark" size="panel" className="mb-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                RUC {company.ruc}
              </p>
              <p className="font-display mt-3 text-3xl font-bold leading-tight">
                Cotización clara para tu empresa
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                Cuéntanos el alcance y te respondemos con una propuesta ordenada.
              </p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("open-findtec-chatbot"))}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-primary"
              >
                <Bot className="h-4 w-4" />
                Asesoría digital
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <span
                  className={`h-2 w-2 rounded-full ${
                    status.online ? "bg-emerald-400" : "bg-slate-400"
                  }`}
                />
                {status.businessHours ? "Horario laboral" : "Fuera de horario"}
              </span>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("open-findtec-chatbot"))}
                className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary lg:hidden"
              >
                <Bot className="h-3.5 w-3.5" />
                Asesoría digital
              </button>
            </div>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 animate-pulse-soft">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <h4 className="font-display text-2xl font-semibold text-foreground">
                  Mensaje enviado
                </h4>
                <p className="mt-3 text-muted-foreground">
                  Gracias. Revisaremos tu solicitud y te contactaremos pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Nombre completo" htmlFor="nombre" required>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={form.nombre}
                      onChange={updateField("nombre")}
                      autoComplete="name"
                      required
                      className={fieldClass}
                      placeholder="Tu nombre"
                    />
                  </Field>
                  <Field label="Empresa / Institución" htmlFor="empresa">
                    <input
                      type="text"
                      id="empresa"
                      name="empresa"
                      value={form.empresa}
                      onChange={updateField("empresa")}
                      autoComplete="organization"
                      className={fieldClass}
                      placeholder="Nombre de tu empresa"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Correo electrónico" htmlFor="email" required>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={updateField("email")}
                      autoComplete="email"
                      required
                      className={fieldClass}
                      placeholder="correo@ejemplo.com"
                    />
                  </Field>
                  <Field label="Teléfono" htmlFor="telefono">
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={form.telefono}
                      onChange={updateField("telefono")}
                      autoComplete="tel"
                      className={fieldClass}
                      placeholder="+51 XXX XXX XXX"
                    />
                  </Field>
                </div>

                <Field label="Servicio de interés" htmlFor="servicio" required>
                  <select
                    id="servicio"
                    name="servicio"
                    value={form.servicio}
                    onChange={updateField("servicio")}
                    required
                    className={`${fieldClass} invalid:text-muted-foreground [&>option]:bg-card [&>option]:text-foreground ${
                      highlighted && form.servicio ? quotedFieldClass : ""
                    }`}
                  >
                    <option value="" disabled>
                      Selecciona un servicio
                    </option>
                    {serviceOptions.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Mensaje" htmlFor="mensaje">
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={4}
                    value={form.mensaje}
                    onChange={updateField("mensaje")}
                    className={`${fieldClass} resize-none ${
                      highlighted && form.mensaje ? quotedFieldClass : ""
                    }`}
                    placeholder="Describe tu requerimiento, cantidad, fechas o consulta..."
                  />
                </Field>

                {errorMessage && (
                  <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-medium text-red-500">
                    {errorMessage}
                    <a
                      href={whatsappMessage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center gap-1 text-emerald-600 underline underline-offset-4"
                    >
                      Abrir WhatsApp
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <motion.button
                    type="submit"
                    disabled={isSending}
                    whileHover={reduceMotion || isSending ? undefined : { scale: 1.01 }}
                    whileTap={reduceMotion || isSending ? undefined : { scale: 0.98 }}
                    transition={sendSpring}
                    className="inline-flex h-12 min-h-12 w-full min-w-[16rem] items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 px-6 text-sm font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_16px_rgba(37,99,235,0.3)] disabled:opacity-70 sm:h-14 sm:min-h-14"
                  >
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">
                      {isSending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </span>
                    <span className="inline-block min-w-[9.5rem] text-center">
                      {isSending ? "Enviando..." : "Enviar solicitud"}
                    </span>
                  </motion.button>
                  <a
                    href={whatsappMessage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 min-h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--accent-teal)]/40 bg-[var(--accent-teal)]/10 px-6 text-sm font-semibold text-[var(--accent-teal)] transition hover:bg-[var(--accent-teal)] hover:text-white sm:h-14 sm:min-h-14"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </form>
            )}

            <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
              <ContactItem
                icon={Mail}
                title="Correo"
                text={company.email}
                href={`mailto:${company.email}`}
                action="Escribir"
              />
              <ContactItem
                icon={Phone}
                title="Teléfono"
                text={company.phone}
                href={company.phoneHref}
                action="Llamar"
              />
              <ContactItem
                icon={MessageCircle}
                title="WhatsApp"
                text={company.phone}
                href={whatsappHref()}
                action="Chatear"
                external
              />
              <ContactItem
                icon={MapPin}
                title="Ubicación"
                text={company.shortAddress}
              />
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-background/60 p-4">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Después de escribirnos: revisamos prioridad, pedimos datos técnicos si
                hace falta y enviamos recomendación o cotización con alcance claro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="group/field">
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-[0.8rem] font-semibold tracking-wide text-muted-foreground transition group-focus-within/field:text-primary"
      >
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {children}
    </div>
  );
}

function ContactItem({
  icon: Icon,
  title,
  text,
  href,
  action,
  external,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  href?: string;
  action?: string;
  external?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="truncate text-sm text-muted-foreground">{text}</p>
        {href && action ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            {action} <ArrowRight className="h-3 w-3" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
