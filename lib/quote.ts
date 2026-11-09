/** Deep-link + event helpers for product-aware quotes. */

import { prefersReducedMotion, scrollElementWithNavOffset } from "@/lib/site-nav";

export const QUOTE_EVENT = "findtec-quote";

export type QuotePayload = {
  servicio: string;
  label?: string;
  mensaje?: string;
};

export function quoteHref(servicio: string, mensaje?: string) {
  const params = new URLSearchParams({ servicio });
  if (mensaje?.trim()) params.set("mensaje", mensaje.trim());
  return `#contacto?${params.toString()}`;
}

function contactQuotePath(serviceId: string, mensaje?: string) {
  const query = `servicio=${encodeURIComponent(serviceId)}`;
  const note = mensaje?.trim();
  if (!note) return `/contacto?${query}`;
  return `/contacto?${query}&mensaje=${encodeURIComponent(note)}`;
}

export function startQuote(payload: QuotePayload) {
  if (typeof window === "undefined") return;

  const serviceId = payload.servicio?.trim() ?? "";
  window.dispatchEvent(new CustomEvent(QUOTE_EVENT, { detail: payload }));

  const hash = quoteHref(serviceId, payload.mensaje);
  const target = document.getElementById("contacto");
  const onHome = window.location.pathname === "/";
  const onContactPage = window.location.pathname === "/contacto";
  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";

  // One-page: preferir sección #contacto del home
  if (onHome && target) {
    window.history.replaceState(null, "", hash);
    scrollElementWithNavOffset(target, behavior);
    return;
  }

  if (onContactPage && target) {
    window.history.replaceState(null, "", contactQuotePath(serviceId, payload.mensaje));
    scrollElementWithNavOffset(target, behavior);
    return;
  }

  window.location.assign(`/${hash}`);
}

export function parseQuoteFromHash(hash = typeof window !== "undefined" ? window.location.hash : "") {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return null;

  const [id, query = ""] = raw.split("?");
  if (id !== "contacto") return null;

  const params = new URLSearchParams(query);
  const servicio = params.get("servicio")?.trim() || "";
  const mensaje = params.get("mensaje")?.trim() || "";
  if (!servicio && !mensaje) return null;

  return { servicio, mensaje, label: params.get("label")?.trim() || undefined };
}
