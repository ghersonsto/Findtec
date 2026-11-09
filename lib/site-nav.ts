/** One-page landing navigation — secciones del home. */

export const SITE_SECTIONS = [
  { id: "servicios", label: "Servicios" },
  { id: "proyectos", label: "Proyectos" },
  { id: "nosotros", label: "Nosotros" },
  { id: "procesos", label: "Procesos" },
  { id: "contacto", label: "Contacto" },
] as const;

/** Navbar + Inicio (footer / menús extendidos). */
export const SITE_NAV_LINKS = [
  { id: "inicio", label: "Inicio" },
  ...SITE_SECTIONS,
] as const;

/** Misma oferta que #servicios en la landing. */
export const SITE_SERVICE_LINKS = [
  { id: "servicios", label: "Sitios web corporativos" },
  { id: "servicios", label: "Tiendas online" },
  { id: "servicios", label: "Aplicaciones web a medida" },
  { id: "servicios", label: "Integraciones con IA" },
  { id: "servicios", label: "Cloud y seguridad TI" },
  { id: "servicios", label: "Mantenimiento y soporte" },
] as const;

export type SiteSectionId = (typeof SITE_SECTIONS)[number]["id"];

export const SITE_SECTION_IDS = SITE_SECTIONS.map((s) => s.id);

/** Espacio visual entre el Navbar y el encabezado (scroll top-align). */
const NAV_BREATHING_ROOM_PX = 24;

/** Fallback cuando el Navbar aún no se midió. */
const NAV_OFFSET_FALLBACK_PX = 88;

/** Margen mínimo al encuadrar un módulo que cabe entero en viewport. */
const FIT_EDGE_GAP_PX = 16;

export function sectionHref(id: string) {
  return `/#${id}`;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readCssPx(name: string): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return 0;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Offset de scroll según la altura real del único Navbar sticky.
 * Usa el máximo entre medición y predicción para evitar underscroll.
 */
export function getNavScrollOffset(): number {
  if (typeof window === "undefined") return NAV_OFFSET_FALLBACK_PX;

  const header = document.querySelector<HTMLElement>("[data-site-header]");
  const predicted = readCssPx("--nav-sticky-offset");
  let measured = 0;

  if (header) {
    const bottom = header.getBoundingClientRect().bottom;
    if (bottom > 0) measured = Math.ceil(bottom + NAV_BREATHING_ROOM_PX);
  }

  if (measured > 0 && predicted > 0) {
    return Math.max(measured, Math.ceil(predicted));
  }
  if (predicted > 0) return Math.ceil(predicted);
  if (measured > 0) return measured;
  return NAV_OFFSET_FALLBACK_PX;
}

export function syncNavScrollOffset(): number {
  const offset = getNavScrollOffset();
  document.documentElement.style.setProperty("--nav-scroll-offset", `${offset}px`);
  return offset;
}

/** Publica la altura predicha del Navbar sticky (scroll desde el Hero). */
export function setPredictedStickyOffset(px: number) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(
    "--nav-sticky-offset",
    `${Math.ceil(px)}px`,
  );
}

/**
 * Calcula el Y de scroll para mostrar el módulo completo bajo el Navbar.
 * Si la sección cabe → la encuadra entera.
 * Si no, intenta encabezado + bloque `[data-nav-focus]` (tarjetas/carrusel).
 * Si tampoco cabe → alinea el tope bajo el Navbar.
 */
export function getSectionScrollTop(el: HTMLElement): number {
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  const navBottom = header?.getBoundingClientRect().bottom ?? 64;
  const avail = Math.max(120, window.innerHeight - navBottom);
  const rect = el.getBoundingClientRect();
  const absoluteTop = rect.top + window.scrollY;
  const sectionH = rect.height;
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );

  const focus = el.querySelector<HTMLElement>("[data-nav-focus]");
  const focusHeader = el.querySelector<HTMLElement>("[data-nav-focus-header]");

  let moduleTopAbs = absoluteTop;
  let moduleH = sectionH;
  if (focus) {
    const focusBottom = focus.getBoundingClientRect().bottom + window.scrollY;
    const sibling = focus.nextElementSibling as HTMLElement | null;
    const isCarouselControls = Boolean(
      sibling?.querySelector('[aria-label="Anterior"], [role="tablist"]'),
    );
    const moduleBottom =
      sibling && isCarouselControls
        ? Math.max(
            focusBottom,
            sibling.getBoundingClientRect().bottom + window.scrollY,
          )
        : focusBottom;
    moduleTopAbs = focusHeader
      ? focusHeader.getBoundingClientRect().top + window.scrollY
      : absoluteTop;
    moduleH = moduleBottom - moduleTopAbs;
  }

  let top: number;
  const topAlign = () => {
    const offset = Math.max(
      Math.ceil(navBottom + NAV_BREATHING_ROOM_PX),
      syncNavScrollOffset(),
    );
    return absoluteTop - offset;
  };

  if (sectionH + FIT_EDGE_GAP_PX <= avail) {
    const spare = avail - sectionH;
    const topGap = Math.min(40, Math.max(FIT_EDGE_GAP_PX, Math.round(spare * 0.28)));
    top = absoluteTop - navBottom - topGap;
  } else if (moduleH + FIT_EDGE_GAP_PX <= avail) {
    // Encuadrar título + tarjetas/carrusel (sin exigir el padding inferior de la sección)
    const spare = avail - moduleH;
    const topGap = Math.min(28, Math.max(10, Math.round(spare * 0.22)));
    top = moduleTopAbs - navBottom - topGap;
  } else {
    top = topAlign();
  }

  return Math.max(0, Math.min(maxScroll, Math.round(top)));
}

/** Scroll con encuadre inteligente del módulo bajo el Navbar. */
export function scrollElementWithNavOffset(
  el: HTMLElement,
  behavior?: ScrollBehavior,
) {
  syncNavScrollOffset();
  const top = getSectionScrollTop(el);
  const resolved: ScrollBehavior =
    behavior ?? (prefersReducedMotion() ? "auto" : "smooth");

  if (resolved === "auto") {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, top);
    document.documentElement.style.scrollBehavior = prev;
    return;
  }

  window.scrollTo({ top, behavior: "smooth" });
}

/** Scroll a una sección del home; actualiza el hash. */
export function scrollToSection(
  id: string,
  options?: { behavior?: ScrollBehavior; updateHash?: boolean },
) {
  if (typeof window === "undefined") return false;

  const behavior: ScrollBehavior =
    options?.behavior ?? (prefersReducedMotion() ? "auto" : "smooth");
  const updateHash = options?.updateHash !== false;

  if (id === "inicio") {
    window.scrollTo({ top: 0, behavior });
    if (updateHash && window.location.hash) {
      window.history.pushState(null, "", window.location.pathname + window.location.search);
    }
    return true;
  }

  const el = document.getElementById(id);
  if (!el) return false;

  scrollElementWithNavOffset(el, behavior);

  let refined = false;
  const refine = () => {
    if (refined) return;
    refined = true;
    syncNavScrollOffset();
    const target = getSectionScrollTop(el);
    const delta = target - window.scrollY;
    if (Math.abs(delta) > 4) {
      window.scrollBy({ top: delta, behavior: "auto" });
    }
  };

  if (behavior === "smooth") {
    window.addEventListener("scrollend", refine, { once: true });
    window.setTimeout(refine, 750);
  } else {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.setTimeout(refine, 50);
      });
    });
  }

  if (updateHash) {
    const current = window.location.hash.replace(/^#/, "");
    const [currentId, query = ""] = current.split("?");
    const nextHash =
      currentId === id && query ? `#${id}?${query}` : `#${id}`;

    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
  }
  return true;
}

/**
 * Navega a una sección del landing.
 * Si ya estamos en `/`, hace scroll; si no, va a `/#id`.
 */
export function navigateToSection(id: string) {
  if (typeof window === "undefined") return;

  if (window.location.pathname === "/") {
    scrollToSection(id);
    return;
  }

  window.location.assign(sectionHref(id));
}
