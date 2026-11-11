"use client";

import { useEffect } from "react";

/**
 * Protección disuasoria (no es seguridad absoluta).
 * Los navegadores permiten abrir DevTools por otros caminos; esto solo
 * reduce la inspección casual sin bloquear la experiencia del sitio.
 */

const NOTICE = [
  "© FINDTEC SOLUCIONES",
  "",
  "Todos los derechos reservados.",
  "",
  "Para consultas técnicas o comerciales, comunícate con nosotros mediante nuestros canales oficiales.",
].join("\n");

const SESSION_KEY = "findtec-protect-notice";

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

  const ctrlOrMeta = event.ctrlKey || event.metaKey;

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

  // Evitar interferir con atajos normales (copiar/pegar/seleccionar, etc.)
  void ctrlOrMeta;
  return false;
}

export function SiteProtection() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (isLocalHost(window.location.hostname)) return;

    let alerting = false;
    let shownThisPage = false;

    const alreadyShown = () => {
      if (shownThisPage) return true;
      try {
        return sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        return false;
      }
    };

    const markShown = () => {
      shownThisPage = true;
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* modo privado / storage bloqueado */
      }
    };

    const showNotice = () => {
      if (alerting || alreadyShown()) return;
      alerting = true;
      markShown();
      try {
        window.alert(NOTICE);
      } finally {
        // Liberar tras el cierre del diálogo nativo
        window.setTimeout(() => {
          alerting = false;
        }, 250);
      }
    };

    const onContextMenu = (event: MouseEvent) => {
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
      showNotice();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isInspectShortcut(event)) return;
      // No interferir con campos de formulario salvo F12 / atajos de inspección
      if (isEditableTarget(event.target) && event.key !== "F12") {
        // Ctrl+U en un input no debe abrir "ver código", pero tampoco debe
        // interrumpir escritura: solo cancelamos el atajo de inspección.
      }
      event.preventDefault();
      event.stopPropagation();
      showNotice();
    };

    document.addEventListener("contextmenu", onContextMenu, { capture: true });
    document.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      document.removeEventListener("contextmenu", onContextMenu, {
        capture: true,
      } as EventListenerOptions);
      document.removeEventListener("keydown", onKeyDown, {
        capture: true,
      } as EventListenerOptions);
    };
  }, []);

  return null;
}
