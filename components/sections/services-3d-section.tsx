"use client";

import React, { useRef } from "react";
import {
  Code2,
  BrainCircuit,
  Server,
  Workflow,
  Headphones,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { startQuote } from "@/lib/quote";

interface ServiceCardData {
  id: string;
  serviceKey: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  deliverables: string[];
  visualType: "erp" | "ia" | "cloud" | "automation" | "support" | "security";
  accentColor: string;
}

const SERVICES_DATA: ServiceCardData[] = [
  {
    id: "erp",
    serviceKey: "software-gestion",
    title: "Sistemas Web de Gestión & ERP",
    category: "Software Propietario",
    badge: "Laravel 11 + Vue.js 3",
    description: "Plataformas centralizadas a medida para administrar ventas, inventarios multialmacén, compras y facturación electrónica SUNAT con control granular de accesos.",
    deliverables: ["Facturación SUNAT directa", "Kardex multisede", "Sin costo de licencias por usuario"],
    visualType: "erp",
    accentColor: "#2563EB",
  },
  {
    id: "ia",
    serviceKey: "ia",
    title: "Inteligencia Artificial & APIs",
    category: "Automatización Predictiva",
    badge: "FastAPI + Python",
    description: "APIs REST asíncronas de ultrabaja latencia (<150ms) para extracción de comprobantes en PDF/XML, triage documental y modelos predictivos seguros.",
    deliverables: ["Latencia < 150ms", "Extracción en PDF/XML", "Privacidad corporativa"],
    visualType: "ia",
    accentColor: "#00D9FF",
  },
  {
    id: "cloud",
    serviceKey: "cloud",
    title: "Cloud & Microsoft 365",
    category: "Continuidad Operativa",
    badge: "Docker + M365",
    description: "Despliegues en contenedores aislados Docker (99.98% SLA), administración segura de tenants Microsoft 365 y políticas de respaldo programadas.",
    deliverables: ["Contenedores Docker aislados", "Gestión Microsoft 365", "Backups automáticos"],
    visualType: "cloud",
    accentColor: "#3B82F6",
  },
  {
    id: "automation",
    serviceKey: "automatizacion",
    title: "Automatización de Procesos",
    category: "Eficiencia Operativa",
    badge: "Webhooks + APIs",
    description: "Sincronización automática entre bases de datos, comercio electrónico y logística para erradicar tareas repetitivas y cuellos de botella.",
    deliverables: ["Sincronización continua", "Colas asíncronas", "Notificaciones en tiempo real"],
    visualType: "automation",
    accentColor: "#818CF8",
  },
  {
    id: "support",
    serviceKey: "soporte",
    title: "Soporte TI Especializado",
    category: "Mesa de Ayuda Híbrida",
    badge: "SLA < 24 Horas",
    description: "Atención presencial y remota por ingenieros que conocen tu arquitectura, con tiempos de respuesta garantizados y mantenimiento preventivo periódico.",
    deliverables: ["Atención presencial y remota", "Mantenimiento preventivo", "Informes mensuales"],
    visualType: "support",
    accentColor: "#38BDF8",
  },
  {
    id: "security",
    serviceKey: "seguridad",
    title: "Redes, Seguridad & Sector Público",
    category: "Infraestructura & B2G",
    badge: "WireGuard + RNP OSCE",
    description: "Túneles VPN corporativos, segmentación de redes, y atención a entidades estatales con Registro Nacional de Proveedores (RUC 20613828606).",
    deliverables: ["VPN WireGuard cifrada", "RNP vigente OSCE", "Ley de Contrataciones 30225"],
    visualType: "security",
    accentColor: "#10B981",
  },
];

function CardVisual({ type }: { type: ServiceCardData["visualType"] }) {
  if (type === "erp") {
    return (
      <div className="h-32 w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 font-mono text-[11px] space-y-2 select-none overflow-hidden">
        <div className="flex items-center justify-between pb-1 border-b border-white/10 text-slate-400">
          <span className="text-[10px]">ERP :: VENTAS & KARDEX</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> SUNAT OK
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded bg-white/[0.04] p-1.5 border border-white/5">
            <span className="text-[9px] text-slate-400 block">Facturación Mes</span>
            <span className="font-bold text-white text-sm">S/ 148,920</span>
          </div>
          <div className="rounded bg-white/[0.04] p-1.5 border border-white/5">
            <span className="text-[9px] text-slate-400 block">Almacén Multisede</span>
            <span className="font-bold text-cyan-400 text-sm">99.2% Stock</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "ia") {
    return (
      <div className="h-32 w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 font-mono text-[11px] space-y-2 select-none overflow-hidden">
        <div className="flex items-center justify-between pb-1 border-b border-white/10 text-slate-400">
          <span className="text-[10px]">AI PIPELINE :: FASTAPI</span>
          <span className="text-cyan-300 font-semibold">142 ms latency</span>
        </div>
        <div className="rounded bg-blue-950/30 p-2 border border-blue-500/20 text-[10px] text-blue-200">
          <span className="text-cyan-400 block">▶ Extraction: Invoice #8492</span>
          <span className="text-slate-300">XML parsed · RUC valid · 3 items matched</span>
        </div>
      </div>
    );
  }

  if (type === "cloud") {
    return (
      <div className="h-32 w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 font-mono text-[11px] space-y-2 select-none overflow-hidden">
        <div className="flex items-center justify-between pb-1 border-b border-white/10 text-slate-400">
          <span className="text-[10px]">DOCKER CLUSTER :: HA</span>
          <span className="text-emerald-400">99.98% SLA</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((node) => (
              <span key={node} className="px-2 py-1 rounded bg-blue-600/20 text-blue-300 border border-blue-500/30 text-[9px]">
                N0{node}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-slate-400">Backups OK</span>
        </div>
      </div>
    );
  }

  if (type === "automation") {
    return (
      <div className="h-32 w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 font-mono text-[11px] space-y-2 select-none overflow-hidden">
        <div className="flex items-center justify-between pb-1 border-b border-white/10 text-slate-400">
          <span className="text-[10px]">WORKFLOW :: ASYNC QUEUE</span>
          <span className="text-indigo-400">Active</span>
        </div>
        <div className="flex items-center justify-between text-[10px] pt-1">
          <span className="px-2 py-1 rounded bg-indigo-950/40 border border-indigo-500/30 text-indigo-200">Order Trigger</span>
          <span className="text-slate-500">──▶</span>
          <span className="px-2 py-1 rounded bg-indigo-950/40 border border-indigo-500/30 text-indigo-200">Kardex Sync</span>
          <span className="text-slate-500">──▶</span>
          <span className="px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">SUNAT XML</span>
        </div>
      </div>
    );
  }

  if (type === "support") {
    return (
      <div className="h-32 w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 font-mono text-[11px] space-y-2 select-none overflow-hidden">
        <div className="flex items-center justify-between pb-1 border-b border-white/10 text-slate-400">
          <span className="text-[10px]">TELEMETRY :: MESA DE AYUDA</span>
          <span className="text-cyan-300">&lt; 24h SLA</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="text-left">
            <span className="text-[9px] text-slate-400 block">Disponibilidad Red</span>
            <span className="text-sm font-bold text-white">100.0%</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-400 block">Horario Hábil</span>
            <span className="text-sm font-bold text-emerald-400">09:00 - 19:00</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-32 w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 font-mono text-[11px] space-y-2 select-none overflow-hidden">
      <div className="flex items-center justify-between pb-1 border-b border-white/10 text-slate-400">
        <span className="text-[10px]">SECURITY :: WIREGUARD VPN</span>
        <span className="text-emerald-400">Encrypted</span>
      </div>
      <div className="flex items-center justify-between text-[10px] pt-1">
        <span className="text-slate-300">RNP OSCE: Habilitado Bienes & Servicios</span>
        <span className="font-bold text-white">RUC 20613828606</span>
      </div>
    </div>
  );
}

export function Services3DSection() {
  const reduceMotion = useReducedMotion();

  const handleQuote = (serviceKey: string, serviceTitle: string) => {
    startQuote({
      servicio: serviceKey,
      label: serviceTitle,
      mensaje: `Hola, deseo cotizar el servicio de ${serviceTitle} para mi empresa.`,
    });
  };

  return (
    <section
      id="servicios"
      aria-labelledby="services-3d-title"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#070D18] via-[#050914] to-[#050914] py-20 text-white sm:py-24 lg:py-32 border-t border-white/10"
    >
      {/* Luz volumétrica de ambientación */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[800px] rounded-full bg-blue-600/10 blur-[150px]"
      />

      <div className="container-pro relative z-10">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-white/10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-blue-300 backdrop-blur-md">
              <Sparkles className="size-3.5 text-cyan-400" />
              Catálogo Tecnológico Premium
            </div>
            <h2
              id="services-3d-title"
              className="mt-4 font-sans text-balance text-3xl font-extrabold tracking-tight sm:text-5xl leading-[1.08]"
            >
              Soluciones diseñadas con precisión de ingeniería
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300 font-light max-w-xl">
              Cada especialidad cuenta con su propia arquitectura, entregables verificables y garantía formal por contrato.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/servicios"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-400/50 hover:bg-white/[0.08] hover:text-cyan-300"
            >
              <span>Ver todas las especialidades</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Bento Grid 3D de Servicios */}
        <div className="mt-12 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES_DATA.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: reduceMotion ? 0 : idx * 0.08, ease: [0.33, 1, 0.68, 1] }}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/40 p-6 sm:p-7 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_16px_36px_rgba(0,0,0,0.4)] transition-all duration-500 hover:border-blue-400/40 hover:bg-slate-900/65 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(37,99,235,0.2)]"
            >
              <div>
                {/* Cabecera de la Tarjeta */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                    {service.category}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 bg-white/[0.04] border border-white/5 px-2 py-0.5 rounded">
                    {service.badge}
                  </span>
                </div>

                <h3 className="mt-4 font-sans text-xl font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors">
                  {service.title}
                </h3>

                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-300/80 font-light">
                  {service.description}
                </p>

                {/* Representación Visual Interactiva */}
                <div className="mt-5">
                  <CardVisual type={service.visualType} />
                </div>

                {/* Entregables Clave */}
                <div className="mt-5 space-y-1.5 text-xs text-slate-300">
                  {service.deliverables.map((item, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="size-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón de Cotización con Microinteracción */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleQuote(service.serviceKey, service.title)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.05] border border-white/10 py-2.5 px-4 text-xs font-semibold text-white transition-all duration-200 group-hover:bg-blue-600 group-hover:border-blue-600 active:scale-[0.98] cursor-pointer"
                >
                  <span>Cotizar {service.title.split(" ")[0]}</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
