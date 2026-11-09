import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

import { BackToTop } from "@/components/back-to-top";
import { BrandLogo } from "@/components/brand-logo";
import { SectionAnchor } from "@/components/section-anchor";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { company, whatsappHref } from "@/lib/company";
import { SITE_NAV_LINKS, SITE_SERVICE_LINKS } from "@/lib/site-nav";

const linkClass =
  "text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm";

const legalLinks = [
  { href: "/terminos", label: "Términos y condiciones" },
  { href: "/privacidad", label: "Privacidad" },
] as const;

const socials = [
  { icon: Linkedin, id: "contacto", label: "LinkedIn" },
  { icon: Facebook, id: "contacto", label: "Facebook" },
  { icon: Instagram, id: "contacto", label: "Instagram" },
] as const;

export function Footer() {
  return (
    <footer
      id="site-footer"
      className="relative overflow-hidden border-t border-border/70 bg-transparent dark:border-white/[0.06]"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="container-pro relative py-9 sm:py-12 lg:py-14">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <SectionAnchor id="inicio" className="group inline-flex" aria-label="Findtec Soluciones inicio">
              <span className="dark:hidden">
                <BrandLogo tone="onLight" size="footer" className="transition group-hover:opacity-95" />
              </span>
              <span className="hidden dark:inline-flex">
                <BrandLogo tone="onDark" size="footer" className="transition group-hover:opacity-95" />
              </span>
            </SectionAnchor>
            <div className="mt-2 max-w-xs space-y-0.5 text-sm leading-relaxed text-muted-foreground">
              <p>{company.legalName}</p>
              <p>RUC {company.ruc}</p>
            </div>
            <p className="mt-3.5 max-w-xs text-sm leading-relaxed text-muted-foreground sm:mt-4">
              Software, IA e infraestructura TI para empresas e instituciones en Perú.
            </p>
            <div className="mt-4 flex gap-2.5 sm:mt-6">
              {socials.map((social) => (
                <SectionAnchor
                  key={social.label}
                  id={social.id}
                  className="flex size-11 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary active:scale-[0.98] dark:border-white/[0.08] dark:bg-white/[0.04] sm:size-10"
                  aria-label={social.label}
                >
                  <social.icon className="size-4" />
                </SectionAnchor>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:contents">
            <div>
              <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
                Empresa
              </h3>
              <ul className="mt-3.5 space-y-2.5 sm:mt-5 sm:space-y-3">
                {SITE_NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <SectionAnchor id={link.id} className={linkClass}>
                      {link.label}
                    </SectionAnchor>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
                Servicios
              </h3>
              <ul className="mt-3.5 space-y-2.5 sm:mt-5 sm:space-y-3">
                {SITE_SERVICE_LINKS.map((service) => (
                  <li key={service.label}>
                    <SectionAnchor id={service.id} className={linkClass}>
                      {service.label}
                    </SectionAnchor>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
              Contacto
            </h3>
            <ul className="mt-3.5 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-1">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href={`mailto:${company.email}`} className={linkClass}>
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href={company.phoneHref} className={linkClass}>
                  {company.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">{company.shortAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-5 sm:mt-12 sm:flex-row sm:gap-4 sm:pt-7">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Findtec Soluciones. Todos los derechos reservados.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
            <nav
              aria-label="Documentos legales"
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
            >
              {legalLinks.map((item) => (
                <Link key={item.href} href={item.href} className={`${linkClass} text-xs`}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
