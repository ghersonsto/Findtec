"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SmartChatbot = dynamic(
  () => import("@/components/smart-chatbot").then((m) => m.SmartChatbot),
  { ssr: false, loading: () => null },
);

/**
 * No descarga el bundle del chatbot en el critical path.
 * Se arma con: evento de cotización, scroll > 200px, o idle (~5s).
 */
export function LazyChatbot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let armed = false;
    const arm = () => {
      if (armed) return;
      armed = true;
      setReady(true);
    };

    const onOpen = () => arm();
    window.addEventListener("open-findtec-chatbot", onOpen);

    const onScroll = () => {
      if (window.scrollY > 200) arm();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let idleId: number | undefined;
    let timeoutId: number | undefined;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(arm, { timeout: 5000 });
    } else {
      timeoutId = window.setTimeout(arm, 4000);
    }

    return () => {
      window.removeEventListener("open-findtec-chatbot", onOpen);
      window.removeEventListener("scroll", onScroll);
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return null;
  return <SmartChatbot />;
}
