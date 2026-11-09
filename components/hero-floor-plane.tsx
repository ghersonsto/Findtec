"use client";

import { useReducedMotion } from "motion/react";

/**
 * Fondo 3D del hero — suelo digital visible, detrás del contenido.
 */
export function HeroFloorPlane() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="hero-floor-root pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[64%] overflow-hidden lg:h-[68%]" aria-hidden>
      <div className="hero-floor-spotlight" />
      <div className="hero-floor-horizon" />

      <div className="hero-floor-stage">
        <div className={`hero-floor-plane ${reduceMotion ? "" : "hero-floor-plane--live"}`}>
          <div className="hero-floor-grid hero-floor-grid--major" />
          <div className="hero-floor-grid hero-floor-grid--minor" />
        </div>
      </div>

      <div className="hero-floor-fade" />
    </div>
  );
}
