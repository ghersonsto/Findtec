"use client";

import { ArrowUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { navigateToSection, sectionHref } from "@/lib/site-nav";

export function BackToTop() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={sectionHref("inicio")}
      aria-label="Volver al inicio"
      onClick={(event) => {
        event.preventDefault();
        navigateToSection("inicio");
      }}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.8 }}
      className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary active:scale-[0.98] dark:border-white/[0.08] dark:bg-white/[0.04]"
    >
      <ArrowUp className="size-4" />
    </motion.a>
  );
}
