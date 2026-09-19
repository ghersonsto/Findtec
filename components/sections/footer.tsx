import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import Link from "next/link";

import { company, whatsappHref } from "@/lib/company";

const services = [
  "Hardware empresarial",
  "Microsoft 365 y Cloud",
  "Soporte técnico",
  "Mantenimiento de equipos",
  "Desarrollo web",
  "Análisis de datos",
  "Consultoría tecnológica",
];

const links = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Experiencia B2G", href: "#experiencia-b2g" },
  { label: "Clientes", href: "#testimonios" },
  { label: "Contacto", href: "#contacto" },
];

const socials = [
  { icon: Linkedin, href: "#contacto", label: "LinkedIn" },
  { icon: Facebook, href: "#contacto", label: "Facebook" },
  { icon: Instagram, href: "#contacto", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-card/50">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-3" aria-label="FindTec inicio">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:bg-primary/20">
                <span className="text-xl font-black text-primary">F</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  FIND<span className="text-gradient">TEC</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Soluciones
                </span>
              </div>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Soluciones tecnológicas para empresas e instituciones. Impulsamos la
              transformación digital con innovación, orden y confiabilidad.
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/70 text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Navegación
            </h3>
            <ul className="mt-6 space-y-4">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Servicios
            </h3>
            <ul className="mt-6 space-y-4">
              {services.slice(0, 5).map((service) => (
                <li key={service}>
                  <a href="#servicios" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Contacto
            </h3>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${company.email}`} className="text-sm text-muted-foreground hover:text-primary">
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={company.phoneHref} className="text-sm text-muted-foreground hover:text-primary">
                  {company.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  WhatsApp directo
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">{company.shortAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 FindTec Soluciones. Todos los derechos reservados.
          </p>
          <p className="text-center text-xs text-muted-foreground">{company.legalName}</p>
        </div>
      </div>
    </footer>
  );
}
