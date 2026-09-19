"use client";

import { ArrowRight, Menu, MessageCircle, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

import Link from "next/link";
import { useTheme } from "next-themes";

const navLinks = [
  { href: "#inicio", label: "Inicio", id: "inicio" },
  { href: "#servicios", label: "Servicios", id: "servicios" },
  { href: "#nosotros", label: "Nosotros", id: "nosotros" },
  { href: "#experiencia-b2g", label: "B2G", id: "experiencia-b2g" },
  { href: "#testimonios", label: "Clientes", id: "testimonios" },
  { href: "#contacto", label: "Contacto", id: "contacto" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-30% 0px -58% 0px",
        threshold: [0.15, 0.35, 0.55],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const isDark = resolvedTheme === "dark";
  const themeLabel = mounted && isDark ? "Activar modo claro" : "Activar modo oscuro";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
  };

  const openChatbot = () => {
    window.dispatchEvent(new Event("open-findtec-chatbot"));
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled ? "glass-strong py-2" : "bg-transparent py-4"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8"
        aria-label="Navegación principal"
      >
        <Link href="/" className="group relative" aria-label="Ir al inicio de FindTec">
          <span className="flex flex-col leading-none">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-foreground">FIND</span>
              <span className="text-primary">TEC</span>
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Soluciones
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <ul className="flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => handleNavClick(link.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/60 hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground/70 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
          >
            {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={openChatbot}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 text-sm font-semibold text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white dark:text-emerald-300"
          >
            <MessageCircle className="h-4 w-4" />
            En línea
          </button>
          <a
            href="#contacto"
            onClick={() => handleNavClick("contacto")}
            className="btn-primary group inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white"
          >
            Cotizar
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground/70 transition-all hover:bg-primary/10 hover:text-primary lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-controls="mobile-navigation"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        id="mobile-navigation"
        className={`overflow-hidden transition-all duration-500 lg:hidden ${
          isMobileMenuOpen ? "max-h-[calc(100vh-5rem)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass-strong mx-5 mt-3 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg p-4">
          <button
            type="button"
            className="mb-3 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-card/70 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
            onClick={toggleTheme}
            aria-label={themeLabel}
          >
            {mounted && isDark ? (
              <>
                <Sun className="h-4 w-4" />
                Modo claro
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                Modo oscuro
              </>
            )}
          </button>
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 text-base font-semibold transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-primary/10 hover:text-foreground"
                  }`}
                  onClick={() => handleNavClick(link.id)}
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </a>
              );
            })}
          </div>
          <div className="mt-4 grid gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={openChatbot}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-sm font-semibold text-emerald-600 dark:text-emerald-300"
            >
              <MessageCircle className="h-4 w-4" />
              Estamos en línea
            </button>
            <a
              href="#contacto"
              className="btn-primary flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-white"
              onClick={() => handleNavClick("contacto")}
            >
              Solicitar cotización
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
