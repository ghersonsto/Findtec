"use client";

import dynamic from "next/dynamic";

const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((m) => m.Toaster),
  { ssr: false, loading: () => null },
);

/** Sonner fuera del critical path — solo se hidrata en cliente. */
export function LazyToaster() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        className:
          "border border-black/[0.08] dark:border-white/[0.1] shadow-2xl backdrop-blur-xl bg-background/90 text-foreground",
      }}
    />
  );
}
