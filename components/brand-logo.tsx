"use client";

import Image from "next/image";

import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  tone?: "onDark" | "onLight";
  size?: "nav" | "footer" | "panel";
  markOnly?: boolean;
  showLegal?: boolean;
  /** Subtítulo bajo el nombre (nav). Por defecto: ubicación. */
  subtitle?: string;
  className?: string;
  pop3d?: boolean;
};

const markBox = {
  nav: "h-9 w-9 sm:h-10 sm:w-10",
  footer: "h-10 w-10 sm:h-11 sm:w-11",
  panel: "h-11 w-11",
} as const;

const markPixels = {
  nav: 40,
  footer: 44,
  panel: 44,
} as const;

/** Marca Findtec — isotipo oficial. */
export function FindtecMark({
  className,
  size = 40,
  title = "Findtec",
}: {
  className?: string;
  size?: number;
  title?: string;
}) {
  return (
    <Image
      src={company.logo.mark}
      alt={title}
      width={size}
      height={size}
      priority
      className={cn(
        "shrink-0 rounded-full object-cover ring-1 ring-black/[0.06] dark:ring-white/[0.12]",
        className,
      )}
    />
  );
}

/** Logo del header / footer: marca + FINDTEC Soluciones. */
export function BrandLogo({
  tone = "onDark",
  size = "nav",
  markOnly = false,
  showLegal = false,
  subtitle,
  className,
}: BrandLogoProps) {
  const onDark = tone === "onDark";
  const line = subtitle ?? company.shortAddress;
  const isNav = size === "nav";

  const mark = (
    <FindtecMark
      className={markBox[size]}
      size={markPixels[size]}
      title={company.name}
    />
  );

  if (markOnly) {
    return <span className={cn("inline-flex", className)}>{mark}</span>;
  }

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      {mark}
      <span className="min-w-0 text-left leading-none">
        {showLegal ? (
          <span
            className={cn(
              "mb-0.5 block text-[9px] font-medium tracking-[0.14em]",
              onDark ? "text-white/45" : "text-zinc-500",
            )}
          >
            RUC {company.ruc}
          </span>
        ) : null}

        <span
          className={cn(
            "font-display block tracking-tight",
            isNav ? "text-[0.88rem] sm:text-[0.98rem]" : "text-base sm:text-lg",
          )}
        >
          <span className={cn("font-extrabold", onDark ? "text-white" : "text-zinc-950")}>
            FINDTEC
          </span>{" "}
          <span className={cn("font-semibold", onDark ? "text-white/90" : "text-zinc-700")}>
            SOLUCIONES
          </span>
        </span>

        {showLegal ? (
          <span
            className={cn(
              "mt-1 block max-w-[16rem] text-[9px] font-medium uppercase leading-snug tracking-wide",
              onDark ? "text-white/40" : "text-zinc-500",
            )}
          >
            Bienes y Servicios e Inversiones E.I.R.L.
          </span>
        ) : (
          <span
            className={cn(
              "mt-0.5 block max-w-[14rem] truncate text-[8.5px] font-medium tracking-[0.01em] sm:max-w-[18rem] sm:text-[9.5px]",
              onDark ? "text-slate-300/80" : "text-zinc-500",
            )}
          >
            {line}
          </span>
        )}
      </span>
    </span>
  );
}
