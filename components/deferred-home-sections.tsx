"use client";

import { LazySection } from "@/components/lazy-section";

export function DeferredHomeSections() {
  return (
    <>
      <LazySection
        loader={() => import("@/components/sections/home-services")}
        exportName="HomeServices"
        skeletonClassName="min-h-[28rem]"
      />
      <LazySection
        loader={() => import("@/components/sections/projects-carousel")}
        exportName="ProjectsCarousel"
        skeletonClassName="min-h-[32rem]"
      />
      <LazySection
        loader={() => import("@/components/sections/why-us-section")}
        exportName="WhyUsSection"
        skeletonClassName="min-h-[24rem]"
      />
      <LazySection
        loader={() => import("@/components/sections/trust-section")}
        exportName="TrustSection"
        skeletonClassName="min-h-[24rem]"
      />
      <LazySection
        loader={() => import("@/components/sections/cta-section")}
        exportName="CtaSection"
        skeletonClassName="min-h-[28rem]"
      />
    </>
  );
}
