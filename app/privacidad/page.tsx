import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal-document";
import { company } from "@/lib/company";
import { privacySections } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: `Política de privacidad y tratamiento de datos personales de ${company.name}.`,
};

export default function PrivacidadPage() {
  return (
    <LegalDocument
      title="Política de Privacidad"
      eyebrow="Protección de datos"
      description={`Cómo ${company.name} recopila, usa y protege la información personal que nos compartes a través del sitio y canales de contacto.`}
      sections={privacySections}
      sibling={{ href: "/terminos", label: "Ver términos y condiciones" }}
    />
  );
}
