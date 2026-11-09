"use client";

import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";

import { BrandLogo } from "@/components/brand-logo";
import { useActiveSection } from "@/hooks/use-active-section";
import {
  navigateToSection,
  sectionHref,
  setPredictedStickyOffset,
  SITE_SECTION_IDS,
  SITE_SECTIONS,
  syncNavScrollOffset,
} from "@/lib/site-nav";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);
const quoteSpring = { type: "spring" as const, stiffness: 450, damping: 25 };
const pillSpring = { type: "spring" as const, stiffness: 380, damping: 30 };
const menuSpring = { type: "spring" as const, stiffness: 350, damping: 28 };
const iconSpring = { type: "spring" as const, stiffness: 400, damping: 28, mass: 0.8 };

const quoteClass =
  "items-center justify-center gap-1.5 rounded-full border border-blue-500/40 bg-gradient-to-b from-blue-600 via-blue-600 to-blue-700 font-sans text-sm font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_2px_10px_rgba(37,99,235,0.35)]";

type NavTone = "hero" | "light" | "dark";

function NavLink({
  href,
  label,
  active,
  onClick,
  slidingPill,
  roomy,
  reduceMotion,
  tone,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  slidingPill?: boolean;
  roomy?: boolean;
  reduceMotion?: boolean | null;
  tone: NavTone;
}) {
  const onInk = tone === "hero" || tone === "dark";

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "relative inline-flex items-center whitespace-nowrap font-sans text-sm font-medium transition-colors duration-150",
        roomy ? "min-h-11 w-full rounded-xl px-3.5" : "rounded-full px-2.5 py-1.5 lg:px-3",
        active
          ? onInk
            ? "text-white"
            : "text-[#1d4ed8]"
          : onInk
            ? "text-slate-300 hover:text-white"
            : "text-slate-600 hover:text-slate-950",
      )}
    >
      {active && slidingPill ? (
        <motion.div
          layoutId="navbar-active-pill"
          className={cn(
            "absolute inset-0 rounded-full",
            onInk
              ? "bg-[rgba(37,99,235,0.34)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.24)]"
              : "bg-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_1px_2px_rgba(15,23,42,0.06)]",
          )}
          transition={reduceMotion ? { duration: 0 } : pillSpring}
        />
      ) : null}
      {active && !slidingPill ? (
        <span
          className={cn(
            "absolute inset-0 rounded-xl",
            onInk ? "bg-[rgba(37,99,235,0.28)]" : "bg-[#2563eb]/10",
          )}
        />
      ) : null}
      <span className="relative z-10">{label}</span>
    </Link>
  );
}

function shellTone(tone: NavTone) {
  return cn(
    tone === "hero" &&
      "border-white/[0.1] bg-[#070b16]/72 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_14px_36px_-18px_rgba(7,11,22,0.9)]",
    tone === "dark" &&
      "border-white/[0.08] bg-[#070b16]/82 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_12px_32px_-16px_rgba(0,0,0,0.65)]",
    tone === "light" &&
      "border-black/[0.06] bg-white/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.95),0_10px_28px_-16px_rgba(15,23,42,0.16)]",
  );
}

export function Navbar() {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  /** Sticky cuando el Hero (#inicio) sale por el tope. */
  const [sticky, setSticky] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const onHome = pathname === "/";
  const activeSection = useActiveSection(SITE_SECTION_IDS, onHome);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Floating → Sticky (IO + histéresis, sin umbral de scrollY arbitrario)
  useEffect(() => {
    if (!onHome) {
      setSticky(true);
      return;
    }

    const hero = document.getElementById("inicio");
    if (!hero) {
      setSticky(window.scrollY > 80);
      return;
    }

    const ENTER = -28;
    const EXIT = -6;

    const applySticky = (top: number) => {
      setSticky((prev) => {
        if (prev) return top < EXIT;
        return top < ENTER;
      });
    };

    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    const io = new IntersectionObserver(
      ([entry]) => applySticky(entry.boundingClientRect.top),
      { root: null, threshold: thresholds },
    );

    const onScroll = () => applySticky(hero.getBoundingClientRect().top);

    io.observe(hero);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [onHome]);

  // Altura real del único contenedor → --nav-sticky-offset / --nav-scroll-offset
  useLayoutEffect(() => {
    const measure = () => {
      const header = headerRef.current;
      const bar = barRef.current;
      if (!header || !bar) return;

      const styles = getComputedStyle(header);
      const padTop = Number.parseFloat(styles.paddingTop) || 0;
      const barH = bar.getBoundingClientRect().height;
      const breathing = 24;
      const predicted = padTop + barH + breathing;

      setPredictedStickyOffset(predicted);
      header.dataset.navSticky = sticky ? "true" : "false";
      syncNavScrollOffset();
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (headerRef.current) ro.observe(headerRef.current);
    if (barRef.current) ro.observe(barRef.current);

    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [sticky, menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    window.addEventListener("keydown", onKey);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const isDark = resolvedTheme === "dark";
  const overHero = onHome && !sticky;
  const tone: NavTone = !mounted
    ? "light"
    : isDark
      ? overHero
        ? "hero"
        : "dark"
      : "light";
  const onInk = tone !== "light";
  const logoTone = onInk ? "onDark" : "onLight";
  const themeLabel = mounted && isDark ? "Activar modo claro" : "Activar modo oscuro";
  const closeMenu = () => setMenuOpen(false);
  const iconClass = onInk
    ? "text-slate-300 hover:bg-white/[0.08] hover:text-white"
    : "text-slate-500 hover:bg-slate-950/[0.04] hover:text-slate-950";

  const handleSectionClick =
    (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      closeMenu();
      navigateToSection(id);
    };

  const handleHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    closeMenu();
    navigateToSection("inicio");
  };

  const handleQuoteClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    closeMenu();
    navigateToSection("contacto");
  };

  return (
    <header
      ref={headerRef}
      data-site-header
      data-nav-sticky={sticky ? "true" : "false"}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[padding] duration-300",
        // Sticky: apegado al borde superior (sin aire). Hero: flotante original.
        sticky ? "px-0 pt-0" : "px-3 pt-2.5 sm:px-5 sm:pt-3",
        reduceMotion && "transition-none",
      )}
    >
      {/* Único contenedor: logo + nav + CTA */}
      <div
        ref={barRef}
        className={cn(
          "relative z-50 mx-auto grid items-center gap-2 border px-2 backdrop-blur-xl backdrop-saturate-150 transition-[height,border-radius,box-shadow,background-color,max-width] duration-300 sm:gap-3 sm:px-3",
          sticky
            ? "h-12 max-w-none grid-cols-[minmax(0,1fr)_auto] rounded-none border-x-0 border-t-0 sm:h-[3.25rem] lg:grid-cols-[1fr_auto_1fr] lg:px-6"
            : "h-14 max-w-7xl grid-cols-[minmax(0,1fr)_auto] rounded-full sm:h-[3.4rem] lg:grid-cols-[1fr_auto_1fr]",
          shellTone(tone),
          sticky &&
            "shadow-[0_8px_24px_-12px_rgba(15,23,42,0.22)] dark:shadow-[0_10px_28px_-14px_rgba(0,0,0,0.55)]",
          reduceMotion && "transition-none",
        )}
      >
        <nav className="contents" aria-label="Navegación principal">
          <Link
            href="/#inicio"
            onClick={handleHomeClick}
            aria-label="Ir al inicio de Findtec Soluciones"
            className="flex h-full min-w-0 items-center pl-1.5 sm:pl-2"
          >
            <BrandLogo
              tone={logoTone}
              size="nav"
              subtitle="Empresa tecnológica"
            />
          </Link>

          {/* Desktop: siempre dentro del mismo contenedor (hero y sticky) */}
          <ul
            className={cn(
              "hidden items-center gap-0.5 rounded-full p-1 lg:flex",
              onInk
                ? "bg-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                : "bg-slate-950/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)]",
            )}
          >
            {SITE_SECTIONS.map((link) => (
              <li key={link.id} className="flex items-center">
                <NavLink
                  href={sectionHref(link.id)}
                  label={link.label}
                  active={activeSection === link.id}
                  onClick={handleSectionClick(link.id)}
                  slidingPill
                  reduceMotion={reduceMotion}
                  tone={tone}
                />
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-1 pr-1 sm:gap-1.5">
            <motion.button
              type="button"
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              transition={iconSpring}
              className={cn(
                "hidden h-10 w-10 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/40 sm:inline-flex",
                iconClass,
              )}
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label={themeLabel}
            >
              {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </motion.button>
            <MotionLink
              href="/#contacto"
              onClick={handleQuoteClick}
              initial="rest"
              whileHover={reduceMotion ? undefined : "hover"}
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              variants={{ rest: { scale: 1 }, hover: { scale: 1.02 } }}
              transition={quoteSpring}
              className={cn(
                quoteClass,
                "hidden h-10 px-3.5 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 sm:inline-flex lg:px-4 lg:text-sm",
              )}
            >
              Solicitar cotización
              <motion.span className="inline-flex" variants={{ rest: { x: 0 }, hover: { x: 3 } }} transition={quoteSpring}>
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.span>
            </MotionLink>
            <motion.button
              type="button"
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              transition={iconSpring}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/40 lg:hidden",
                iconClass,
              )}
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <motion.span
                className="inline-flex"
                animate={{ rotate: menuOpen ? 90 : 0 }}
                transition={reduceMotion ? { duration: 0 } : iconSpring}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </motion.button>
          </div>
        </nav>
      </div>

      {/* Panel móvil: solo al abrir el menú (no es una barra permanente) */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.button
            key="nav-scrim"
            type="button"
            aria-label="Cerrar menú"
            className="fixed inset-0 z-40 bg-[#020617]/45 backdrop-blur-[2px] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
            onClick={closeMenu}
          />
        ) : null}
        {menuOpen ? (
          <motion.div
            id="mobile-navigation"
            key="mobile-navigation"
            initial={reduceMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            transition={reduceMotion ? { duration: 0 } : menuSpring}
            style={{ transformOrigin: "top center" }}
            className={cn(
              "absolute inset-x-3 top-[calc(100%+0.5rem)] z-50 max-h-[min(32rem,calc(100svh-7rem))] overflow-y-auto rounded-[1.35rem] border p-3.5 pb-[max(0.875rem,env(safe-area-inset-bottom))] backdrop-blur-xl backdrop-saturate-150 sm:inset-x-5 lg:hidden",
              tone === "hero" &&
                "border-white/[0.08] bg-[#070b16]/95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_24px_48px_-20px_rgba(0,0,0,0.65)]",
              tone === "dark" &&
                "border-white/[0.08] bg-[#070b16]/95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_24px_48px_-20px_rgba(0,0,0,0.55)]",
              tone === "light" &&
                "border-black/[0.06] bg-[#f8fafc]/95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_24px_48px_-20px_rgba(15,23,42,0.28)]",
            )}
          >
            <nav className="flex flex-col gap-1" aria-label="Menú móvil">
              {SITE_SECTIONS.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 30, delay: 0.04 * index }
                  }
                >
                  <NavLink
                    href={sectionHref(link.id)}
                    label={link.label}
                    active={activeSection === link.id}
                    onClick={handleSectionClick(link.id)}
                    roomy
                    reduceMotion={reduceMotion}
                    tone={tone}
                  />
                </motion.div>
              ))}
            </nav>
            <div
              className={cn(
                "mt-3 grid gap-2 border-t pt-3",
                onInk ? "border-white/[0.08]" : "border-black/[0.06]",
              )}
            >
              <motion.button
                type="button"
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                transition={iconSpring}
                className={cn(
                  "flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-medium sm:hidden",
                  onInk ? "text-slate-300" : "text-slate-600",
                )}
                onClick={() => setTheme(isDark ? "light" : "dark")}
              >
                {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {mounted && isDark ? "Modo claro" : "Modo oscuro"}
              </motion.button>
              <MotionLink
                href="/#contacto"
                onClick={handleQuoteClick}
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                transition={quoteSpring}
                className={cn(quoteClass, "inline-flex min-h-11 w-full px-4 sm:hidden")}
              >
                Solicitar cotización
                <ArrowRight className="h-4 w-4" />
              </MotionLink>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
