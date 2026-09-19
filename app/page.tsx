import { Navbar } from "@/components/navbar";
import { SmartChatbot } from "@/components/smart-chatbot";
import { AboutSection } from "@/components/sections/about-section";
import { B2GSection } from "@/components/sections/b2g-section";
import { ClientsSection } from "@/components/sections/clients-section";
import { ContactSection } from "@/components/sections/contact-section";
import { DecisionSection } from "@/components/sections/decision-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { Footer } from "@/components/sections/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { TrustSection } from "@/components/sections/trust-section";
import { company } from "@/lib/company";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: company.name,
  legalName: company.legalName,
  url: company.siteUrl,
  image: `${company.siteUrl}/images/hero-tech.jpg`,
  description: company.description,
  email: company.email,
  telephone: company.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Miramar Lte. 1 URB 15058",
    addressLocality: "Lima",
    addressCountry: "PE",
  },
  areaServed: ["Perú", "Lima"],
  priceRange: "$$",
  makesOffer: [
    "Hardware empresarial",
    "Soporte técnico",
    "Microsoft 365",
    "Redes e infraestructura",
    "Desarrollo web",
    "Análisis de datos",
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main>
        <HeroSection />
        <ClientsSection />
        <TrustSection />
        <ServicesSection />
        <ProcessSection />
        <AboutSection />
        <FeaturesSection />
        <B2GSection />
        <DecisionSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <SmartChatbot />
    </div>
  );
}
