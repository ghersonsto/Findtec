"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

function SectionSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`w-full animate-pulse bg-transparent ${className ?? ""}`}
      aria-hidden
    />
  );
}

type LazySectionProps = {
  loader: () => Promise<Record<string, unknown>>;
  exportName: string;
  skeletonClassName?: string;
  rootMargin?: string;
};

/**
 * Carga el chunk de una sección solo al acercarse al viewport.
 * Evita descargar GSAP/carrusel/Motion de secciones inferiores en el primer paint.
 */
export function LazySection({
  loader,
  exportName,
  skeletonClassName,
  rootMargin = "320px 0px",
}: LazySectionProps) {
  const host = useRef<HTMLDivElement>(null);
  const [node, setNode] = useState<ReactNode>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let cancelled = false;
    let idleId: number | undefined;

    const load = async () => {
      try {
        const mod = await loader();
        if (cancelled) return;
        const Comp = mod[exportName] as ComponentType | undefined;
        if (Comp) setNode(<Comp />);
      } catch {
        /* skeleton permanece */
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (typeof window.requestIdleCallback === "function") {
          idleId = window.requestIdleCallback(() => {
            void load();
          }, { timeout: 1200 });
        } else {
          void load();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [loader, exportName, rootMargin]);

  return (
    <div ref={host}>
      {node ?? <SectionSkeleton className={skeletonClassName} />}
    </div>
  );
}
