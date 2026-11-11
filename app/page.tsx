import type { Metadata } from "next";

import { DeferredHomeSections } from "@/components/deferred-home-sections";
import { ClientsSection } from "@/components/sections/clients-section";
import { HeroSection } from "@/components/sections/hero-section";
import { company, serviceOptions } from "@/lib/company";

export const metadata: Metadata = {
  title: { absolute: "Findtec Soluciones" },
  description: company.description,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: company.name,
  legalName: company.legalName,
  taxID: company.ruc,
  url: company.siteUrl,
  image: new URL(company.logo.dark, company.siteUrl).href,
  logo: new URL(company.logo.dark, company.siteUrl).href,
  description: company.description,
  email: company.email,
  telephone: company.phone,
  address: company.address,
  makesOffer: serviceOptions
    .filter(({ value }) => value !== "otro")
    .map(({ label }) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: label },
    })),
};

export default function Home() {
  return (
    <main className="bg-transparent text-foreground selection:bg-primary/25 selection:text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <HeroSection />
      <div className="post-hero-surface">
        <ClientsSection />
        <DeferredHomeSections />
      </div>
    </main>
  );
}
