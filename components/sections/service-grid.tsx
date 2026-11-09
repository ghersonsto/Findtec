"use client";

import {
  ArrowUpRight, BrainCircuit, Building2, ChartNoAxesCombined, Cloud,
  Code2, Headphones, Layers3, Workflow, type LucideIcon,
} from "lucide-react";
import { motion, MotionConfig } from "motion/react";

import { TiltCard } from "@/components/tilt-card";
import { serviceOptions } from "@/lib/company";
import { startQuote } from "@/lib/quote";

const symbols: Record<string, LucideIcon> = {
  "software-gestion": Layers3,
  ia: BrainCircuit,
  cloud: Cloud,
  b2g: Building2,
  web: Code2,
  automatizacion: Workflow,
  datos: ChartNoAxesCombined,
  soporte: Headphones,
};

export function ServiceGrid({ ids }: { ids: readonly string[] }) {
  return (
    <MotionConfig reducedMotion="user">
    <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {ids.map((id) => {
        const service = serviceOptions.find(({ value }) => value === id);
        if (!service) return null;
        const Icon = symbols[id] ?? Layers3;

        return (
          <li key={id} className="min-w-0">
            <TiltCard className="h-full rounded-lg" intensity={11} pop={8} glare={false}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => startQuote({ servicio: service.value, label: service.label })}
                aria-label={`Cotizar: ${service.label}`}
                className="group flex min-h-36 h-full w-full flex-col items-start justify-between gap-4 rounded-lg border border-border bg-card p-3 text-left shadow-sm transition-colors hover:border-primary sm:p-5 dark:bg-card/70"
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <span aria-hidden="true" className="relative block size-12 sm:size-14 [perspective:180px]">
                    <span className="absolute inset-0 rounded-lg border border-blue-800/25 bg-blue-200 [transform:rotateX(24deg)_rotateY(-22deg)_translate3d(3px,4px,-8px)] dark:border-blue-400/25 dark:bg-blue-950" />
                    <span className="absolute inset-0 grid place-items-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 shadow-[2px_4px_0_#93b2df] [transform:rotateX(24deg)_rotateY(-22deg)] dark:border-blue-400/40 dark:bg-blue-900 dark:text-blue-200 dark:shadow-[2px_4px_0_#17356b,0_0_18px_#2563eb40]">
                      <Icon className="size-6" />
                    </span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                </div>
                <span className="text-sm leading-snug font-semibold break-words sm:text-base">{service.label}</span>
              </motion.button>
            </TiltCard>
          </li>
        );
      })}
    </ul>
    </MotionConfig>
  );
}
