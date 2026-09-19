import {
  Server,
  Shield,
  Code,
  Cloud,
  Database,
  Headphones,
  ArrowRight,
} from "lucide-react";

const solutions = [
  {
    icon: Server,
    title: "Infraestructura IT",
    description:
      "Diseño, implementación y mantenimiento de infraestructura tecnológica escalable y de alto rendimiento.",
    features: ["Servidores", "Redes", "Data Centers"],
  },
  {
    icon: Shield,
    title: "Ciberseguridad",
    description:
      "Protección integral contra amenazas cibernéticas con soluciones avanzadas de seguridad empresarial.",
    features: ["Firewalls", "Antivirus", "Auditorías"],
  },
  {
    icon: Code,
    title: "Desarrollo de Software",
    description:
      "Aplicaciones personalizadas y sistemas a medida que automatizan y optimizan tus procesos de negocio.",
    features: ["Web Apps", "Móvil", "APIs"],
  },
  {
    icon: Cloud,
    title: "Servicios en la Nube",
    description:
      "Migración y gestión de servicios cloud con las principales plataformas del mercado.",
    features: ["AWS", "Azure", "Google Cloud"],
  },
  {
    icon: Database,
    title: "Gestión de Datos",
    description:
      "Soluciones de bases de datos, business intelligence y análisis para la toma de decisiones.",
    features: ["BI", "Analytics", "Big Data"],
  },
  {
    icon: Headphones,
    title: "Soporte Técnico",
    description:
      "Mesa de ayuda profesional con atención personalizada y tiempos de respuesta garantizados.",
    features: ["Remoto", "Presencial", "24/7"],
  },
];

export function SolutionsSection() {
  return (
    <section id="soluciones" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Nuestras Soluciones
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Tecnología que impulsa tu negocio
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Ofrecemos un portafolio completo de servicios tecnológicos diseñados
            para empresas que buscan crecer y optimizar sus operaciones.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <div
                key={solution.title}
                className="group relative rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card"
              >
                {/* Icon */}
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground">
                  {solution.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {solution.description}
                </p>

                {/* Features Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {solution.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Hover Arrow */}
                <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Conocer más
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
