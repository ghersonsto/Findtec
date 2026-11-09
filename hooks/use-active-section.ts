"use client";

import { useEffect, useState } from "react";

/**
 * Marca la sección visible con IntersectionObserver.
 * La banda de detección se ancla bajo `--nav-scroll-offset` (stack sticky).
 */
export function useActiveSection(sectionIds: readonly string[], enabled: boolean) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) {
      setActiveId(null);
      return;
    }

    const ratios = new Map<string, number>();
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const navTop = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--nav-scroll-offset")
        .trim();
      const n = Number.parseFloat(raw);
      return Number.isFinite(n) && n > 0 ? n : 120;
    };

    const pickActive = () => {
      if (window.scrollY < 120) {
        setActiveId(null);
        return;
      }

      let best: string | null = null;
      let bestRatio = 0;
      for (const id of sectionIds) {
        const ratio = ratios.get(id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = id;
        }
      }
      setActiveId(bestRatio > 0 ? best : null);
    };

    let io: IntersectionObserver | null = null;

    const observe = () => {
      io?.disconnect();
      const top = Math.round(navTop());
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
          }
          pickActive();
        },
        {
          root: null,
          // Zona útil bajo el stack de navegación
          rootMargin: `-${top}px 0px -45% 0px`,
          threshold: [0, 0.12, 0.28, 0.45, 0.65, 1],
        },
      );
      for (const el of elements) io.observe(el);
    };

    observe();

    const onScroll = () => {
      if (window.scrollY < 120) setActiveId(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", observe, { passive: true });

    pickActive();

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", observe);
    };
  }, [enabled, sectionIds]);

  return activeId;
}
