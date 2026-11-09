"use client";

import {
  BrainCircuit,
  Globe,
  Headphones,
  Layers,
  ShieldCheck,
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/reveal";
import { company } from "@/lib/company";
import { startQuote } from "@/lib/quote";
import {
  commercialServices,
  type ServiceIconKey,
} from "@/lib/services";
import { cn } from "@/lib/utils";

const SERVICE_ICONS: Record<ServiceIconKey, LucideIcon> = {
  globe: Globe,
  cart: ShoppingCart,
  layers: Layers,
  brain: BrainCircuit,
  shield: ShieldCheck,
  headphones: Headphones,
};

const CATEGORY_BY_ID: Record<string, string> = {
  web: "Presencia digital",
  ecommerce: "Comercio electrónico",
  apps: "Software a medida",
  ia: "Inteligencia & automatización",
  cloud: "Infraestructura & seguridad",
  soporte: "Operaciones TI",
};

const TECH_BY_ID: Record<string, string[]> = {
  web: ["Next.js / Laravel", "SEO técnico", "Diseño responsive"],
  ecommerce: ["Pasarelas locales", "Inventario", "Facturación electrónica"],
  apps: ["Laravel", "Vue.js", "MySQL", "Docker"],
  ia: ["FastAPI", "Python", "APIs asíncronas"],
  cloud: ["Microsoft 365", "WireGuard", "Backups"],
  soporte: ["Mesa de ayuda", "SLA < 24h", "Monitoreo"],
};

const detailedServices = commercialServices.map((service) => ({
  value: service.value,
  label: service.label,
  category: CATEGORY_BY_ID[service.id] || "Servicios Findtec",
  description: `${service.description} ${service.scope}`,
  deliverables: [
    ...service.benefits,
    ...service.useCases.slice(0, 1),
  ],
  techStack: TECH_BY_ID[service.id] || [],
  icon: SERVICE_ICONS[service.icon],
}));

export function ServicesSection({ compact = false }: { compact?: boolean } = {}) {
  const handleQuote = (serviceKey: string, serviceLabel: string) => {
    startQuote({
      servicio: serviceKey,
      label: serviceLabel,
      mensaje: `Hola, deseo cotizar el servicio de ${serviceLabel}.`,
    });
  };

  return (
    <section id="servicios" className="section-shell py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-64 w-[70%] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container-pro relative z-10">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Servicios
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Seis soluciones para operar con control
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              La misma oferta de la landing: web, tiendas, aplicaciones a medida, IA, cloud y
              soporte — con alcance documentado por {company.shortName}.
            </p>
          </div>
        </Reveal>

        <div
          className={cn(
            "mt-10 grid gap-4 sm:mt-12 sm:gap-5",
            compact ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {detailedServices.map((service) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.value}>
                <article className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-card/80 p-5 shadow-sm dark:border-white/[0.08] dark:bg-zinc-900/60 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="rounded-full border border-black/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground dark:border-white/[0.08]">
                      {service.category}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-foreground">
                    {service.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {service.techStack.length ? (
                    <p className="mt-4 text-[11px] text-muted-foreground">
                      {service.techStack.join(" · ")}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => handleQuote(service.value, service.label)}
                    className="btn-primary mt-auto inline-flex h-10 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-semibold"
                  >
                    Cotizar
                    <ArrowRight className="size-4" />
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
