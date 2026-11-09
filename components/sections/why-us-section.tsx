"use client";

import { BadgeCheck, Globe2, Handshake, Layers, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { TiltCard } from "@/components/tilt-card";
import { company } from "@/lib/company";

/** Solo hechos verificables — sin métricas inventadas. */
const FACTS = [
  { value: "< 24h", label: "Respuesta máxima" },
  { value: "RNP", label: "Registro vigente" },
  { value: company.ruc, label: "RUC" },
  { value: "B2B/B2G", label: "Alcance contractual" },
];

const PILLARS = [
  {
    icon: Handshake,
    title: "Atención directa",
    description:
      "Trato con los ingenieros que construyen y conocen tu arquitectura, sin intermediarios.",
  },
  {
    icon: Layers,
    title: "Soluciones a medida",
    description:
      "Software y flujos adaptados a la operativa real de tu empresa, con alcance cerrado.",
  },
  {
    icon: Sparkles,
    title: "Tecnología moderna",
    description:
      "Laravel, Vue, Python, FastAPI, Docker y Microsoft 365 según el requerimiento.",
  },
  {
    icon: Globe2,
    title: "Sector privado y Estado",
    description:
      "RNP vigente (OSCE) para contrataciones públicas y proyectos empresariales en Perú.",
  },
];

export function WhyUsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="nosotros"
      aria-labelledby="why-us-heading"
      className="section-cinematic relative isolate overflow-hidden pt-12 pb-20 text-foreground sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32"
    >
      <div className="container-pro relative z-10">
        <div className="grid items-start gap-7 sm:gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Columna izquierda — copy + hechos (~45%) */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="lg:col-span-5"
          >
            <SectionEyebrow align="left">Por qué Findtec</SectionEyebrow>
            <h2
              id="why-us-heading"
              className="mt-2.5 font-display text-balance text-[1.65rem] font-extrabold leading-tight tracking-tight text-foreground sm:mt-3 sm:text-4xl lg:text-[2.75rem]"
            >
              Un socio tecnológico{" "}
              <span className="bg-gradient-to-r from-sky-400 to-primary bg-clip-text text-transparent">
                comprometido con tu operación
              </span>
            </h2>
            <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
              Operamos desde {company.shortAddress} con facturación formal, alcance documentado y
              soporte después de la entrega.
            </p>

            <div className="glass-card mt-5 overflow-hidden rounded-2xl sm:mt-8">
              <div className="grid grid-cols-2 divide-x divide-y divide-border dark:divide-white/[0.06]">
                {FACTS.map((fact) => (
                  <div key={fact.label} className="px-3 py-3 sm:px-5 sm:py-5">
                    <p className="font-display text-base font-extrabold tracking-tight text-foreground sm:text-xl">
                      {fact.value}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-muted-foreground sm:mt-1 sm:text-xs">
                      {fact.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-3 flex items-start gap-2 text-[10px] leading-snug text-muted-foreground sm:mt-4 sm:items-center sm:text-[11px]">
              <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-primary sm:mt-0" />
              {company.legalName}
            </p>
          </motion.div>

          {/* Columna derecha — 2×2 (~55%) */}
          <div className="grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 sm:gap-3 lg:col-span-7 lg:gap-3.5">
            {PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;
              const featured = index === 0 || index === 2;
              return (
                <motion.div
                  key={pillar.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 32,
                    delay: reduceMotion ? 0 : index * 0.06,
                  }}
                  className="h-full"
                >
                  <TiltCard intensity={7} pop={8} className="h-full rounded-2xl">
                    <article
                      className={
                        featured
                          ? "glass-card h-full rounded-2xl p-3.5 sm:min-h-[220px] sm:p-7 lg:p-8"
                          : "glass-card h-full rounded-2xl p-3.5 sm:p-6"
                      }
                    >
                      <div
                        className={
                          featured
                            ? "flex size-8 items-center justify-center rounded-lg border border-primary/25 bg-gradient-to-br from-primary/20 to-sky-400/10 text-primary shadow-[0_0_20px_rgba(37,99,235,0.28)] sm:size-11 sm:rounded-xl"
                            : "flex size-8 items-center justify-center rounded-lg border border-primary/25 bg-gradient-to-br from-primary/20 to-sky-400/10 text-primary shadow-[0_0_16px_rgba(37,99,235,0.22)] sm:size-10 sm:rounded-xl"
                        }
                      >
                        <Icon className={featured ? "size-4 sm:size-6" : "size-4 sm:size-5"} />
                      </div>
                      <h3
                        className={
                          featured
                            ? "mt-3 font-display text-[13px] font-bold leading-snug tracking-tight text-foreground sm:mt-5 sm:text-xl"
                            : "mt-3 font-display text-[13px] font-bold leading-snug tracking-tight text-foreground sm:mt-4 sm:text-lg"
                        }
                      >
                        {pillar.title}
                      </h3>
                      <p
                        className={
                          featured
                            ? "mt-1.5 text-[11px] leading-relaxed text-muted-foreground sm:mt-2.5 sm:text-[15px]"
                            : "mt-1.5 text-[11px] leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm"
                        }
                      >
                        {pillar.description}
                      </p>
                    </article>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
