"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Loader2,
  Building2,
  User,
  AtSign,
  FileCode,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";

import { useSiteStatus } from "@/hooks/use-site-status";
import { company, serviceOptions, whatsappHref } from "@/lib/company";
import { parseQuoteFromHash, QUOTE_EVENT, type QuotePayload } from "@/lib/quote";

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

function applyQuoteToForm(
  setForm: React.Dispatch<React.SetStateAction<ContactForm>>,
  payload: Partial<QuotePayload>
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

export function ContactPremiumSection() {
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [highlighted, setHighlighted] = useState(false);

  const { status, loaded } = useSiteStatus();

  // Listen to hash and custom quote events across the application
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

  const selectedServiceLabel = useMemo(() => {
    return serviceOptions.find((s) => s.value === form.servicio)?.label || "Servicio tecnológico";
  }, [form.servicio]);

  const directWhatsappUrl = useMemo(() => {
    const text = `Hola Findtec, soy ${form.nombre || "un contacto"}${form.empresa ? ` de ${form.empresa}` : ""}. Me interesa consultar sobre: ${selectedServiceLabel}. ${form.mensaje || ""}`.trim();
    return whatsappHref(text);
  }, [form, selectedServiceLabel]);

  const updateField =
    (field: keyof ContactForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrorMessage("");
    };

  const validateForm = () => {
    if (!form.nombre.trim()) return "Por favor ingresa tu nombre completo.";
    if (!emailPattern.test(form.email.trim())) return "Ingresa un correo electrónico corporativo válido.";
    if (!form.servicio) return "Selecciona el servicio tecnológico de tu interés.";
    if (form.telefono && form.telefono.replace(/\D/g, "").length < 7) {
      return "El número de teléfono ingresado no parece válido.";
    }
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
        body: JSON.stringify({ ...form, origen: "home_premium" }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Error al procesar el envío.");
      }

      toast.success("Solicitud enviada con éxito", {
        description: "Un ingeniero especialista revisará tu requerimiento y te contactará en menos de 24 horas.",
      });

      setForm(initialForm);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo enviar el formulario.";
      toast.error("Error al enviar solicitud", {
        description: "Hubo un inconveniente. Puedes escribirnos directamente por WhatsApp.",
      });
      setErrorMessage(msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section
      id="contacto"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden bg-[#050914] py-20 text-white sm:py-28 border-t border-white/10"
    >
      {/* Luces volumétricas sutiles de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/3 h-[500px] w-[700px] rounded-full bg-blue-600/10 blur-[160px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-10 h-[400px] w-[600px] rounded-full bg-cyan-500/10 blur-[150px]"
      />

      <div className="container-pro relative z-10">
        {/* Cabecera Principal */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-blue-300 backdrop-blur-md">
            <Sparkles className="size-3.5 text-cyan-400" />
            Hablemos de tu Proyecto
          </div>
          <h2
            id="contact-heading"
            className="mt-5 font-sans text-balance text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.08]"
          >
            EL FUTURO DE TU EMPRESA COMIENZA CON UNA DECISIÓN.
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-300 font-light">
            Conversemos sobre tu próximo proyecto y construyamos una solución tecnológica diseñada para crecer contigo.
          </p>
        </div>

        {/* Contenido en Dos Columnas: Garantías & Formulario */}
        <div className="mt-14 sm:mt-20 grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Columna Izquierda: Información de Confianza & Canales Directos (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
              <h3 className="font-sans text-xl font-bold text-white tracking-tight">
                Canales de Atención Inmediata
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300/80 leading-relaxed">
                Atención directa con nuestro equipo técnico, sin intermediarios ni demoras.
              </p>

              <div className="mt-6 space-y-4 text-sm">
                <a
                  href={`tel:${company.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3.5 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-slate-200 transition-all hover:border-blue-500/40 hover:bg-blue-600/10 hover:text-white"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600/20 text-cyan-400 border border-blue-500/30">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Teléfono / Celular</span>
                    <span className="font-semibold">{company.phone}</span>
                  </div>
                </a>

                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-3.5 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-slate-200 transition-all hover:border-blue-500/40 hover:bg-blue-600/10 hover:text-white"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600/20 text-cyan-400 border border-blue-500/30">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Correo Oficial</span>
                    <span className="font-semibold break-all">{company.email}</span>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-slate-200">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600/20 text-cyan-400 border border-blue-500/30">
                    <Clock className="size-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Tiempo de Respuesta</span>
                    <span className="font-semibold text-emerald-400">
                      {loaded ? status.responseHint : "< 24 horas"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-slate-200">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600/20 text-cyan-400 border border-blue-500/30">
                    <MapPin className="size-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Sede y Jurisdicción</span>
                    <span className="font-semibold">{company.address}</span>
                  </div>
                </div>
              </div>

              {/* Botón WhatsApp Directo */}
              <div className="mt-6 pt-5 border-t border-white/10">
                <a
                  href={directWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 font-semibold text-sm transition-all duration-200 shadow-[0_0_24px_rgba(16,185,129,0.3)] active:scale-[0.98]"
                >
                  <MessageCircle className="size-4" />
                  <span>Hablar por WhatsApp ahora</span>
                </a>
              </div>
            </div>

            {/* Tarjeta de Garantías Formales */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-950/30 via-slate-900/40 to-slate-950/60 p-6 backdrop-blur-xl">
              <span className="font-mono text-xs uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-2">
                <ShieldCheck className="size-4 text-cyan-400" />
                Compromiso Corporativo Findtec
              </span>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Razón Social: <strong>{company.legalName}</strong> (RUC {company.ruc}).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Propiedad intelectual y código fuente 100% transferido a tu empresa.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Acuerdos de confidencialidad (NDA) y garantías contractuales de entrega.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Columna Derecha: Formulario Ultra Premium (7 cols) */}
          <div className="lg:col-span-7">
            <div
              className={`rounded-2xl border bg-slate-900/70 p-7 sm:p-10 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_24px_48px_rgba(0,0,0,0.5)] transition-all duration-300 ${
                highlighted
                  ? "border-blue-400 shadow-[0_0_36px_rgba(37,99,235,0.3)] scale-[1.01]"
                  : "border-white/15"
              }`}
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <h3 className="font-sans text-2xl font-bold text-white tracking-tight">
                    Solicitud de Propuesta Técnica
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300/80">
                    Completa tus datos y te responderemos con una cotización desglosada sin compromiso.
                  </p>
                </div>
                <div className="hidden sm:flex size-10 rounded-xl bg-blue-600/20 border border-blue-500/30 items-center justify-center text-cyan-400">
                  <FileCode className="size-5" />
                </div>
              </div>

              {errorMessage && (
                <div className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs sm:text-sm text-red-200">
                  {errorMessage}
                </div>
              )}

              {isSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <CheckCircle2 className="size-7" />
                  </div>
                  <h4 className="text-xl font-bold text-white">¡Mensaje recibido con éxito!</h4>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Hemos registrado tu solicitud. Un ingeniero especialista se pondrá en contacto al correo o teléfono proporcionado.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Nombre */}
                    <div>
                      <label htmlFor="premium-nombre" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Nombre y Apellido *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 size-4 text-slate-400 pointer-events-none" />
                        <input
                          id="premium-nombre"
                          type="text"
                          required
                          value={form.nombre}
                          onChange={updateField("nombre")}
                          placeholder="Ej. Ing. Carlos Mendoza"
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-400 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                        />
                      </div>
                    </div>

                    {/* Empresa */}
                    <div>
                      <label htmlFor="premium-empresa" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Empresa / Organización
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-3.5 size-4 text-slate-400 pointer-events-none" />
                        <input
                          id="premium-empresa"
                          type="text"
                          value={form.empresa}
                          onChange={updateField("empresa")}
                          placeholder="Ej. Corporación Andina S.A.C."
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-400 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Correo Electrónico */}
                    <div>
                      <label htmlFor="premium-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Correo Corporativo *
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3.5 top-3.5 size-4 text-slate-400 pointer-events-none" />
                        <input
                          id="premium-email"
                          type="email"
                          required
                          value={form.email}
                          onChange={updateField("email")}
                          placeholder="carlos@tuempresa.pe"
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-400 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                        />
                      </div>
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label htmlFor="premium-telefono" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Teléfono / WhatsApp
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 size-4 text-slate-400 pointer-events-none" />
                        <input
                          id="premium-telefono"
                          type="tel"
                          value={form.telefono}
                          onChange={updateField("telefono")}
                          placeholder="+51 987 654 321"
                          className="w-full rounded-xl border border-white/15 bg-white/[0.04] pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-400 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Servicio de Interés */}
                  <div>
                    <label htmlFor="premium-servicio" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Especialidad o Servicio Requerido *
                    </label>
                    <select
                      id="premium-servicio"
                      required
                      value={form.servicio}
                      onChange={updateField("servicio")}
                      className="w-full rounded-xl border border-white/15 bg-slate-900/90 px-4 py-3 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                    >
                      <option value="" disabled className="bg-slate-900 text-slate-400">
                        Selecciona una especialidad...
                      </option>
                      {serviceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label htmlFor="premium-mensaje" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Alcance del Requerimiento o Necesidad
                    </label>
                    <textarea
                      id="premium-mensaje"
                      rows={4}
                      value={form.mensaje}
                      onChange={updateField("mensaje")}
                      placeholder="Describe brevemente lo que tu empresa necesita resolver, cantidad de usuarios, integración o plazos previstos..."
                      className="w-full rounded-xl border border-white/15 bg-white/[0.04] p-4 text-sm text-white placeholder-slate-500 focus:border-blue-400 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-y"
                    />
                  </div>

                  {/* Botón de Envío */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full min-h-13 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 px-6 py-3.5 text-base font-semibold text-white shadow-[0_0_28px_rgba(37,99,235,0.4)] transition-all duration-300 hover:shadow-[0_0_36px_rgba(0,217,255,0.5)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="size-5 animate-spin" />
                          <span>Enviando requerimiento...</span>
                        </>
                      ) : (
                        <>
                          <span>Solicitar Cotización & Propuesta Técnica</span>
                          <ArrowRight className="size-5" />
                        </>
                      )}
                    </button>
                    <p className="mt-2.5 text-center text-[11px] text-slate-400 font-mono">
                      Sin compromisos · Confidencialidad garantizada bajo NDA · Respuesta técnica en &lt; 24h
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
