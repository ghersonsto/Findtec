"use client";

import { useEffect, useState } from "react";

export type DesignMotion = {
  heroFrameMs: number;
  parallax: { maxX: number; maxY: number; maxRotate: number };
  popZ: { logo: number; panel: number; card: number };
  tilt: { intensity: number; pop: number };
  reduceMotionSafe: boolean;
};

export type DesignScene3d = {
  enabled: boolean;
  depth: number;
  orbs: { id: string; color: string; size: number; x: number; y: number; z: number }[];
  planes: { id: string; rotateX: number; rotateY: number; opacity: number }[];
};

export type DesignPayload = {
  ok: boolean;
  brand: {
    name: string;
    mark: string;
    primary: string;
    accent: string;
    deep: string;
    cyan: string;
    ink: string;
  };
  motion: DesignMotion;
  scene3d: DesignScene3d;
};

const fallback: DesignPayload = {
  ok: true,
  brand: {
    name: "Findtec Soluciones",
    mark: "/icon.svg",
    primary: "#2563eb",
    accent: "#3b82f6",
    deep: "#1e3a8a",
    cyan: "#38bdf8",
    ink: "#05080f",
  },
  motion: {
    heroFrameMs: 6000,
    parallax: { maxX: 18, maxY: 12, maxRotate: 8 },
    popZ: { logo: 56, panel: 36, card: 28 },
    tilt: { intensity: 12, pop: 28 },
    reduceMotionSafe: true,
  },
  scene3d: {
    enabled: true,
    depth: 900,
    orbs: [
      { id: "primary", color: "rgba(37,99,235,0.35)", size: 280, x: 72, y: 28, z: 40 },
      { id: "cyan", color: "rgba(56,189,248,0.18)", size: 180, x: 82, y: 62, z: -20 },
      { id: "deep", color: "rgba(30,58,138,0.22)", size: 220, x: 18, y: 70, z: 10 },
    ],
    planes: [
      { id: "a", rotateX: 62, rotateY: -18, opacity: 0.08 },
      { id: "b", rotateX: 58, rotateY: 22, opacity: 0.06 },
    ],
  },
};

export function useDesign() {
  const [design, setDesign] = useState<DesignPayload>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const load = () => {
      fetch("/api/design")
        .then((response) => response.json())
        .then((data) => {
          if (!active || !data?.ok) return;
          setDesign({
            ok: true,
            brand: { ...fallback.brand, ...data.brand },
            motion: {
              ...fallback.motion,
              ...data.motion,
              parallax: { ...fallback.motion.parallax, ...data.motion?.parallax },
              popZ: { ...fallback.motion.popZ, ...data.motion?.popZ },
              tilt: { ...fallback.motion.tilt, ...data.motion?.tilt },
            },
            scene3d: {
              ...fallback.scene3d,
              ...data.scene3d,
              orbs: Array.isArray(data.scene3d?.orbs) ? data.scene3d.orbs : fallback.scene3d.orbs,
              planes: Array.isArray(data.scene3d?.planes)
                ? data.scene3d.planes
                : fallback.scene3d.planes,
            },
          });
        })
        .catch(() => {
          /* keep fallback */
        })
        .finally(() => {
          if (active) setLoaded(true);
        });
    };

    // No competir con el primer paint: tokens locales primero, API en idle
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(load, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(load, 800);
    }

    return () => {
      active = false;
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return { design, loaded };
}
