"use client";

import { ArrowRight, Award, Building, FileCheck, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Building,
    title: "Entidades del Estado",
    description: "Experiencia en ventas y atención a instituciones públicas.",
  },
  {
    icon: FileCheck,
    title: "Cumplimiento normativo",
    description: "Documentación y procesos para contratación pública.",
  },
  {
    icon: Award,
    title: "RNP vigente",
    description: "Registro Nacional de Proveedores activo y actualizado.",
  },
  {
    icon: ShieldCheck,
    title: "Requerimientos técnicos",
    description: "Capacidad para atender especificaciones del sector público.",
  },
];

export function B2GSection() {
  return (
    <section id="experiencia-b2g" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary" />
      <div className="noise absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
              <Building className="h-4 w-4" />
              Sector público
            </span>

            <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Experiencia comprobada en <span className="text-white/80">B2G</span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-white/80">
              En FindTec Soluciones contamos con experiencia en ventas y atención a
              entidades del Estado peruano, cumpliendo requerimientos técnicos,
              documentación y procesos de contratación pública.
            </p>

            <a
              href="#contacto"
              className="group mt-8 inline-flex h-14 items-center gap-3 rounded-full bg-white px-8 text-base font-semibold text-primary shadow-xl transition-all duration-300 hover:shadow-2xl"
            >
              Solicitar información
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/10 transition-all group-hover:bg-white/20">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-10 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-white">100+</div>
            <div className="mt-2 text-sm text-white/60">Proyectos B2G</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">50+</div>
            <div className="mt-2 text-sm text-white/60">Entidades atendidas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">RNP</div>
            <div className="mt-2 text-sm text-white/60">Vigente</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">100%</div>
            <div className="mt-2 text-sm text-white/60">Cumplimiento</div>
          </div>
        </div>
      </div>
    </section>
  );
}
