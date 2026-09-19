import { Target, Users, Lightbulb } from "lucide-react";

export function PresentationSection() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tecnología, soporte y soluciones para el crecimiento de tu
            organización
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            En un entorno cada vez más digital, las empresas necesitan aliados
            tecnológicos capaces de responder con eficiencia, seguridad y visión
            estratégica. En FindTec Soluciones, integramos experiencia técnica,
            conocimiento en plataformas Microsoft, infraestructura tecnológica,
            desarrollo web y análisis de datos para ofrecer soluciones completas
            y confiables.
          </p>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Trabajamos con empresas privadas y entidades del Estado, brindando
            atención profesional, cumplimiento y soporte orientado a resultados.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Target className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Enfoque Estratégico
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Soluciones adaptadas a las necesidades reales de cada cliente
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-blue/10">
              <Users className="h-7 w-7 text-accent-blue" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Atención Profesional
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Equipo especializado en empresas privadas y sector público
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Lightbulb className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Visión Innovadora
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tecnología moderna para optimizar tus operaciones
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
