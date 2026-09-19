"use client";

import { ArrowRight, ArrowUpRight, Bot, CheckCircle2, Play, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const heroFrames = [
  {
    image: "/images/hero-tech.jpg",
    title: "Infraestructura TI",
    label: "Diagnóstico y despliegue",
  },
  {
    image: "/images/hardware.jpg",
    title: "Hardware empresarial",
    label: "Equipos listos para operar",
  },
  {
    image: "/images/cloud.jpg",
    title: "Cloud y Microsoft 365",
    label: "Productividad segura",
  },
  {
    image: "/images/team.jpg",
    title: "Soporte cercano",
    label: "Atención B2B y B2G",
  },
];

const confidencePoints = [
  "Cotización clara",
  "Alcance documentado",
  "Soporte posterior",
];

export function HeroSection() {
  const [activeFrame, setActiveFrame] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveFrame((current) => (current + 1) % heroFrames.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  const openChatbot = () => {
    window.dispatchEvent(new Event("open-findtec-chatbot"));
  };

  return (
    <section id="inicio" className="relative min-h-[88vh] overflow-hidden noise">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-4 pt-24 pb-8 sm:flex-row sm:items-center sm:justify-between sm:pt-28 sm:pb-10">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-primary to-transparent" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              FindTec Soluciones
            </span>
          </div>
          <div className="hidden items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-2 md:flex">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              RNP vigente y atención B2B/B2G
            </span>
          </div>
        </div>

        <div className="grid items-center gap-10 pb-16 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-bold leading-[0.96] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                <span className="text-gradient-subtle">Soluciones TI</span>
                <br />
                <span className="text-foreground">para trabajar</span>
                <br />
                <span className="text-primary">con confianza</span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                FindTec Soluciones implementa hardware, soporte, Microsoft 365,
                redes, automatización, datos y desarrollo web con diagnóstico,
                documentación y acompañamiento posterior.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={openChatbot}
                className="btn-primary group inline-flex h-14 items-center justify-center gap-3 rounded-full px-8 text-base font-semibold text-white"
              >
                Cotizar con asistente
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <a
                href="#contacto"
                className="btn-outline inline-flex h-14 items-center justify-center gap-3 rounded-full px-8 text-base font-medium text-foreground"
              >
                Formulario
                <Bot className="h-5 w-5" />
              </a>
              <a
                href="#servicios"
                className="btn-outline inline-flex h-14 items-center justify-center gap-3 rounded-full px-8 text-base font-medium text-foreground"
              >
                Ver servicios
                <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-border pt-6 sm:flex sm:items-center sm:gap-10">
              <div>
                <div className="text-3xl font-bold text-foreground sm:text-4xl">100+</div>
                <div className="mt-1 text-sm text-muted-foreground">Clientes</div>
              </div>
              <div className="hidden h-12 w-px bg-border sm:block" />
              <div>
                <div className="text-3xl font-bold text-foreground sm:text-4xl">B2G</div>
                <div className="mt-1 text-sm text-muted-foreground">Experiencia</div>
              </div>
              <div className="hidden h-12 w-px bg-border sm:block" />
              <div>
                <div className="text-3xl font-bold text-foreground sm:text-4xl">24/7</div>
                <div className="mt-1 text-sm text-muted-foreground">Soporte</div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {confidencePoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card/70 px-3 py-3 text-sm font-semibold text-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[16/11] overflow-hidden rounded-lg border border-border bg-card shadow-2xl shadow-primary/10 lg:aspect-[4/5]">
              {heroFrames.map((frame, index) => (
                <Image
                  key={frame.image}
                  src={frame.image}
                  alt={frame.title}
                  fill
                  priority={index === 0}
                  className={`object-cover transition-all duration-1000 ${
                    activeFrame === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                <Play className="h-3.5 w-3.5 fill-white" />
                Reel tecnológico
              </div>

              <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-white/15 bg-black/35 p-4 text-white backdrop-blur-md sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                      {heroFrames[activeFrame].label}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">{heroFrames[activeFrame].title}</h2>
                  </div>
                  <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white/15 sm:flex">
                    <Bot className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {heroFrames.map((frame, index) => (
                    <button
                      key={frame.title}
                      type="button"
                      onClick={() => setActiveFrame(index)}
                      className={`h-1.5 rounded-full transition ${
                        activeFrame === index ? "bg-white" : "bg-white/25 hover:bg-white/50"
                      }`}
                      aria-label={`Ver ${frame.title}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-strong absolute -left-3 top-6 hidden rounded-lg p-4 sm:block lg:-left-8 lg:top-1/3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">En línea</div>
                  <div className="text-xs text-muted-foreground">Asesoría activa</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
