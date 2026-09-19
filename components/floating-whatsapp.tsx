"use client";

import { MessageCircle } from "lucide-react";

import { whatsappHref } from "@/lib/company";

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappHref("Hola, quiero cotizar una solución tecnológica con FindTec.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-emerald-900/25 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
      <span className="sr-only">Abrir chat de WhatsApp</span>
    </a>
  );
}
