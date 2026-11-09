import { ServiceGrid } from "@/components/sections/service-grid";

const solutionIds = ["software-gestion", "ia", "cloud", "b2g"] as const;

export function SoftwareShowcase() {
  return (
    <section id="ecosistema" aria-labelledby="ecosistema-title" className="bg-background py-12 sm:py-16">
      <div className="container-pro">
        <h2 id="ecosistema-title" className="font-display text-2xl font-bold sm:text-3xl">Soluciones</h2>
        <ServiceGrid ids={solutionIds} />
      </div>
    </section>
  );
}
