"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";

import { useMemo, useState } from "react";

import { company, serviceOptions, whatsappHref } from "@/lib/company";

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

export function ContactSection() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const whatsappMessage = useMemo(() => {
    const serviceLabel =
      serviceOptions.find((service) => service.value === form.servicio)?.label ||
      "servicios de FindTec";

    return whatsappHref(
      `Hola, soy ${form.nombre || "un contacto"}. Quiero información sobre ${serviceLabel}. ${form.mensaje || ""}`.trim(),
    );
  }, [form]);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "No se pudo enviar el formulario.");
      }

      setForm(initialForm);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 4000);
    } catch (error) {
      setErrorMessage(
        "No se pudo enviar el formulario ahora. Puedes escribirnos por WhatsApp y atenderemos tu solicitud.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contacto" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Contacto
          </span>
          <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Hablemos de tu <span className="text-gradient">proyecto</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Cuéntanos qué necesitas y te responderemos con una ruta clara: diagnóstico,
            recomendación, alcance y siguiente paso.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <ContactItem
                icon={Mail}
                title="Correo electrónico"
                text={company.email}
                href={`mailto:${company.email}`}
                action="Enviar correo"
              />
              <ContactItem
                icon={Phone}
                title="Teléfono"
                text={company.phone}
                href={company.phoneHref}
                action="Llamar ahora"
              />
              <ContactItem
                icon={MessageCircle}
                title="WhatsApp"
                text={company.phone}
                href={whatsappHref()}
                action="Iniciar chat"
                external
              />
              <ContactItem
                icon={MapPin}
                title="Ubicación"
                text={company.address}
                detail="Atención a empresas privadas y entidades del Estado."
              />
            </div>

            <div className="mt-10 rounded-lg border border-border bg-card/70 p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Qué pasa después de escribirnos</h3>
              </div>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li>1. Revisamos tu necesidad y prioridad.</li>
                <li>2. Te pedimos datos técnicos si hacen falta.</li>
                <li>3. Enviamos una recomendación o cotización con alcance claro.</li>
              </ol>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {["RNP vigente", "B2B y B2G", "Soporte 24/7", "Cotización clara", "Seguimiento post entrega"].map((badge) => (
                <div
                  key={badge}
                  className="rounded-full border border-border bg-secondary/70 px-4 py-2 text-sm font-medium text-foreground"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="glass glow-blue rounded-lg p-6 sm:p-10">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-foreground">Mensaje enviado</h4>
                  <p className="mt-3 text-muted-foreground">
                    Nos pondremos en contacto contigo pronto.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Nombre completo" htmlFor="nombre" required>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={updateField("nombre")}
                        autoComplete="name"
                        required
                        className="w-full rounded-lg border border-input bg-card/80 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                        className="w-full rounded-lg border border-input bg-card/80 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Nombre de tu empresa"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Correo electrónico" htmlFor="email" required>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={updateField("email")}
                        autoComplete="email"
                        required
                        className="w-full rounded-lg border border-input bg-card/80 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                        className="w-full rounded-lg border border-input bg-card/80 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                      className="w-full rounded-lg border border-input bg-card/80 px-4 py-3.5 text-sm text-foreground invalid:text-muted-foreground hover:border-primary/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 [&>option]:bg-card [&>option]:text-foreground [&>option:disabled]:text-muted-foreground"
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
                      className="w-full resize-none rounded-lg border border-input bg-card/80 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Describe tu requerimiento, cantidad, fechas o consulta..."
                    />
                  </Field>

                  {errorMessage && (
                    <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm font-medium text-red-500">
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
                    <button
                      type="submit"
                      disabled={isSending}
                      className="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send className="h-5 w-5" />
                      {isSending ? "Enviando..." : "Enviar solicitud"}
                    </button>
                    <a
                      href={whatsappMessage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-6 text-sm font-semibold text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white dark:text-emerald-300"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
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
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-foreground">
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
  detail,
  href,
  action,
  external,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  detail?: string;
  href?: string;
  action?: string;
  external?: boolean;
}) {
  return (
    <div className="group flex items-start gap-5">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 transition-all group-hover:bg-primary/20">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-muted-foreground">{text}</p>
        {detail && <p className="text-sm text-muted-foreground">{detail}</p>}
        {href && action && (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            {action} <ArrowRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
