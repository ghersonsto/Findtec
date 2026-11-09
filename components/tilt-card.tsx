"use client";

import { useRef, type ReactNode, type MouseEvent, type CSSProperties } from "react";

import { useDesign } from "@/hooks/use-design";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
  /** Empuje hacia el usuario (efecto salir de pantalla) */
  pop?: number;
  glare?: boolean;
};

export function TiltCard({
  children,
  className,
  intensity,
  pop,
  glare = true,
}: TiltCardProps) {
  const { design } = useDesign();
  const tiltIntensity = intensity ?? design.motion.tilt.intensity;
  const tiltPop = pop ?? design.motion.tilt.pop;
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * tiltIntensity;
    const rotateX = (0.5 - y) * tiltIntensity;
    node.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${tiltPop}px) scale3d(1.02, 1.02, 1.02)`;
    if (glareRef.current) {
      glareRef.current.style.opacity = "1";
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.28), transparent 55%)`;
    }
  };

  const handleLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.transform =
      "perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0) scale3d(1, 1, 1)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("tilt-3d relative will-change-transform", className)}
      style={{ transformStyle: "preserve-3d" } as CSSProperties}
    >
      {children}
      {glare ? (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
