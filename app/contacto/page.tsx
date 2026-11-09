import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = {
  title: "Contacto y Cotizaciones B2B",
  description:
    "Solicita una cotización de software, IA o infraestructura TI. Puedes llegar con el servicio ya indicado en la URL.",
};

type ContactoPageProps = {
  searchParams: Promise<{ servicio?: string; mensaje?: string }>;
};

export default async function ContactoPage({ searchParams }: ContactoPageProps) {
  const params = await searchParams;
  const servicio = params.servicio?.trim() || undefined;
  const mensaje = params.mensaje?.trim() || undefined;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageHeader
        kicker="Contacto y cotización"
        title="Cotización técnica para tu empresa"
        highlight="tu empresa"
        description="Indica el servicio, el alcance y un contacto. Te respondemos con una propuesta técnica y económica estructurada."
      />
      <ContactSection compact initialServicio={servicio} initialMensaje={mensaje} />
    </main>
  );
}
