"use client";

import { ChevronLeft, ChevronRight, Quote, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { company } from "@/lib/company";

const testimonials = [
  {
    quote:
      "Findtec Soluciones implementó nuestro sistema web de gestión, ordenando inventarios, accesos por roles y facturación electrónica con respuesta técnica clara.",
    attribution: "Área de Administración y Operaciones",
    sector: "Servicios y comercio",
  },
  {
    quote:
      "La migración a Microsoft 365, la segmentación de redes y la documentación entregada garantizaron continuidad en nuestras operaciones críticas.",
    attribution: "Jefatura de TI e Infraestructura",
    sector: "Operaciones y logística",
  },
  {
    quote:
      "Contamos con Findtec para formulación técnica, cotización y suministro de equipamiento TI bajo los términos contractuales del Estado.",
    attribution: "Responsable de Adquisiciones TI",
    sector: "Sector público (B2G)",
  },
];

export function TestimonialsSection() {
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const active = testimonials[current];
  const move = (step: number) =>
    setCurrent((index) => (index + step + testimonials.length) % testimonials.length);

  return (
    <section
      id="confianza"
      aria-labelledby="trust-section-heading"
      className="section-shell py-20 sm:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/4 top-1/2 h-[350px] w-[500px] -translate-y-1/2 rounded-full bg-blue-600/10 blur-[140px] dark:bg-blue-600/15"
      />

      <div className="container-pro relative z-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <h2
            id="trust-section-heading"
            className="font-display text-balance text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl"
          >
            Confianza con{" "}
            <span className="text-blue-600 dark:text-blue-500">respaldo real</span>
          </h2>

          <div className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_16px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#0A0F1C] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
              <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400" />
              Proveedor habilitado
            </div>
            <p className="mt-3 font-mono text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              RUC {company.ruc}
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {company.legalName}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Inscrito en el Registro Nacional de Proveedores (OSCE) para contrataciones con el
              Estado y el sector privado.
            </p>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_16px_40px_rgba(0,0,0,0.04)] dark:border-white/[0.08] dark:bg-[#0A0F1C] dark:shadow-[0_24px_50px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-black/[0.06] pb-4 dark:border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.35)]">
                <Quote className="size-5" />
              </div>
              <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {current + 1} / {testimonials.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                aria-label="Testimonio anterior"
                onClick={() => move(-1)}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="grid size-10 cursor-pointer place-items-center rounded-xl border border-black/[0.08] bg-slate-50 text-zinc-600 transition-colors hover:border-blue-500/40 hover:text-blue-600 active:scale-[0.98] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:text-white"
              >
                <ChevronLeft className="size-4" />
              </motion.button>
              <motion.button
                type="button"
                aria-label="Siguiente testimonio"
                onClick={() => move(1)}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="grid size-10 cursor-pointer place-items-center rounded-xl border border-black/[0.08] bg-slate-50 text-zinc-600 transition-colors hover:border-blue-500/40 hover:text-blue-600 active:scale-[0.98] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:text-white"
              >
                <ChevronRight className="size-4" />
              </motion.button>
            </div>
          </div>

          <div aria-live="polite" aria-atomic="true" className="flex min-h-[170px] flex-col justify-between">
            <AnimatePresence initial={false} mode="wait">
              <motion.figure
                key={current}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="flex h-full flex-col justify-between"
              >
                <blockquote className="font-sans text-base leading-relaxed text-zinc-700 dark:text-zinc-200 sm:text-lg">
                  “{active.quote}”
                </blockquote>

                <figcaption className="mt-6 border-t border-black/[0.06] pt-4 dark:border-white/[0.08]">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                    {active.attribution}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{active.sector}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
