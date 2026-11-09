"use client";

import dynamic from "next/dynamic";

const SmartChatbot = dynamic(
  () => import("@/components/smart-chatbot").then((m) => m.SmartChatbot),
  { ssr: false, loading: () => null },
);

export function LazyChatbot() {
  return <SmartChatbot />;
}
