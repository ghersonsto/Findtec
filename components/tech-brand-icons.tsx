import { cn } from "@/lib/utils";

type Brand = {
  name: string;
  slug: string;
  color: string;
  /** Si true, renderiza el mark Microsoft 4 colores (el CDN gris no se ve bien). */
  microsoft?: boolean;
};

/** Stack real del proyecto — isotipos locales (sin CDN en el critical path). */
export const TECH_BRANDS: Brand[] = [
  { name: "Laravel 11", slug: "laravel", color: "FF2D20" },
  { name: "Vue.js 3", slug: "vuedotjs", color: "4FC08D" },
  { name: "MySQL", slug: "mysql", color: "4479A1" },
  { name: "Docker", slug: "docker", color: "2496ED" },
  { name: "Python 3.12", slug: "python", color: "3776AB" },
  { name: "FastAPI", slug: "fastapi", color: "009688" },
  { name: "Microsoft 365", slug: "microsoft365", color: "D83B01", microsoft: true },
  { name: "Ubuntu Server", slug: "ubuntu", color: "E95420" },
  { name: "WireGuard VPN", slug: "wireguard", color: "88171A" },
  { name: "Next.js 16", slug: "nextdotjs", color: "000000" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4" },
  { name: "Redis", slug: "redis", color: "DC382D" },
];

function MicrosoftMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      aria-hidden
      className={cn("size-[18px]", className)}
    >
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
      <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

export function BrandIcon({
  slug,
  color,
  name,
  className,
  microsoft,
}: {
  slug: string;
  color: string;
  name: string;
  className?: string;
  microsoft?: boolean;
}) {
  if (microsoft) {
    return <MicrosoftMark className={className} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG locales ligeros
    <img
      src={`/icons/tech/${slug}.svg`}
      alt=""
      aria-hidden
      width={18}
      height={18}
      title={name}
      className={cn(
        "size-[18px] object-contain",
        slug === "nextdotjs" && "dark:invert",
        className,
      )}
      loading="lazy"
      decoding="async"
      data-brand-color={color}
    />
  );
}
