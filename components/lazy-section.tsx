"use client";

import {
  useCallback,
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
  /** ID de ancla del navbar — disponible en el host hasta que monta la sección real. */
  sectionId: string;
  skeletonClassName?: string;
  rootMargin?: string;
};

/**
 * Carga diferida por viewport, pero responde a `findtec-ensure-section`
 * para que el navbar pueda forzar el montaje y hacer scroll al ID correcto.
 */
export function LazySection({
  loader,
  exportName,
  sectionId,
  skeletonClassName,
  rootMargin = "320px 0px",
}: LazySectionProps) {
  const host = useRef<HTMLDivElement>(null);
  const [node, setNode] = useState<ReactNode>(null);
  const loadingRef = useRef(false);
  const loadedRef = useRef(false);

  const load = useCallback(async () => {
    if (loadingRef.current || loadedRef.current) return;
    loadingRef.current = true;
    try {
      const mod = await loader();
      const Comp = mod[exportName] as ComponentType | undefined;
      if (!Comp) return;
      loadedRef.current = true;
      setNode(<Comp />);
    } catch {
      loadingRef.current = false;
    }
  }, [loader, exportName, sectionId]);

  useEffect(() => {
    if (!node) return;
    window.dispatchEvent(
      new CustomEvent("findtec-section-ready", { detail: { id: sectionId } }),
    );
  }, [node, sectionId]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let idleId: number | undefined;

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

    const onEnsure = (event: Event) => {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id;
      if (id !== sectionId) return;
      io.disconnect();
      void load();
    };
    window.addEventListener("findtec-ensure-section", onEnsure);

    return () => {
      io.disconnect();
      window.removeEventListener("findtec-ensure-section", onEnsure);
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [load, rootMargin, sectionId]);

  return (
    <div ref={host} data-nav-section={sectionId}>
      {node ?? <SectionSkeleton className={skeletonClassName} />}
    </div>
  );
}
