import { BrandIcon, TECH_BRANDS } from "@/components/tech-brand-icons";

/** Cinta tecnológica — Server Component (animación CSS, sin hidratación). */
export function ClientsSection() {
  const loop = [...TECH_BRANDS, ...TECH_BRANDS];

  return (
    <section
      className="section-shell relative overflow-hidden border-y border-transparent py-4 dark:border-white/[0.03] sm:py-5"
      aria-labelledby="tech-heading"
    >
      <div className="container-pro relative mb-3 text-center sm:mb-4">
        <h2
          id="tech-heading"
          className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary"
        >
          Tecnologías que utilizamos
        </h2>
      </div>

      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track flex w-max items-center gap-3 px-3 animate-marquee motion-reduce:mx-auto motion-reduce:w-auto motion-reduce:max-w-5xl motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-2 motion-reduce:animate-none">
          {loop.map((tech, index) => (
            <div
              key={`${tech.slug}-${index}`}
              aria-hidden={index >= TECH_BRANDS.length ? true : undefined}
              className={`group flex shrink-0 select-none items-center gap-2.5 rounded-full border border-border/60 bg-card/70 px-3.5 py-2 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/35 dark:border-white/[0.06] dark:bg-white/[0.03] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] ${
                index >= TECH_BRANDS.length ? "motion-reduce:hidden" : ""
              }`}
            >
              <span className="flex size-7 items-center justify-center rounded-lg bg-background/80 dark:bg-black/30">
                <BrandIcon
                  slug={tech.slug}
                  color={tech.color}
                  name={tech.name}
                  microsoft={tech.microsoft}
                />
              </span>
              <span className="font-mono text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground sm:text-[13px]">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
