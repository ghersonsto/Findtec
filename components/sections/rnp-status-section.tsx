"use client";

import { useState } from "react";
import { Search, CheckCircle2, AlertCircle, Clock, FileText } from "lucide-react";

const recentQueries = [
  {
    id: "RNP-2024-00145",
    status: "completed",
    date: "2024-01-15",
    type: "Consulta de Estado",
  },
  {
    id: "RNP-2024-00132",
    status: "processing",
    date: "2024-01-14",
    type: "Actualización de Datos",
  },
  {
    id: "RNP-2024-00128",
    status: "pending",
    date: "2024-01-13",
    type: "Nueva Solicitud",
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: "Completado",
    className: "text-green-400 bg-green-400/10",
  },
  processing: {
    icon: Clock,
    label: "En Proceso",
    className: "text-yellow-400 bg-yellow-400/10",
  },
  pending: {
    icon: AlertCircle,
    label: "Pendiente",
    className: "text-orange-400 bg-orange-400/10",
  },
};

export function RnpStatusSection() {
  const [searchId, setSearchId] = useState("");

  return (
    <section id="estado-rnp" className="relative py-24 sm:py-32 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Estado RNP
            </span>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Consulta el estado de tus trámites en tiempo real
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Accede rápidamente al estado de tus solicitudes del Registro
              Nacional de las Personas. Mantente informado sobre el progreso de
              tus trámites de manera sencilla y segura.
            </p>

            {/* Search Form */}
            <div className="mt-8">
              <label
                htmlFor="rnp-search"
                className="block text-sm font-medium text-foreground mb-3"
              >
                Número de Solicitud
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="rnp-search"
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Ej: RNP-2024-00145"
                    className="h-14 w-full rounded-xl border border-border bg-input pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110"
                >
                  Consultar
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { icon: CheckCircle2, text: "Resultados inmediatos" },
                { icon: FileText, text: "Historial de consultas" },
                { icon: Clock, text: "Actualizaciones 24/7" },
                { icon: AlertCircle, text: "Notificaciones activas" },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.text}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-sm">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Recent Queries */}
          <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Consultas Recientes
            </h3>
            <div className="space-y-4">
              {recentQueries.map((query) => {
                const config =
                  statusConfig[query.status as keyof typeof statusConfig];
                const StatusIcon = config.icon;
                return (
                  <div
                    key={query.id}
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.className}`}
                      >
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{query.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {query.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
                      >
                        {config.label}
                      </span>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {query.date}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded-xl border border-border bg-transparent py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Ver historial completo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
