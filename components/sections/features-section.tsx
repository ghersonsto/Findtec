"use client";

import { Award, Clock, Shield, Zap } from "lucide-react";

import { Reveal } from "@/components/reveal";

const features = [
  {
    icon: Zap,
    title: "Implementación ágil",
    description: "Desplegamos software e infraestructura con alcance documentado.",
  },
  {
    icon: Shield,
    title: "Seguridad aplicada",
    description: "Controles de acceso, respaldos y buenas prácticas operativas.",
  },
  {
    icon: Clock,
    title: "Soporte continuo",
    description: "Acompañamiento postentrega para incidencias y evolución.",
  },
  {
    icon: Award,
    title: "Entregables claros",
    description: "Documentación, evidencia técnica y seguimiento profesional.",
  },
];

export function FeaturesSection() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      <div className="container-pro relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Por qué Findtec
          </p>
          <h2 className="font-display mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Ventajas de digitalizar con nosotros
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Reveal
              key={feature.title}
              delayClass={
                index % 2 === 1 ? "delay-100" : index % 4 === 2 ? "delay-200" : undefined
              }
            >
              <article className="h-full rounded-2xl border border-border bg-card/60 p-5 transition hover:border-primary/35 sm:p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display mt-5 text-lg font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
