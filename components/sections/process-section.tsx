"use client";

import React from "react";
import { SearchCheck, Code2, ShieldAlert, Rocket, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const STEPS = [
  {
    step: "01",
    title: "Conexión y evaluación",
    description: "Reunión de levantamiento técnico para entender tus objetivos, usuarios y alcance preliminar.",
    icon: SearchCheck,
  },
  {
    step: "02",
    title: "Diseño y desarrollo",
    description: "Modelado de base de datos, prototipado e ingeniería de software en sprints ágiles verificables.",
    icon: Code2,
  },
  {
    step: "03",
    title: "Pruebas y validación",
    description: "Control de calidad riguroso en entornos aislados, auditoría de seguridad y pruebas de carga.",
    icon: ShieldAlert,
  },
  {
    step: "04",
    title: "Lanzamiento y soporte",
    description: "Puesta en producción formal, entrega de código fuente, capacitación y soporte continuo.",
    icon: Rocket,
  },
];

export function ProcessSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="metodologia"
      aria-labelledby="process-heading"
      className="section-cinematic relative isolate overflow-hidden py-20 text-foreground sm:py-24 lg:py-28 border-t border-border dark:border-white/10 transition-colors duration-300"
    >
      {/* Luz ambiental mínima — coherente con page-surface */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute top-1/2 left-1/2 h-[360px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.04] dark:bg-primary/[0.05] blur-[160px]" />
      </div>

      <div className="container-pro relative z-10">
        {/* Encabezado con Tipografía Dual FlashDevs */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 dark:bg-blue-950/40 px-3.5 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300 backdrop-blur-md">
            <Sparkles className="size-3.5 text-blue-600 dark:text-cyan-400" />
            Metodología de Trabajo
          </div>

          <h2
            id="process-heading"
            className="mt-4 font-sans text-balance text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.08]"
          >
            Un proceso claro, <br className="sm:hidden" />
            <span className="text-blue-600 dark:text-blue-500">de la idea al lanzamiento</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Guiamos cada etapa del proyecto con comunicación transparente, entregables técnicos tangibles y cumplimiento estricto.
          </p>
        </div>

        {/* 4 Tarjetas de Proceso */}
        <div className="mt-14 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((stepItem, index) => {
            const Icon = stepItem.icon;
            return (
              <motion.div
                key={stepItem.step}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col justify-between rounded-2xl p-7 border border-slate-200/80 dark:border-white/5 bg-white dark:bg-[#0A0F1C]/90 shadow-[0_10px_25px_rgba(0,0,0,0.05)] dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-1.5"
              >
                <div>
                  {/* Número y Badge de Ícono */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-blue-600 dark:text-cyan-400">
                      {stepItem.step}
                    </span>
                    <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_0_18px_rgba(37,99,235,0.35)] group-hover:scale-110 transition-transform">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  {/* Título de Fase */}
                  <h3 className="mt-5 font-sans text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                    {stepItem.title}
                  </h3>

                  {/* Descripción */}
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300/80 leading-relaxed font-normal">
                    {stepItem.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <span className="size-1 rounded-full bg-blue-500" />
                  <span>Fase {stepItem.step} formal</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
