import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ServicesSection } from "@/components/sections/services-section";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata: Metadata = {
  title: "Servicios Tecnológicos & Software a Medida",
  description:
    "Catálogo integral de soluciones: ERP web a medida, integraciones con IA, cloud corporativo, redes y contrataciones con el Estado en Perú.",
};

export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageHeader
        kicker="Catálogo especializado"
        title="Ingeniería y servicios tecnológicos corporativos"
        highlight="tecnológicos corporativos"
        description="Software a medida, inteligencia artificial, cloud y soporte técnico para continuidad y control en tu operación."
      />
      <ServicesSection compact />
      <CtaSection />
    </main>
  );
}
