"use client";

import Image from "next/image";
import { Award, Briefcase, CheckCircle2, TrendingUp, Users } from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "Experiencia técnica",
    description: "Conocimiento en soporte TI, Microsoft 365, desarrollo web y soluciones digitales.",
  },
  {
    icon: Users,
    title: "Atención B2G",
    description: "Experiencia en ventas a entidades públicas y empresas privadas.",
  },
  {
    icon: Briefcase,
    title: "Soluciones integrales",
    description: "Equipamiento, cloud, desarrollo y consultoría en un solo lugar.",
  },
  {
    icon: TrendingUp,
    title: "Enfoque moderno",
    description: "Visión tecnológica y compromiso profesional continuo.",
  },
];

const highlights = ["RNP vigente", "Microsoft 365", "Soporte 24/7", "Atención personalizada"];

export function AboutSection() {
  return (
    <section id="nosotros" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-background to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card">
              <Image src="/images/team.jpg" alt="Equipo FindTec" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-transparent" />
            </div>

            <div className="glass glow-blue absolute -bottom-8 -right-4 rounded-lg p-6 sm:-right-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">100+</div>
                  <div className="mt-1 text-xs text-muted-foreground">Clientes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">150+</div>
                  <div className="mt-1 text-xs text-muted-foreground">Proyectos</div>
                </div>
              </div>
            </div>

            <div className="absolute -left-4 top-8 rounded-lg border border-primary/20 bg-primary/10 px-5 py-3 backdrop-blur-xl sm:-left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">B2G</div>
                  <div className="text-xs text-muted-foreground">Proveedor preparado</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              Sobre nosotros
            </span>

            <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Transformamos empresas con <span className="text-gradient">tecnología</span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              FindTec Soluciones es una empresa peruana dedicada a la venta de equipos
              tecnológicos, servicios de soporte técnico, soluciones cloud, desarrollo web
              y consultoría tecnológica.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-4 py-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {reasons.map((reason) => (
                <div
                  key={reason.title}
                  className="group rounded-lg border border-border/70 bg-card/70 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-secondary/60"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <reason.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{reason.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
