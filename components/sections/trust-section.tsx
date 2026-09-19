import { BadgeCheck, ClipboardCheck, FileCheck2, Headphones, ShieldCheck, TimerReset } from "lucide-react";

const trustItems = [
  {
    icon: ClipboardCheck,
    title: "Diagnóstico claro",
    description:
      "Antes de vender, levantamos necesidad, prioridad, cantidad, usuarios, plazos y restricciones técnicas.",
  },
  {
    icon: FileCheck2,
    title: "Propuesta documentada",
    description:
      "Recibes alcance, entregables, tiempos, condiciones y recomendaciones para tomar una decisión informada.",
  },
  {
    icon: ShieldCheck,
    title: "Implementación segura",
    description:
      "Cuidamos accesos, respaldos, continuidad, configuración y evidencia técnica de lo realizado.",
  },
  {
    icon: Headphones,
    title: "Soporte posterior",
    description:
      "No desaparecemos después de entregar. Te acompañamos con seguimiento, soporte y mejora continua.",
  },
];

const proofPoints = [
  { icon: BadgeCheck, label: "RNP vigente" },
  { icon: TimerReset, label: "Respuesta ágil" },
  { icon: FileCheck2, label: "Entregables verificables" },
  { icon: ShieldCheck, label: "Buenas prácticas TI" },
];

export function TrustSection() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-card/30 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              Confianza antes de contratar
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tecnología con orden, evidencia y acompañamiento real
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Un buen proveedor no solo entrega equipos o configura servicios. Te ayuda a decidir,
              documenta lo que hace y deja tu operación más clara que antes.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {proofPoints.map((point) => (
                <div
                  key={point.label}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-3 text-sm font-semibold text-foreground"
                >
                  <point.icon className="h-4 w-4 text-primary" />
                  {point.label}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {trustItems.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-border/70 bg-background/80 p-5 transition hover:border-primary/35 hover:bg-card"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
