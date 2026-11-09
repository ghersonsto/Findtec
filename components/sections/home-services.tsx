"use client";

import {
  Globe,
  ShoppingCart,
  Layers,
  BrainCircuit,
  ShieldCheck,
  Headphones,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { TiltCard } from "@/components/tilt-card";
import { useDesign } from "@/hooks/use-design";
import { startQuote } from "@/lib/quote";
import {
  commercialServices,
  type ServiceIconKey,
} from "@/lib/services";
import { cn } from "@/lib/utils";

const SERVICE_ICONS: Record<ServiceIconKey, typeof Globe> = {
  globe: Globe,
  cart: ShoppingCart,
  layers: Layers,
  brain: BrainCircuit,
  shield: ShieldCheck,
  headphones: Headphones,
};

const SERVICES = commercialServices.map((service) => ({
  id: service.id,
  serviceKey: service.value,
  title: service.label,
  description: service.description,
  icon: SERVICE_ICONS[service.icon],
  checks: service.benefits,
}));

export function HomeServices() {
  const reduceMotion = useReducedMotion();
  const { design } = useDesign();

  const handleServiceQuote = (serviceKey: string, serviceTitle: string) => {
    startQuote({
      servicio: serviceKey,
      label: serviceTitle,
      mensaje: `Hola Findtec, deseo cotizar el servicio de ${serviceTitle} para mi empresa.`,
    });
  };

  return (
    <section
      id="servicios"
      aria-labelledby="services-heading"
      className="section-cinematic relative isolate overflow-hidden scroll-mt-[var(--nav-scroll-offset,5.5rem)] pt-8 pb-14 text-foreground sm:pt-12 sm:pb-20 lg:pt-12 lg:pb-24"
    >
      <div className="container-pro relative z-10">
        <div className="mx-auto max-w-3xl text-center" data-nav-focus-header>
          <SectionEyebrow>Servicios</SectionEyebrow>
          <h2
            id="services-heading"
            className="mt-2 font-display text-balance text-[1.65rem] font-extrabold leading-tight tracking-tight text-foreground sm:mt-2.5 sm:text-4xl lg:text-[2.75rem]"
          >
            Soluciones digitales{" "}
            <span className="bg-gradient-to-r from-sky-400 to-primary bg-clip-text text-transparent">
              de principio a fin
            </span>
          </h2>
          <p className="mx-auto mt-2.5 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">
            Desde el diseño hasta la infraestructura y el soporte continuo. Un solo equipo para todo
            tu proyecto.
          </p>
        </div>

        <div
          data-nav-focus
          className="mx-auto mt-4 grid max-w-5xl grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:mt-6 sm:gap-2.5 lg:grid-cols-3 lg:gap-3"
        >
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 32,
                  delay: reduceMotion ? 0 : index * 0.05,
                }}
                className="h-full"
              >
                <TiltCard
                  intensity={8}
                  pop={10}
                  className="h-full rounded-xl"
                >
                  <button
                    type="button"
                    onClick={() => handleServiceQuote(service.serviceKey, service.title)}
                    className={cn(
                      "group glass-card relative flex h-full w-full cursor-pointer flex-col rounded-xl p-2.5 text-left transition-[border-color,box-shadow] hover:border-primary/40 active:scale-[0.98] sm:p-3.5",
                    )}
                  >
                    <div
                      className="flex size-7 items-center justify-center rounded-lg border border-primary/25 bg-gradient-to-br from-primary/20 to-sky-400/10 text-primary shadow-[0_0_18px_rgba(37,99,235,0.35)] sm:size-8"
                      style={{ transform: `translateZ(${design.motion.popZ.card}px)` }}
                    >
                      <Icon className="size-3.5 sm:size-3.5" strokeWidth={2.25} />
                    </div>

                    <h3 className="mt-2 font-display text-[13px] font-bold leading-snug tracking-tight text-foreground sm:mt-2.5 sm:text-[15px]">
                      {service.title}
                    </h3>
                    <p className="mt-1 flex-1 font-sans text-[11px] leading-snug text-muted-foreground sm:text-[12.5px]">
                      {service.description}
                    </p>

                    <ul className="mt-2 space-y-0.5 border-t border-border pt-2 dark:border-white/[0.06] sm:mt-2.5 sm:space-y-1 sm:pt-2.5">
                      {service.checks.map((check) => (
                        <li
                          key={check}
                          className="flex items-start gap-1.5 text-[10px] font-medium leading-snug text-foreground/80 sm:items-center sm:gap-1.5 sm:text-[11px]"
                        >
                          <Check className="mt-0.5 size-2.5 shrink-0 text-primary sm:mt-0 sm:size-3" strokeWidth={3} />
                          {check}
                        </li>
                      ))}
                    </ul>
                  </button>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 text-center sm:mt-5">
          <p className="text-sm text-muted-foreground">
            ¿No ves exactamente lo que necesitas? Cada proyecto se cotiza a medida.
          </p>
          <button
            type="button"
            onClick={() =>
              startQuote({
                servicio: "otro",
                mensaje: "Hola Findtec, quiero cotizar un proyecto a medida.",
              })
            }
            className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary transition-transform hover:translate-x-0.5 active:scale-[0.98]"
          >
            Cuéntanos tu proyecto
            <ArrowUpRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
