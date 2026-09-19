"use client";

const clients = [
  "Microsoft",
  "HP",
  "Dell",
  "Lenovo",
  "Intel",
  "ASUS",
  "Cisco",
  "VMware",
];

export function ClientsSection() {
  return (
    <section className="relative overflow-hidden border-y border-border py-10">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-card/50 to-background" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Trabajamos con las mejores marcas
        </p>
        
        {/* Marquee container */}
        <div className="relative flex overflow-hidden">
          {/* Gradient fade left */}
          <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
          {/* Gradient fade right */}
          <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />
          
          <div className="animate-marquee flex items-center gap-16">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={index}
                className="flex h-16 shrink-0 items-center justify-center px-4"
              >
                <span className="whitespace-nowrap text-2xl font-bold text-muted-foreground/40 transition-colors hover:text-muted-foreground">
                  {client}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
