import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { AboutSection } from "@/components/sections/about-section";
import { TrustSection } from "@/components/sections/trust-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";

export const metadata: Metadata = {
  title: "Nosotros | Trayectoria y Respaldo Tecnológico",
  description:
    "Findtec Soluciones, en Lima: implementación controlada, documentación y soporte después de la entrega.",
};

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageHeader
        kicker="Trayectoria y compromiso"
        title="Innovación tecnológica con respaldo operativo"
        highlight="respaldo operativo"
        description="Estructura, metodología y estándares técnicos que respaldan cada implementación de Findtec."
      />
      <AboutSection compact />
      <TrustSection />
      <TestimonialsSection />
    </main>
  );
}
