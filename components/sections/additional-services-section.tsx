import {
  Wrench,
  Globe,
  BarChart3,
  Zap,
  ShoppingCart,
  Settings,
  Cloud,
} from "lucide-react";

const additionalServices = [
  {
    icon: Wrench,
    title: "Soporte técnico presencial y remoto",
  },
  {
    icon: Settings,
    title: "Mantenimiento preventivo y correctivo de equipos",
  },
  {
    icon: Globe,
    title: "Desarrollo de sitios web institucionales",
  },
  {
    icon: BarChart3,
    title: "Análisis y visualización de datos",
  },
  {
    icon: Zap,
    title: "Automatización de procesos",
  },
  {
    icon: ShoppingCart,
    title: "Asesoría en adquisición tecnológica",
  },
  {
    icon: Cloud,
    title: "Implementación y administración de herramientas Microsoft 365",
  },
];

export function AdditionalServicesSection() {
  return (
    <section className="bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Servicios Complementarios
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Soluciones que impulsan tu operación
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {additionalServices.map((service, index) => (
            <div
              key={index}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {service.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
