"use client";

import { motion, useReducedMotion } from "motion/react";
import { Scene3D } from "@/components/scene-3d";

type PageHeaderProps = {
  kicker?: string;
  title: string;
  description: string;
  /** Optional substring of title rendered in Electric Blue */
  highlight?: string;
};

function DualTitle({ title, highlight }: { title: string; highlight?: string }) {
  if (!highlight || !title.includes(highlight)) {
    return <>{title}</>;
  }
  const [before, ...rest] = title.split(highlight);
  const after = rest.join(highlight);
  return (
    <>
      {before}
      <span className="text-primary">{highlight}</span>
      {after}
    </>
  );
}

export function PageHeader({ kicker, title, description, highlight }: PageHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <header className="relative isolate overflow-hidden border-b border-border bg-background pt-28 pb-14 sm:pt-36 sm:pb-16 md:pt-40 md:pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="aurora-glow absolute -top-28 left-1/2 h-72 w-[640px] -translate-x-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,24,39,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,24,39,0.03)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_40%_0%,#000_50%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)]" />
      </div>
      <Scene3D intensity={0.45} />
      <motion.div
        className="container-pro relative"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }
        }
      >
        {kicker ? (
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[11px] font-medium tracking-wide text-primary uppercase">
            {kicker}
          </p>
        ) : null}
        <h1 className="font-display max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          <DualTitle title={title} highlight={highlight} />
        </h1>
        <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      </motion.div>
    </header>
  );
}
