import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-20 text-center text-foreground">
      <section className="max-w-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Página no encontrada</h1>
        <p className="mt-4 text-muted-foreground">
          La ruta que buscas no existe o fue movida. Puedes volver al inicio para contactar a FindTec Soluciones.
        </p>
        <Link
          href="/"
          className="btn-primary mt-6 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-white"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
