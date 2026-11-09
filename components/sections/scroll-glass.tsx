"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ScrollGlass({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 94%", once: true } })
        .from(content.current, { y: 14, opacity: 0.65, duration: 0.5, ease: "power2.out", clearProps: "transform,opacity" })
        .fromTo(sheen.current, { opacity: 0.85 }, { opacity: 0, duration: 0.65, ease: "power1.out" }, 0);
    });

    return () => media.revert();
  }, { scope: root });

  return (
    <div ref={root} className="relative isolate bg-card/50 backdrop-blur-sm">
      <div ref={content}>{children}</div>
      <div
        ref={sheen}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-10 border-t border-blue-400/20 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0"
      />
    </div>
  );
}
