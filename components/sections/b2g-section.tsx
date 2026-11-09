"use client";

import { Building2, Check, Copy, FileCheck, Landmark, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Reveal } from "@/components/reveal";
import { company } from "@/lib/company";

const MotionLink = motion.create(Link);
const tapSpring = { type: "spring" as const, stiffness: 400, damping: 28, mass: 0.8 };

const pillars: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Building2,
    title: "Entidades del Estado",
    description: "Experiencia en ventas y atención a instituciones públicas.",
  },
  {
    icon: FileCheck,
    title: "Cumplimiento normativo",
    description: "Documentación y procesos para contratación pública.",
  },
  {
    icon: ShieldCheck,
    title: "RNP vigente",
    description: "Registro Nacional de Proveedores activo y actualizado.",
  },
  {
    icon: Landmark,
    title: "Requerimientos técnicos",
    description: "Capacidad para atender especificaciones del sector público.",
  },
];

const cardClass =
  "relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white/90 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-blue-500/25 before:to-transparent dark:border-white/[0.08] dark:bg-zinc-900/50 dark:shadow-none sm:p-6";

export function B2GSection({ compact = false }: { compact?: boolean } = {}) {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const copyRuc = async () => {
    try {
      await navigator.clipboard.writeText(company.ruc);
      setCopied(true);
      toast.success("RUC copiado al portapapeles", {
        description: "Listo para consulta en SUNAT o SEACE.",
      });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("No se pudo copiar el RUC", {
        description: "Cópialo manualmente desde el número en pantalla.",
      });
    }
  };

  return (
    <section
      id="experiencia-b2g"
      className={`relative overflow-hidden ${compact ? "py-16 sm:py-20 lg:py-24" : "section-pad"}`}
    >
      <div className="container-pro relative">
        <div className="grid items-start gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <Reveal>
            {compact ? null : (
              <h2 className="font-display max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Contratación con el Estado
              </h2>
            )}

            <p className="max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {company.legalName}. Atención a entidades del Estado con documentación y
              especificaciones técnicas.
            </p>
            <p className="mt-2 text-sm text-zinc-500">{company.address}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 py-1 pl-3.5 pr-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] dark:border-white/[0.08] dark:bg-zinc-900/40 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <span className="text-xs font-medium text-zinc-500">RUC</span>
                <span className="font-mono text-sm font-semibold tracking-wide text-foreground tabular-nums">
                  {company.ruc}
                </span>
                <motion.button
                  type="button"
                  onClick={copyRuc}
                  whileTap={reduceMotion ? undefined : { scale: 0.92 }}
                  transition={tapSpring}
                  aria-label={copied ? "RUC copiado" : "Copiar RUC"}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:text-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/40 dark:hover:text-[#3b82f6]"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </motion.button>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                RNP vigente
              </span>
            </div>

            <MotionLink
              href="/contacto?servicio=b2g"
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={tapSpring}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl border border-black/[0.06] bg-white/80 px-5 py-3 text-left text-sm font-medium text-zinc-900 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/40 dark:border-white/[0.08] dark:bg-zinc-900/40 dark:text-zinc-100 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
            >
              Solicitar Términos de Referencia (TDR) / Cotización B2G
            </MotionLink>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {pillars.map((pillar) => (
              <article key={pillar.title} className={cardClass}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.06]">
                  <pillar.icon className="h-4 w-4 text-[#3b82f6]" />
                </div>
                <h3 className="font-display relative mt-4 text-base font-medium tracking-tight text-foreground">
                  {pillar.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
