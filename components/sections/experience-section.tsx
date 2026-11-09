"use client";

import Image from "next/image";
import { Building2, Code2 } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { companyCapabilities, companyProjects } from "@/lib/experience";

export function ExperienceSection() {
  return (
    <section id="proyectos" className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/25 to-background" />

      <div className="container-pro relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Capacidad empresarial
          </p>
          <h2 className="font-display mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Proyectos y capacidades de Findtec Soluciones
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Entregamos software, IA e infraestructura con alcance claro para
            empresas e instituciones en Perú.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {companyProjects.map((project, index) => (
            <Reveal key={project.title} delayClass={index === 1 ? "delay-100" : undefined}>
              <article className="card-3d group flex h-full flex-col overflow-hidden rounded-3xl">
                <div className="relative h-48 overflow-hidden sm:h-52">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      <Code2 className="h-3.5 w-3.5" />
                      Proyecto · {project.period}
                    </div>
                    <h3 className="font-display mt-2 text-xl font-bold text-foreground sm:text-2xl">
                      {project.title}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border bg-secondary/70 px-3 py-1 text-xs font-semibold text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <ul className="mt-5 space-y-3">
                    {project.points.map((point) => (
                      <li key={point} className="text-sm leading-relaxed text-muted-foreground">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {companyCapabilities.map((item, index) => (
            <Reveal
              key={item.title}
              delayClass={index % 2 === 1 ? "delay-100" : undefined}
            >
              <article className="h-full rounded-2xl border border-border bg-card/70 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
