"use client";

import React, { useState } from "react";
import {
  Code2,
  BrainCircuit,
  Server,
  ShieldCheck,
  Workflow,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { startQuote } from "@/lib/quote";

type EcosystemNodeKey = "software" | "ia" | "cloud" | "security" | "automation" | "support";

interface EcosystemNode {
  id: EcosystemNodeKey;
  title: string;
  category: string;
  badge: string;
  icon: typeof Code2;
  color: string;
  description: string;
  businessImpact: string;
  features: string[];
  tech: string[];
  serviceKey: string;
}

const NODES: EcosystemNode[] = [
  {
    id: "software",
    title: "Desarrollo de Software & ERP",
    category: "Gestión Centralizada",
    badge: "Laravel 11 + Vue.js 3",
    icon: Code2,
    color: "#2563EB",
    description: "Sistemas web a medida para controlar inventarios multialmacén, facturación electrónica SUNAT y trazabilidad de operaciones sin licencias por usuario.",
    businessImpact: "Centraliza el 100% de la operación comercial y administrativa en una sola plataforma propietaria.",
    features: ["Emisión de facturas y guías SUNAT", "Kardex valorizado en tiempo real", "Módulos personalizados por departamento"],
    tech: ["Laravel", "Vue 3", "MySQL Enterprise", "Docker"],
    serviceKey: "software-gestion",
  },
  {
    id: "ia",
    title: "Inteligencia Artificial & APIs",
    category: "Automatización Predictiva",
    badge: "FastAPI + Python",
    icon: BrainCircuit,
    color: "#00D9FF",
    description: "Modelos predictivos, agentes autónomos y APIs de baja latencia (<150ms) para extracción de comprobantes en PDF/XML y analítica avanzada.",
    businessImpact: "Reduce hasta un 70% el tiempo invertido en tareas repetitivas y validaciones manuales de documentos.",
    features: ["Extracción inteligente de comprobantes", "Agentes de atención y triage", "Privacidad estricta de datos empresariales"],
    tech: ["FastAPI", "Python 3.12", "PyTorch", "Redis"],
    serviceKey: "ia",
  },
  {
    id: "cloud",
    title: "Infraestructura Cloud & M365",
    category: "Alta Disponibilidad",
    badge: "Docker + Microsoft 365",
    icon: Server,
    color: "#3B82F6",
    description: "Despliegues en contenedores aislados de alta disponibilidad (99.98% SLA), administración segura de Microsoft 365 y copias de seguridad programadas.",
    businessImpact: "Elimina caídas de servicio imprevistas y garantiza continuidad operativa 24/7 con respaldo diario.",
    features: ["Clústeres Docker redundantes", "Administración tenant Microsoft 365", "Backups automáticos cifrados"],
    tech: ["Docker", "Microsoft 365", "Ubuntu Server", "Azure"],
    serviceKey: "cloud",
  },
  {
    id: "security",
    title: "Ciberseguridad & Redes",
    category: "Protección Perimetral",
    badge: "WireGuard + VLANs",
    icon: ShieldCheck,
    color: "#10B981",
    description: "Túneles VPN corporativos seguros, segmentación de redes, firewalls perimetrales y cumplimiento normativo para resguardar activos digitales.",
    businessImpact: "Protege la información confidencial de clientes y finanzas contra accesos no autorizados y fugas de datos.",
    features: ["Túneles VPN cifrados punto a punto", "Auditoría de accesos y puertos", "Cumplimiento normativo y RNP OSCE"],
    tech: ["WireGuard", "OPNsense", "VLANs", "EDR"],
    serviceKey: "seguridad",
  },
  {
    id: "automation",
    title: "Automatización de Procesos",
    category: "Eficiencia de Flujos",
    badge: "Integración Digital",
    icon: Workflow,
    color: "#818CF8",
    description: "Interconexión fluida entre plataformas existentes, bases de datos y servicios externos para sincronizar información sin errores humanos.",
    businessImpact: "Acelera los tiempos de respuesta y despachos conectando ventas, almacén y cobranzas en tiempo real.",
    features: ["Webhooks y colas de mensajes asíncronas", "Sincronización automática de inventario", "Notificaciones y alertas operativas"],
    tech: ["Webhooks", "RabbitMQ", "Node.js", "APIs REST"],
    serviceKey: "automatizacion",
  },
  {
    id: "support",
    title: "Soporte TI Especializado",
    category: "Acompañamiento Continuo",
    badge: "SLA < 24 Horas",
    icon: Headphones,
    color: "#38BDF8",
    description: "Mesa de ayuda presencial y remota con atención prioritaria brindada por ingenieros que conocen a fondo tu infraestructura.",
    businessImpact: "Minimiza el tiempo de inactividad de tus colaboradores ante cualquier incidencia tecnológica.",
    features: ["Atención híbrida remota y presencial", "Mantenimiento preventivo periódico", "Informes técnicos mensuales"],
    tech: ["Mesa de Ayuda", "Monitoreo 24/7", "SLA Garantizado"],
    serviceKey: "soporte",
  },
];

export function Ecosystem3DSection() {
  const [activeId, setActiveId] = useState<EcosystemNodeKey>("software");
  const reduceMotion = useReducedMotion();

  const activeNode = NODES.find((n) => n.id === activeId) || NODES[0];
  const ActiveIcon = activeNode.icon;

  const handleQuote = (serviceKey: string, serviceTitle: string) => {
    startQuote({
      servicio: serviceKey,
      label: serviceTitle,
      mensaje: `Hola, me interesa conocer más detalles y cotizar la solución de ${serviceTitle} de su ecosistema.`,
    });
  };

  return (
    <section
      id="ecosistema"
      aria-labelledby="ecosystem-heading"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#050914] via-[#071326] to-[#050914] py-20 text-white sm:py-24 lg:py-32 border-t border-white/10"
    >
      {/* Luz volumétrica de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[150px]"
      />

      <div className="container-pro relative z-10">
        {/* Encabezado Principal */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-blue-300 backdrop-blur-md">
            <Sparkles className="size-3.5 text-cyan-400" />
            Infraestructura Integrada
          </div>
          <h2
            id="ecosystem-heading"
            className="mt-4 font-sans text-balance text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.25rem] leading-[1.08]"
          >
            UN ECOSISTEMA TECNOLÓGICO. INFINITAS POSIBILIDADES.
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300 font-light max-w-2xl mx-auto">
            Una arquitectura conectada que integra cada faceta operativa de tu empresa en una única fuente de verdad y rendimiento.
          </p>
        </div>

        {/* Malla Interactiva: Selector de Nodos + Panel de Detalle */}
        <div className="mt-14 sm:mt-18 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Columna Izquierda: Nodos Interactivos Orbitantes */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {NODES.map((node) => {
              const Icon = node.icon;
              const isActive = node.id === activeId;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveId(node.id)}
                  aria-pressed={isActive}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 text-left transition-all duration-300 cursor-pointer select-none backdrop-blur-xl ${
                    isActive
                      ? "border-blue-400/60 bg-blue-950/40 shadow-[0_0_24px_rgba(37,99,235,0.25),inset_0_1px_0_0_rgba(255,255,255,0.2)]"
                      : "border-white/10 bg-slate-950/40 hover:border-white/20 hover:bg-slate-900/50"
                  }`}
                >
                  {/* Active Indicator Pin */}
                  {isActive && (
                    <motion.div
                      layoutId="ecosystem-active-indicator"
                      className="absolute -top-1 -right-1 size-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00D9FF]"
                      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <div
                      className="flex size-10 items-center justify-center rounded-xl border transition-colors shadow-sm"
                      style={{
                        backgroundColor: isActive ? `${node.color}25` : "rgba(255,255,255,0.04)",
                        borderColor: isActive ? node.color : "rgba(255,255,255,0.1)",
                        color: isActive ? "#ffffff" : node.color,
                      }}
                    >
                      <Icon className="size-5" />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                      {node.badge.split(" ")[0]}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-sans text-xs sm:text-sm font-bold text-white group-hover:text-blue-200 transition-colors line-clamp-2">
                      {node.title}
                    </h3>
                    <span className="mt-1 block font-mono text-[10px] text-slate-400">
                      {node.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Columna Derecha: Tarjeta Tridimensional Detallada del Nodo Seleccionado */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -16 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-[#050914] p-6 sm:p-8 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_20px_48px_rgba(0,0,0,0.5)]"
              >
                {/* Cabecera del Nodo */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-12 items-center justify-center rounded-xl border shadow-md"
                      style={{
                        backgroundColor: `${activeNode.color}20`,
                        borderColor: `${activeNode.color}50`,
                        color: activeNode.color,
                      }}
                    >
                      <ActiveIcon className="size-6" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-300">
                        {activeNode.category}
                      </span>
                      <h4 className="font-sans text-xl sm:text-2xl font-bold text-white">
                        {activeNode.title}
                      </h4>
                    </div>
                  </div>

                  <span className="hidden sm:inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs text-slate-300">
                    {activeNode.badge}
                  </span>
                </div>

                {/* Explicación y Utilidad Empresarial */}
                <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-300 font-light">
                  {activeNode.description}
                </p>

                {/* Impacto Comercial Clave */}
                <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-950/30 p-3.5 text-xs text-blue-200">
                  <div className="flex items-start gap-2">
                    <Zap className="size-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold">Impacto en el Negocio: </strong>
                      <span className="text-slate-200">{activeNode.businessImpact}</span>
                    </div>
                  </div>
                </div>

                {/* Características Reales */}
                <div className="mt-5 space-y-2 text-xs sm:text-sm text-slate-300">
                  {activeNode.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="size-4 text-cyan-400 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Stack de Tecnologías */}
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {activeNode.tech.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] text-slate-300 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuote(activeNode.serviceKey, activeNode.title)}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-xs sm:text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-500 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Cotizar solución</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
