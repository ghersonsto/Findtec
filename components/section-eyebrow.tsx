import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionEyebrow({
  children,
  className,
  align = "center",
}: {
  children: ReactNode;
  className?: string;
  align?: "center" | "left";
}) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-primary",
        align === "center" && "text-center",
        className,
      )}
    >
      — {children} —
    </p>
  );
}
