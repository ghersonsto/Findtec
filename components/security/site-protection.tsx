"use client";

import { useEffect } from "react";

/**
 * Protección disuasoria (no es seguridad absoluta).
 * Los navegadores permiten abrir DevTools por otros caminos; esto solo
 * reduce la inspección casual sin bloquear la experiencia del sitio.
 *
 * No usa sessionStorage permanente: el aviso puede repetirse en cada intento
 * deliberado, con un cooldown corto anti-ráfaga.
 */

const NOTICE = [
  "© FINDTEC SOLUCIONES",
  "",
  "Todos los derechos reservados.",
  "",
  "Para consultas comerciales o técnicas, comunícate mediante nuestros canales oficiales.",
].join("\n");

/** Evita alertas duplicadas por el mismo gesto / teclas repetidas. */
const COOLDOWN_MS = 750;

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  const el = target as HTMLElement;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return Boolean(el.closest("input, textarea, select, [contenteditable='true']"));
}

function isLocalHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".local")
  );
}

function isInspectShortcut(event: KeyboardEvent): boolean {
  const key = event.key;
  const lower = key.length === 1 ? key.toLowerCase() : key;

  if (key === "F12") return true;

  // Windows / Linux: Ctrl+Shift+I/J/C, Ctrl+U
  if (event.ctrlKey && event.shiftKey && (lower === "i" || lower === "j" || lower === "c")) {
    return true;
  }
  if (event.ctrlKey && !event.shiftKey && !event.altKey && lower === "u") {
    return true;
  }

  // macOS: Cmd+Option+I/J/C/U
  if (event.metaKey && event.altKey && (lower === "i" || lower === "j" || lower === "c" || lower === "u")) {
    return true;
  }

  return false;
}

export function SiteProtection() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (isLocalHost(window.location.hostname)) return;

    let alerting = false;
    let lastAlertAt = 0;

    const showNotice = () => {
      if (alerting) return;
      const now = Date.now();
      if (now - lastAlertAt < COOLDOWN_MS) return;

      alerting = true;
      lastAlertAt = now;
      try {
        window.alert(NOTICE);
      } finally {
        window.setTimeout(() => {
          alerting = false;
        }, 200);
      }
    };

    const onContextMenu = (event: MouseEvent) => {
      if (isEditableTarget(event.target)) return;
      // Solo menú contextual: no toca clics normales del navbar/botones.
      event.preventDefault();
      showNotice();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isInspectShortcut(event)) return;
      event.preventDefault();
      showNotice();
    };

    document.addEventListener("contextmenu", onContextMenu, { capture: true });
    document.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      document.removeEventListener("contextmenu", onContextMenu, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  return null;
}
