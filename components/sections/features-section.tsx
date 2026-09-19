"use client";

import { Award, Clock, Headphones, Shield, TrendingUp, Zap } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Rápida implementación",
    description: "Desplegamos soluciones tecnológicas en tiempos cortos sin comprometer la calidad.",
  },
  {
    icon: Shield,
    title: "Seguridad aplicada",
    description: "Controles y buenas prácticas para proteger información, accesos y continuidad.",
  },
  {
    icon: Clock,
    title: "Disponibilidad 24/7",
    description: "Soporte técnico disponible para resolver incidencias críticas.",
  },
  {
    icon: Headphones,
    title: "Atención personalizada",
    description: "Cada cliente recibe una solución adaptada a sus necesidades reales.",
  },
  {
    icon: Award,
    title: "Procesos documentados",
    description: "Entregables claros, evidencia técnica y seguimiento profesional.",
  },
  {
    icon: TrendingUp,
    title: "Escalabilidad",
    description: "Soluciones que crecen junto con la empresa sin frenar la operación.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Por qué elegirnos
          </span>
          <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Ventajas de trabajar con <span className="text-gradient">FindTec</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-lg border border-border/70 bg-card/70 p-8 transition-all duration-500 hover:border-primary/30 hover:bg-secondary/60"
            >
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 transition-all duration-300 group-hover:bg-primary/20">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-foreground">{feature.title}</h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
