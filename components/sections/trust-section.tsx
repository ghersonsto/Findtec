"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import {
  CheckCircle2,
  ClipboardList,
  Code2,
  Rocket,
  TestTube2,
} from "lucide-react";

import { SectionEyebrow } from "@/components/section-eyebrow";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Consulta",
    description:
      "Relevamos requerimientos, arquitectura actual y prioridades antes de comprometer plazos.",
    deliverable: "Matriz de viabilidad y alcance preliminar",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Diseño y desarrollo",
    description:
      "Prototipamos, construimos y validamos en entornos controlados con alcance cerrado.",
    deliverable: "Propuesta técnica, hitos y build en staging",
    icon: Code2,
  },
  {
    number: "03",
    title: "Testeo",
    description:
      "Pruebas funcionales, de carga y seguridad antes de cualquier puesta en producción.",
    deliverable: "Informe de pruebas y checklist de go-live",
    icon: TestTube2,
  },
  {
    number: "04",
    title: "Lanzamiento",
    description:
      "Despliegue controlado, capacitación del equipo y mesa de ayuda con respuesta prioritaria.",
    deliverable: "Actas, manuales y canal de soporte activo",
    icon: Rocket,
  },
];

export function TrustSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduceMotion || !lineRef.current || !sectionRef.current) return;

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "center 40%",
            scrub: 0.6,
          },
        },
      );

      gsap.from(".process-step", {
        opacity: 0,
        y: 28,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          once: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [reduceMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="procesos"
      aria-labelledby="methodology-heading"
      className="section-cinematic relative isolate overflow-hidden pt-12 pb-20 text-foreground sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32"
    >
      <div className="container-pro relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Metodología</SectionEyebrow>
          <h2
            id="methodology-heading"
            className="mt-2.5 font-display text-balance text-[1.65rem] font-extrabold leading-tight tracking-tight text-foreground sm:mt-3 sm:text-5xl"
          >
            Un proceso{" "}
            <span className="bg-gradient-to-r from-sky-400 to-primary bg-clip-text text-transparent">
              claro
            </span>
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
            Cuatro etapas documentadas para entregar con alcance cerrado y estabilidad operativa.
          </p>
        </div>

        {/* Móvil: stepper vertical compacto; tablet: 2 cols; desktop: 4 cols */}
        <div className="relative mt-8 sm:mt-14 lg:mt-16">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[12%] right-[12%] top-8 hidden h-[2px] origin-left lg:block"
          >
            <div className="absolute inset-0 rounded-full bg-border" />
            <div
              ref={lineRef}
              className="absolute inset-0 origin-left scale-x-0 rounded-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 shadow-[0_0_16px_rgba(37,99,235,0.55)]"
            />
          </div>

          <ol className="grid gap-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              return (
                <li
                  key={step.number}
                  className="process-step relative flex gap-3.5 sm:flex-col sm:items-center sm:text-center"
                >
                  <div className="relative flex shrink-0 flex-col items-center">
                    <div className="group relative z-10 size-12 sm:size-16 [perspective:700px]">
                      <div
                        className={
                          reduceMotion
                            ? "relative size-full"
                            : "relative size-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] motion-reduce:transition-none"
                        }
                      >
                        <div className="absolute inset-0 flex items-center justify-center rounded-full border border-primary/30 bg-primary text-primary-foreground shadow-[0_0_28px_rgba(37,99,235,0.4)] [backface-visibility:hidden]">
                          <Icon className="size-5 sm:size-6" strokeWidth={2.1} />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center rounded-full border border-sky-400/40 bg-gradient-to-br from-sky-400 to-primary text-white shadow-[0_0_28px_rgba(37,99,235,0.45)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <span className="font-mono text-xs font-bold tracking-widest sm:text-sm">
                            {step.number}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!isLast ? (
                      <span
                        aria-hidden
                        className="mt-1 h-[calc(100%-0.25rem)] min-h-6 w-px grow bg-gradient-to-b from-primary/50 to-border sm:hidden"
                      />
                    ) : null}
                  </div>

                  <div className={`min-w-0 flex-1 pb-6 sm:pb-0 ${isLast ? "pb-0" : ""}`}>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:mt-4">
                      {step.number}
                    </p>
                    <h3 className="mt-1 font-display text-base font-bold tracking-tight text-foreground sm:mt-1.5 sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 max-w-[240px] font-sans text-[13px] leading-relaxed text-muted-foreground sm:mx-auto sm:mt-2 sm:text-sm">
                      {step.description}
                    </p>
                    <p className="mt-3 inline-flex max-w-[240px] items-start gap-1.5 rounded-xl border border-border bg-card/80 px-2.5 py-1.5 text-left text-[10px] text-foreground/80 dark:bg-white/[0.03] sm:mt-4 sm:px-3 sm:py-2 sm:text-[11px]">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                      <span>
                        <strong className="font-semibold">Entregable:</strong> {step.deliverable}
                      </span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
