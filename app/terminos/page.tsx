import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal-document";
import { company } from "@/lib/company";
import { termsSections } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: `Términos y condiciones de uso del sitio y servicios de ${company.name}.`,
};

export default function TerminosPage() {
  return (
    <LegalDocument
      title="Términos y Condiciones"
      eyebrow="Documento legal"
      description={`Condiciones que rigen el uso del sitio web y la contratación de servicios tecnológicos de ${company.name}.`}
      sections={termsSections}
      sibling={{ href: "/privacidad", label: "Ver política de privacidad" }}
    />
  );
}
