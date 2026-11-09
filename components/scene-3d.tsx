"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useDesign } from "@/hooks/use-design";
import { cn } from "@/lib/utils";

type Scene3DProps = {
  className?: string;
  intensity?: number;
};

export function Scene3D({ className, intensity = 1 }: Scene3DProps) {
  const { design } = useDesign();
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduceMotion || !design.scene3d.enabled) return;

    const onMove = (event: PointerEvent) => {
      const node = rootRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      setOffset({ x, y });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [design.scene3d.enabled, reduceMotion]);

  if (!design.scene3d.enabled) return null;

  const { maxX, maxY, maxRotate } = design.motion.parallax;
  const rotateY = reduceMotion ? 0 : offset.x * maxRotate * intensity;
  const rotateX = reduceMotion ? 0 : -offset.y * maxRotate * intensity;
  const shiftX = reduceMotion ? 0 : offset.x * maxX * intensity;
  const shiftY = reduceMotion ? 0 : offset.y * maxY * intensity;

  return (
    <div
      ref={rootRef}
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      aria-hidden
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          perspective: `${design.scene3d.depth}px`,
          perspectiveOrigin: "50% 40%",
        }}
      >
        <div
          className="relative h-full w-full transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{
            transformStyle: "preserve-3d",
            transform: `translate3d(${shiftX}px, ${shiftY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
        >
          {design.scene3d.planes.map((plane) => (
            <div
              key={plane.id}
              className="absolute left-1/2 top-1/2 h-[55%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-blue-500/15 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-400/5"
              style={{
                opacity: plane.opacity,
                transform: `translateZ(-80px) rotateX(${plane.rotateX}deg) rotateY(${plane.rotateY}deg)`,
              }}
            />
          ))}

          {design.scene3d.orbs.map((orb) => (
            <div
              key={orb.id}
              className="absolute rounded-full blur-3xl"
              style={{
                width: orb.size,
                height: orb.size,
                left: `${orb.x}%`,
                top: `${orb.y}%`,
                background: orb.color,
                transform: `translate3d(-50%, -50%, ${orb.z}px)`,
              }}
            />
          ))}

          <div
            className="absolute left-[58%] top-[38%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] backdrop-blur-[2px] dark:bg-white/[0.04]"
            style={{ transform: "translate3d(-50%, -50%, 60px) rotateX(18deg) rotateY(-24deg)" }}
          />
          <div
            className="absolute left-[64%] top-[48%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-blue-400/20 bg-blue-500/10"
            style={{ transform: "translate3d(-50%, -50%, 110px) rotateX(12deg) rotateY(28deg)" }}
          />
        </div>
      </div>
    </div>
  );
}
