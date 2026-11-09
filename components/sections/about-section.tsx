"use client";

import { ShieldCheck, Award, Users, Building2, Sparkles } from "lucide-react";
import { company } from "@/lib/company";
import { Reveal } from "@/components/reveal";

const corporatePillars = [
  {
    icon: ShieldCheck,
    title: "Ingeniería formal con código propio",
    description:
      "Soluciones mantenibles sobre estándares abiertos (Laravel, Vue.js, Python, Docker). Tu empresa mantiene el control de sus datos y aplicaciones.",
  },
  {
    icon: Award,
    title: "Rigor contractual y cumplimiento",
    description:
      "Alcance cerrado, actas de entrega, facturación electrónica y habilitación en el RNP para contrataciones con el Estado peruano.",
  },
  {
    icon: Users,
    title: "Acompañamiento técnico directo",
    description:
      "Capacitación presencial o remota, manuales de usuario y mesa de ayuda atendida por los ingenieros que conocen tu sistema.",
  },
];

const identity = [
  { label: "Nombre Comercial", value: company.name },
  { label: "Razón Social", value: company.legalName },
  { label: "RUC", value: company.ruc, numeric: true },
  { label: "Domicilio Fiscal", value: company.address },
  { label: "Ámbito de Atención", value: "Lima Metropolitana y cobertura nacional (Perú)" },
  { label: "Tipo de Empresa", value: "Empresa Individual de Responsabilidad Limitada (E.I.R.L.)" },
];

export function AboutSection({ compact = false }: { compact?: boolean } = {}) {
  return (
    <section
      id="nosotros"
      className={`section-shell ${compact ? "py-12 sm:py-16" : "py-20 sm:py-24 lg:py-28"}`}
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="aurora-glow absolute right-0 top-1/3 h-[400px] w-[520px]" />
      </div>

      <div className="container-pro relative z-10">
        {!compact && (
          <Reveal className="max-w-3xl border-b border-border pb-10 sm:pb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Trayectoria y estándares
            </div>
            <h2 className="font-display mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Innovación tecnológica con{" "}
              <span className="text-primary">respaldo operativo</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {company.description}
            </p>
          </Reveal>
        )}

        <div className={`grid gap-6 md:grid-cols-3 ${compact ? "mt-0" : "mt-10 sm:mt-12"}`}>
          {corporatePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Reveal
                key={pillar.title}
                delayClass={idx === 1 ? "delay-100" : idx === 2 ? "delay-200" : undefined}
              >
                <article className="card-premium flex h-full flex-col justify-between rounded-2xl p-6 sm:p-7">
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_22px_rgba(37,99,235,0.25)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {pillar.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-12">
          <div className="surface-panel rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2.5 border-b border-border pb-5">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-bold text-foreground">
                Identificación corporativa y legal
              </h3>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {identity.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border bg-secondary/50 p-4 dark:bg-black/30"
                >
                  <dt className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd
                    className={`mt-1.5 text-xs leading-relaxed text-foreground sm:text-sm ${
                      item.numeric ? "font-mono text-base font-bold text-primary" : "font-medium"
                    }`}
                  >
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
