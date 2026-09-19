import { ArrowRight, Building2, Users } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[color:var(--accent-blue)] p-8 sm:p-12 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-[250px] w-[250px] rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              ¿Necesitas equipos tecnológicos o una solución TI para tu
              organización?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-primary-foreground/90">
              Te ayudamos a encontrar, implementar y mantener la solución
              tecnológica que tu empresa o institución necesita.
            </p>

            <div className="mt-10">
              <a
                href="#contacto"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-10 text-base font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
              >
                Solicitar cotización
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>

            <p className="mt-8 text-sm text-primary-foreground/80">
              Atención a empresas privadas, instituciones públicas y
              organizaciones que buscan soluciones tecnológicas confiables.
            </p>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Building2 className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Empresas privadas
                </span>
              </div>
              <div className="h-4 w-px bg-primary-foreground/30" />
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Instituciones públicas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
