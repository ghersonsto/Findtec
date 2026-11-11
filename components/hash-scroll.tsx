"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  ensureSectionElement,
  prefersReducedMotion,
  scrollToSection,
  syncNavScrollOffset,
} from "@/lib/site-nav";

/**
 * - Entrada / refresh: siempre inicia en el tope (limpia hash residual).
 * - Clics de nav / popstate: scroll correcto a la sección del hash.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    syncNavScrollOffset();

    const onResize = () => syncNavScrollOffset();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;

    syncNavScrollOffset();

    // Entrada o actualización: ir a inicio (sin saltar a un hash guardado)
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const applyHash = (instant = false) => {
      const raw = window.location.hash.replace(/^#/, "");
      if (!raw) {
        window.scrollTo({ top: 0, left: 0, behavior: instant ? "auto" : "smooth" });
        return;
      }
      const id = raw.split("?")[0];
      if (!id) return;

      const run = () => {
        if (!document.getElementById(id)) return;
        scrollToSection(id, {
          behavior: instant || prefersReducedMotion() ? "auto" : "smooth",
          updateHash: false,
        });
      };

      if (document.getElementById(id)) {
        run();
        return;
      }

      void ensureSectionElement(id).then((el) => {
        if (el) run();
      });
    };

    const onHashOrPop = () => applyHash(false);

    window.addEventListener("hashchange", onHashOrPop);
    window.addEventListener("popstate", onHashOrPop);

    return () => {
      window.removeEventListener("hashchange", onHashOrPop);
      window.removeEventListener("popstate", onHashOrPop);
    };
  }, [pathname]);

  return null;
}
