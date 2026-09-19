"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
          <section style={{ maxWidth: 520, fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
            <h1 style={{ margin: 0, fontSize: 32 }}>Algo no salió bien</h1>
            <p style={{ color: "#5f6b7a", lineHeight: 1.6 }}>
              Ocurrió un error inesperado. Puedes intentar nuevamente o contactar a FindTec Soluciones.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                border: 0,
                borderRadius: 999,
                background: "#3e85c1",
                color: "white",
                cursor: "pointer",
                fontWeight: 700,
                padding: "12px 20px",
              }}
            >
              Intentar nuevamente
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
