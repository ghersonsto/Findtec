import { AlertTriangle, CheckCircle2 } from "lucide-react";

const weakProviderSignals = [
  "Cotiza sin entender el problema.",
  "No define alcance ni entregables.",
  "No documenta configuraciones ni accesos.",
  "Desaparece después de entregar.",
];

const findtecSignals = [
  "Primero levanta necesidad y prioridad.",
  "Propone opciones con alcance claro.",
  "Documenta y deja evidencia técnica.",
  "Acompaña la operación posterior.",
];

export function DecisionSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Cómo decidir mejor
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            La diferencia está en el orden, no solo en el precio
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Un servicio tecnológico confiable debe reducir incertidumbre. Por eso mostramos
            cómo trabajamos antes de pedirte una decisión.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-lg border border-red-400/20 bg-red-500/5 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Lo que genera desconfianza</h3>
            </div>
            <ul className="mt-6 space-y-3">
              {weakProviderSignals.map((signal) => (
                <li key={signal} className="flex gap-3 text-sm text-muted-foreground">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  {signal}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-lg border border-emerald-400/25 bg-emerald-500/10 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Cómo responde FindTec</h3>
            </div>
            <ul className="mt-6 space-y-3">
              {findtecSignals.map((signal) => (
                <li key={signal} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {signal}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
