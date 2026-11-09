import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { B2GSection } from "@/components/sections/b2g-section";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata: Metadata = {
  title: "Contrataciones con el Estado | Registro RNP",
  description:
    "Atención a entidades del Estado con documentación para contratación pública y Registro Nacional de Proveedores.",
};

export default function SectorPublicoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageHeader
        kicker="Contrataciones estatales"
        title="Soluciones tecnológicas para el sector público"
        highlight="sector público"
        description="Proveedor con RNP activo para infraestructura digital, software y requerimientos gubernamentales."
      />
      <B2GSection compact />
      <CtaSection />
    </main>
  );
}
