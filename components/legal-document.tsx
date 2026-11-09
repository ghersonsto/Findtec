import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, Shield } from "lucide-react";

import { company } from "@/lib/company";
import type { LegalSection } from "@/lib/legal";
import { cn } from "@/lib/utils";

type LegalDocumentProps = {
  title: string;
  eyebrow: string;
  description: string;
  updatedLabel?: string;
  sections: LegalSection[];
  sibling: { href: string; label: string };
};

export function LegalDocument({
  title,
  eyebrow,
  description,
  updatedLabel = "Última actualización: noviembre 2026",
  sections,
  sibling,
}: LegalDocumentProps) {
  const isPrivacy = sibling.href === "/terminos";

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden bg-transparent text-foreground">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] opacity-70"
        aria-hidden
      >
        <div className="absolute left-1/2 top-24 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-primary/[0.12] blur-[100px] dark:bg-primary/[0.16]" />
        <div className="absolute right-[8%] top-40 h-40 w-72 rounded-full bg-sky-400/[0.08] blur-[90px]" />
      </div>

      <div className="container-pro relative z-10 pb-20 pt-24 sm:pb-24 sm:pt-28 lg:pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 sm:mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/80 px-3.5 py-2 text-xs font-semibold text-zinc-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-primary/35 hover:text-primary active:scale-[0.98] dark:border-white/[0.08] dark:bg-zinc-900/70 dark:text-zinc-300"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Volver al inicio
            </Link>
            <Link
              href={sibling.href}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              {sibling.label}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>

          <header className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary dark:bg-primary/15">
              {isPrivacy ? (
                <Shield className="size-3.5" aria-hidden />
              ) : (
                <FileText className="size-3.5" aria-hidden />
              )}
              {eyebrow}
            </p>
            <h1 className="mt-4 font-display text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.85rem]">
              {title}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-[15px]">
              {description}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
              <span>{updatedLabel}</span>
              <span className="hidden h-1 w-1 rounded-full bg-zinc-400/50 sm:inline-block" aria-hidden />
              <span className="font-mono tracking-wide">RUC {company.ruc}</span>
            </div>
          </header>

          <ol className="mt-10 flex list-none flex-col gap-3.5 sm:mt-12 sm:gap-4">
            {sections.map((section, index) => (
              <li key={section.title}>
                <article
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border p-5 sm:p-6",
                    "border-black/[0.06] bg-white/92",
                    "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_28px_rgba(15,23,42,0.04)]",
                    "dark:border-white/[0.08] dark:bg-zinc-900/60",
                    "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_48px_rgba(0,0,0,0.4)]",
                    "backdrop-blur-md transition-[border-color,box-shadow] duration-300",
                    "hover:border-primary/25 dark:hover:border-primary/30",
                  )}
                >
                  <div className="flex gap-3.5 sm:gap-4">
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 font-mono text-xs font-bold tabular-nums text-primary shadow-[0_0_18px_rgba(37,99,235,0.18)] sm:size-10 sm:text-sm"
                      aria-hidden
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-[15px] font-bold tracking-tight text-foreground sm:text-base">
                        {section.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {section.body}
                      </p>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground sm:mt-12">
            © {new Date().getFullYear()} {company.name}. {company.legalName}.
            <br className="sm:hidden" />
            <span className="sm:ml-1">Todos los derechos reservados.</span>
          </p>
        </div>
      </div>
    </main>
  );
}
