"use client";

import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { startQuote } from "@/lib/quote";

const weakProviderSignals = [
  "Cotiza sin entender el problema.",
  "No define alcance ni entregables.",
  "No documenta configuraciones ni accesos.",
  "Desaparece después de entregar.",
];

const findtecSignals = [
  "Primero levanta necesidad y prioridad.",
  "Propone opciones con alcance claro.",
  "Documenta y deja evidencia técnica.",
  "Acompaña la operación posterior.",
];

export function DecisionSection() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 gradient-radial opacity-30" />
      <div className="container-pro relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Cómo decidir mejor
          </p>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            La diferencia está en el orden, no solo en el precio
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Un servicio tecnológico confiable reduce incertidumbre antes de
            pedirte una decisión.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-2xl border border-red-400/25 bg-red-500/5 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Lo que genera desconfianza
                </h3>
              </div>
              <ul className="mt-6 space-y-3">
                {weakProviderSignals.map((signal) => (
                  <li key={signal} className="flex gap-3 text-sm text-muted-foreground">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    {signal}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal delayClass="delay-100">
            <article className="h-full rounded-2xl border border-[var(--accent-teal)]/30 bg-[var(--accent-teal)]/10 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-teal)]/20">
                  <CheckCircle2 className="h-5 w-5 text-[var(--accent-teal)]" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Cómo responde Findtec
                </h3>
              </div>
              <ul className="mt-6 space-y-3">
                {findtecSignals.map((signal) => (
                  <li key={signal} className="flex gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-teal)]" />
                    {signal}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>

        <div className="mt-8 flex justify-center sm:mt-10">
          <button
            type="button"
            onClick={() =>
              startQuote({
                servicio: "consultoria",
                mensaje: "Quiero una cotización con alcance y entregables claros.",
              })
            }
            className="btn-primary inline-flex h-12 min-h-12 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-white sm:h-14 sm:min-h-14"
          >
            Solicitar cotización clara
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
