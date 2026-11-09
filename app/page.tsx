import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { HeroSection } from "@/components/sections/hero-section";
import { ClientsSection } from "@/components/sections/clients-section";
import { company, serviceOptions } from "@/lib/company";

/** Secciones bajo el fold: no bloquean el primer paint del Hero. */
const HomeServices = dynamic(
  () => import("@/components/sections/home-services").then((m) => m.HomeServices),
  { loading: () => <SectionSkeleton className="min-h-[28rem]" /> },
);
const ProjectsCarousel = dynamic(
  () =>
    import("@/components/sections/projects-carousel").then((m) => m.ProjectsCarousel),
  { loading: () => <SectionSkeleton className="min-h-[32rem]" /> },
);
const WhyUsSection = dynamic(
  () => import("@/components/sections/why-us-section").then((m) => m.WhyUsSection),
  { loading: () => <SectionSkeleton className="min-h-[24rem]" /> },
);
const TrustSection = dynamic(
  () => import("@/components/sections/trust-section").then((m) => m.TrustSection),
  { loading: () => <SectionSkeleton className="min-h-[24rem]" /> },
);
const CtaSection = dynamic(
  () => import("@/components/sections/cta-section").then((m) => m.CtaSection),
  { loading: () => <SectionSkeleton className="min-h-[28rem]" /> },
);

function SectionSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`w-full animate-pulse bg-transparent ${className ?? ""}`}
      aria-hidden
    />
  );
}

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
        <HomeServices />
        <ProjectsCarousel />
        <WhyUsSection />
        <TrustSection />
        <CtaSection />
      </div>
    </main>
  );
}
