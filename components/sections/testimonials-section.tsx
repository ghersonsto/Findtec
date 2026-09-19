import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "FindTec nos ayudó a ordenar equipos, accesos y soporte diario con una respuesta muy rápida.",
    author: "Área de administración",
    role: "Cliente corporativo",
    company: "Servicios profesionales",
    initials: "AA",
  },
  {
    quote:
      "La implementación de Microsoft 365 y la documentación técnica mejoraron la continuidad del equipo.",
    author: "Jefatura de operaciones",
    role: "Cliente empresarial",
    company: "Operaciones y logística",
    initials: "JO",
  },
  {
    quote:
      "Recibimos acompañamiento para cotización, entrega de equipos y soporte posterior con trazabilidad.",
    author: "Unidad de TI",
    role: "Cliente B2G",
    company: "Entidad pública",
    initials: "UT",
  },
];

const trustMetrics = [
  "Atención B2B/B2G",
  "Soporte documentado",
  "Seguimiento post entrega",
  "Comunicación directa",
];

const sectors = ["Empresas privadas", "Entidades públicas", "Servicios", "Operaciones", "Tecnología", "Automotriz"];

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="relative bg-card/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Confianza
            </span>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Señales reales de un proveedor confiable
            </h2>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Una empresa contrata cuando siente claridad, orden y respaldo. Por eso
              FindTec comunica alcance, entrega evidencia y mantiene un canal directo.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {trustMetrics.map((metric) => (
              <div
                key={metric}
                className="flex items-center gap-2 rounded-lg border border-border bg-background/70 px-4 py-3 text-sm font-semibold text-foreground"
              >
                <Star className="h-4 w-4 fill-primary text-primary" />
                {metric}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.author}
              className="relative rounded-lg border border-border/50 bg-card p-8"
            >
              <Quote className="h-10 w-10 text-primary/20" />

              <blockquote className="mt-6 leading-relaxed text-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 border-t border-border/30 pt-10">
          <p className="mb-10 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Sectores que atendemos
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {sectors.map((sector) => (
              <div
                key={sector}
                className="text-lg font-semibold text-muted-foreground/55 transition-colors hover:text-muted-foreground"
              >
                {sector}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
