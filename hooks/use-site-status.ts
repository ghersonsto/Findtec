"use client";

import { useEffect, useState } from "react";

export type SiteStatus = {
  online: boolean;
  businessHours: boolean;
  mailConfigured: boolean;
  responseHint: string;
  servicesCount: number;
  tagline: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  channels: {
    whatsapp: boolean;
    email: boolean;
    form: boolean;
    phone: boolean;
  };
};

const fallback: SiteStatus = {
  online: true,
  businessHours: true,
  mailConfigured: false,
  responseHint: "Escríbenos por WhatsApp para una respuesta más rápida.",
  servicesCount: 0,
  tagline: "Software, IA y digitalización con soporte cercano",
  stack: ["Laravel", "Vue.js", "Docker", "Python", "IA"],
  metrics: [
    { label: "Clientes", value: "100+" },
    { label: "Enfoque", value: "B2B / B2G" },
    { label: "Soporte", value: "Continuo" },
  ],
  channels: { whatsapp: true, email: true, form: false, phone: true },
};

export function useSiteStatus() {
  const [status, setStatus] = useState<SiteStatus>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/site")
      .then((res) => res.json())
      .then((data) => {
        if (!active || !data?.ok) return;
        setStatus({
          online: Boolean(data.online),
          businessHours: Boolean(data.businessHours),
          mailConfigured: Boolean(data.mailConfigured),
          responseHint: data.responseHint || fallback.responseHint,
          servicesCount: Number(data.servicesCount) || 0,
          tagline: data.tagline || fallback.tagline,
          stack: Array.isArray(data.stack) ? data.stack : fallback.stack,
          metrics: Array.isArray(data.metrics) ? data.metrics : fallback.metrics,
          channels: {
            whatsapp: Boolean(data.channels?.whatsapp),
            email: Boolean(data.channels?.email),
            form: Boolean(data.channels?.form),
            phone: Boolean(data.channels?.phone),
          },
        });
      })
      .catch(() => {
        /* keep fallback */
      })
      .finally(() => {
        if (active) setLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return { status, loaded };
}
