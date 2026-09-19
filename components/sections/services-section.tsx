"use client";

import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Car,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Code2,
  FileText,
  Headphones,
  Monitor,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const services = [
  {
    icon: Monitor,
    title: "Hardware empresarial",
    category: "Equipamiento",
    description:
      "Computadoras, laptops, periféricos e infraestructura tecnológica para empresas e instituciones.",
    image: "/images/hardware.jpg",
    features: ["Equipos certificados", "Garantía extendida", "Soporte técnico"],
    details: [
      "Evaluación de requerimientos por área, usuario y carga de trabajo.",
      "Preparación, configuración y entrega de equipos listos para operar.",
      "Control de inventario, bajas seguras y documentación de activos.",
    ],
    deliverables: ["Ficha técnica", "Inventario de equipos", "Plan de mantenimiento"],
  },
  {
    icon: Cloud,
    title: "Cloud y Microsoft 365",
    category: "Productividad",
    description:
      "Implementación, licencias, seguridad y administración de Microsoft 365, Exchange, SharePoint y OneDrive.",
    image: "/images/cloud.jpg",
    features: ["Exchange", "SharePoint", "Power Automate"],
    details: [
      "Altas, bajas, licencias, buzones, grupos, permisos y políticas de acceso.",
      "Soporte a herramientas colaborativas y capacitación a usuarios.",
      "Flujos de automatización para reducir tareas manuales repetitivas.",
    ],
    deliverables: ["Tenant organizado", "Matriz de accesos", "Flujos automatizados"],
  },
  {
    icon: Headphones,
    title: "Soporte técnico N1/N2",
    category: "Operación TI",
    description:
      "Mesa de ayuda remota y presencial para usuarios, equipos, software, accesos y periféricos.",
    image: "/images/team.jpg",
    features: ["Tickets", "Onboarding", "Capacitación"],
    details: [
      "Diagnóstico y solución de fallas en hardware, software, correos y accesos.",
      "Gestión de tickets con prioridad, estado, responsable y evidencia.",
      "Inducción de usuarios y creación de manuales prácticos.",
    ],
    deliverables: ["Registro de tickets", "Manuales de usuario", "Reporte mensual"],
  },
  {
    icon: ServerCog,
    title: "Redes e infraestructura",
    category: "Conectividad",
    description:
      "LAN/WAN, VLANs, Wi-Fi corporativo, PoE, servidores, respaldos, antivirus y firewalls.",
    image: "/images/cloud.jpg",
    features: ["LAN/WAN", "Backups", "Firewalls"],
    details: [
      "Diagnóstico de conectividad, segmentación básica y documentación de red.",
      "Supervisión de respaldos, antivirus, servidores y controles críticos.",
      "Coordinación con proveedores para mejoras y continuidad operativa.",
    ],
    deliverables: ["Mapa de red", "Checklist de seguridad", "Plan de continuidad"],
  },
  {
    icon: ShieldCheck,
    title: "Seguridad y cumplimiento TI",
    category: "Gobierno TI",
    description:
      "Controles de acceso, respaldos, documentación, auditoría y buenas prácticas para usuarios finales.",
    image: "/images/hero-tech.jpg",
    features: ["Accesos", "Auditoría", "Respaldos"],
    details: [
      "Onboarding/offboarding de accesos y revisión de privilegios.",
      "Documentación de controles críticos y evidencia para auditorías.",
      "Capacitación en buenas prácticas, phishing y uso responsable de sistemas.",
    ],
    deliverables: ["Matriz de accesos", "Evidencias de control", "Guías de seguridad"],
  },
  {
    icon: BarChart3,
    title: "Dashboards y análisis de datos",
    category: "Data",
    description:
      "Power BI, Excel, SQL Server y visualizaciones para medir operación, soporte e indicadores de negocio.",
    image: "/images/hero-tech.jpg",
    features: ["Power BI", "SQL Server", "KPIs"],
    details: [
      "Limpieza y modelado de datos para reportes ejecutivos u operativos.",
      "Definición de KPIs y vistas por área, estado o prioridad.",
      "Documentación del origen de datos y criterios de medición.",
    ],
    deliverables: ["Dashboard", "Modelo de datos", "Diccionario de métricas"],
  },
  {
    icon: Code2,
    title: "Desarrollo web",
    category: "Software",
    description:
      "Sitios y aplicaciones responsive con React, formularios, SEO, UI profesional y prototipado.",
    image: "/images/hero-tech.jpg",
    features: ["React", "Responsive", "SEO"],
    details: [
      "Diseño mobile-first para escritorio, tablet y móvil.",
      "Componentes reutilizables, formularios y estructura preparada para SEO.",
      "Interfaz alineada a marca, contenido y objetivos comerciales.",
    ],
    deliverables: ["Sitio responsive", "Componentes UI", "Guía visual"],
  },
  {
    icon: BrainCircuit,
    title: "IA y automatización",
    category: "Innovación",
    description:
      "Prototipos de análisis, clasificación, visualización y automatización con herramientas modernas.",
    image: "/images/cloud.jpg",
    features: ["Python", "Modelos ML", "Automatización"],
    details: [
      "Preparación de datasets, entrenamiento y evaluación de modelos.",
      "Visualización de métricas y resultados para comunicar hallazgos.",
      "Prototipos aplicados para clasificación, predicción y automatización.",
    ],
    deliverables: ["Notebook reproducible", "Métricas", "Reporte técnico"],
  },
  {
    icon: FileText,
    title: "Documentación y capacitación",
    category: "Adopción",
    description:
      "Manuales, comunicados técnicos, documentación de infraestructura e inducción a usuarios.",
    image: "/images/team.jpg",
    features: ["Manuales", "Comunicados", "Inducción"],
    details: [
      "Documentación clara para usuarios, soporte y continuidad operativa.",
      "Comunicados técnicos para incidencias, cambios y actualizaciones.",
      "Sesiones de capacitación para herramientas colaborativas y procesos TI.",
    ],
    deliverables: ["Manual de usuario", "Base documental", "Plan de capacitación"],
  },
  {
    icon: Car,
    title: "Consultoría automotriz",
    category: "Especialidad",
    description:
      "Dashboards, análisis de datos y optimización de procesos para el sector automotriz.",
    image: "/images/automotive.jpg",
    features: ["Analytics", "Dashboards", "Procesos"],
    details: [
      "Levantamiento de procesos e indicadores de operación.",
      "Dashboards para seguimiento comercial, soporte u operación.",
      "Automatización de reportes y tareas de control.",
    ],
    deliverables: ["Mapa de proceso", "Dashboard", "Plan de mejora"],
  },
  {
    icon: Wrench,
    title: "Mantenimiento preventivo",
    category: "Continuidad",
    description:
      "Revisión de equipos, software, limpieza lógica, actualización, respaldos y recomendaciones.",
    image: "/images/hardware.jpg",
    features: ["Preventivo", "Correctivo", "Inventario"],
    details: [
      "Revisión periódica de equipos, periféricos, software y estado operativo.",
      "Registro de hallazgos, acciones correctivas y recomendaciones.",
      "Priorización de equipos críticos para reducir interrupciones.",
    ],
    deliverables: ["Checklist técnico", "Reporte de hallazgos", "Cronograma"],
  },
];

type Service = (typeof services)[number];

export function ServicesSection() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeServiceTitle, setActiveServiceTitle] = useState(services[0].title);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = selectedService ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedService]);

  const scrollServices = (direction: "prev" | "next") => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const distance = Math.min(carousel.clientWidth * 0.86, 420);
    carousel.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  };

  const openService = (service: Service) => {
    setActiveServiceTitle(service.title);
    setSelectedService(service);
  };

  return (
    <section id="servicios" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute left-1/2 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Servicios inteligentes
            </span>
            <h2 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Servicios TI en una fila movible para elegir rápido
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Desliza, compara y abre el servicio que necesitas. Cada tarjeta usa una imagen relacionada con el tema.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollServices("prev")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-primary/50 hover:text-primary"
              aria-label="Ver servicios anteriores"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollServices("next")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-primary/50 hover:text-primary"
              aria-label="Ver más servicios"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4"
          aria-label="Carrusel de servicios FindTec"
        >
          {services.map((service) => {
            const isActive = activeServiceTitle === service.title;

            return (
              <article
                key={service.title}
                className={`group relative flex min-h-[520px] w-[82vw] max-w-[360px] shrink-0 snap-start flex-col overflow-hidden rounded-lg border bg-card/70 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 sm:w-[46vw] lg:w-[360px] ${
                  isActive ? "border-primary/60 shadow-xl shadow-primary/10" : "border-border/70 hover:border-primary/30"
                }`}
              >
                <button type="button" onClick={() => openService(service)} className="relative h-52 w-full overflow-hidden text-left">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 360px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/55 to-transparent" />
                  <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {service.category}
                  </span>
                  <div className="absolute bottom-4 left-5 flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-card/90 p-3 backdrop-blur-xl">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                </button>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className={`text-xl font-bold ${isActive ? "text-primary" : "text-foreground"}`}>
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full border border-border bg-secondary/70 px-3 py-1 text-xs font-medium text-foreground/70"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => openService(service)}
                    className={`mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold transition-colors ${
                      isActive ? "text-primary underline underline-offset-4" : "text-primary hover:text-primary/80"
                    }`}
                  >
                    {isActive ? "Servicio seleccionado" : "Ver detalle inteligente"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-lg border border-border bg-card/60 p-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Tip: en celular y tablet puedes deslizar la fila de servicios con el dedo.
          </p>
          <a
            href="#contacto"
            className="btn-primary inline-flex h-12 items-center justify-center gap-3 rounded-full px-6 text-sm font-semibold text-white"
          >
            Solicitar evaluación
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {selectedService && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setSelectedService(null)}
        >
          <article
            className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid max-h-[92vh] overflow-y-auto lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[260px] lg:min-h-full">
                <Image src={selectedService.image} alt={selectedService.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {selectedService.category}
                  </span>
                  <h3 id="service-modal-title" className="mt-4 text-3xl font-bold text-foreground">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              <div className="relative p-6 sm:p-8">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label="Cerrar detalle"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="pr-12">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {selectedService.description}
                  </p>
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                      Alcance
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {selectedService.details.map((detail) => (
                        <li key={detail} className="flex gap-3 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                      Entregables
                    </h4>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedService.deliverables.map((deliverable) => (
                        <span
                          key={deliverable}
                          className="rounded-full border border-border bg-secondary/70 px-3 py-1.5 text-xs font-semibold text-foreground/80"
                        >
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <a
                  href="#contacto"
                  onClick={() => setSelectedService(null)}
                  className="btn-primary mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white"
                >
                  Cotizar este servicio
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
