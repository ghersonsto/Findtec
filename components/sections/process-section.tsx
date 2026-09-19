"use client";

import { ArrowRight, ClipboardList, FileText, Rocket, SearchCheck, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: SearchCheck,
    title: "1. Entendemos tu necesidad",
    description:
      "Revisamos problema, alcance, urgencia, usuarios, presupuesto referencial y restricciones técnicas.",
  },
  {
    icon: ClipboardList,
    title: "2. Diseñamos la solución",
    description:
      "Definimos opciones, prioridades, riesgos, tiempos y entregables para que puedas comparar con claridad.",
  },
  {
    icon: Rocket,
    title: "3. Implementamos con control",
    description:
      "Ejecutamos configuración, entrega, documentación, pruebas y transferencia de conocimiento.",
  },
  {
    icon: ShieldCheck,
    title: "4. Acompañamos la operación",
    description:
      "Damos seguimiento, soporte, recomendaciones y mejora continua para sostener resultados.",
  },
];

export function ProcessSection() {
  const openChatbot = () => {
    window.dispatchEvent(new Event("open-findtec-chatbot"));
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/40 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              Método FindTec
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Un proceso pensado para que contrates con tranquilidad
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              La confianza nace cuando sabes qué se hará, cuánto tomará, qué recibirás
              y quién responde si algo necesita ajuste.
            </p>

            <button
              type="button"
              onClick={openChatbot}
              className="btn-primary mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white"
            >
              Hablar con el asistente
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step) => (
              <article
                key={step.title}
                className="rounded-lg border border-border bg-card/70 p-6 transition hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </article>
            ))}

            <article className="rounded-lg border border-primary/25 bg-primary/10 p-6 sm:col-span-2">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Qué recibes al trabajar con FindTec</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Cotización clara, alcance de servicio, recomendaciones técnicas, entregables,
                    evidencia cuando aplica y un canal directo para seguimiento. Eso reduce dudas,
                    evita improvisación y protege tu inversión.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
