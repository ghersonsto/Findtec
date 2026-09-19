"use client";

import { useState } from "react";
import {
  Monitor,
  Laptop,
  HardDrive,
  Router,
  Printer,
  Cpu,
  ShoppingCart,
  Star,
} from "lucide-react";

const categories = [
  { id: "all", label: "Todos" },
  { id: "computers", label: "Computadoras" },
  { id: "storage", label: "Almacenamiento" },
  { id: "networking", label: "Redes" },
  { id: "peripherals", label: "Periféricos" },
];

const products = [
  {
    id: 1,
    name: "Servidor Dell PowerEdge R750",
    category: "computers",
    price: "L. 125,000",
    rating: 5,
    icon: Monitor,
    featured: true,
    specs: ["Intel Xeon", "128GB RAM", "4TB SSD"],
  },
  {
    id: 2,
    name: "Laptop HP ProBook 450 G9",
    category: "computers",
    price: "L. 28,500",
    rating: 4,
    icon: Laptop,
    featured: false,
    specs: ["Intel i7", "16GB RAM", "512GB SSD"],
  },
  {
    id: 3,
    name: "NAS Synology DS923+",
    category: "storage",
    price: "L. 32,000",
    rating: 5,
    icon: HardDrive,
    featured: true,
    specs: ["4 Bahías", "RAID", "2x 2.5GbE"],
  },
  {
    id: 4,
    name: "Switch Cisco Catalyst 9200L",
    category: "networking",
    price: "L. 45,000",
    rating: 5,
    icon: Router,
    featured: false,
    specs: ["24 Puertos", "PoE+", "Gigabit"],
  },
  {
    id: 5,
    name: "Impresora HP LaserJet Pro MFP",
    category: "peripherals",
    price: "L. 18,500",
    rating: 4,
    icon: Printer,
    featured: false,
    specs: ["Multifunción", "WiFi", "Dúplex"],
  },
  {
    id: 6,
    name: "Workstation Dell Precision 5860",
    category: "computers",
    price: "L. 95,000",
    rating: 5,
    icon: Cpu,
    featured: true,
    specs: ["Xeon W", "64GB RAM", "NVIDIA RTX"],
  },
];

export function CatalogSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section id="catalogo" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Catálogo de Productos
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Equipos tecnológicos de primera línea
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Distribuimos equipos de las mejores marcas con garantía oficial y
            soporte técnico especializado.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                className="group relative rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card"
              >
                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute right-4 top-4 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Destacado
                  </div>
                )}

                {/* Icon */}
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < product.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                {/* Specs */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.specs.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Price & Action */}
                <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                  <span className="text-xl font-bold text-primary">
                    {product.price}
                  </span>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary/10 px-4 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Cotizar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <a
            href="/catalogo"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-secondary/50 px-8 text-base font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-secondary hover:border-border/80"
          >
            Ver catálogo completo
          </a>
        </div>
      </div>
    </section>
  );
}
