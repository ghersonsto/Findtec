"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type PanInfo,
} from "motion/react";
import Image from "next/image";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { cn } from "@/lib/utils";
import { startQuote } from "@/lib/quote";

type ShowcaseSlide = {
  id: string;
  category: string;
  title: string;
  caption: string;
  image: string;
  serviceKey: string;
};

const SLIDES: ShowcaseSlide[] = [
  {
    id: "erp",
    category: "Software",
    title: "Gestión empresarial",
    caption: "Operaciones, inventario y reportes.",
    image: "/images/findtec-service-erp.webp",
    serviceKey: "software-gestion",
  },
  {
    id: "ia",
    category: "IA & APIs",
    title: "Integraciones inteligentes",
    caption: "Automatización de documentos y flujos.",
    image: "/images/findtec-service-ia.webp",
    serviceKey: "ia",
  },
  {
    id: "cloud",
    category: "Cloud",
    title: "Infraestructura TI",
    caption: "Entornos estables y continuidad.",
    image: "/images/findtec-service-cloud.webp",
    serviceKey: "cloud",
  },
  {
    id: "datacenter",
    category: "Hosting",
    title: "Arquitectura cloud",
    caption: "Despliegues controlados.",
    image: "/images/findtec-data-center.webp",
    serviceKey: "cloud",
  },
  {
    id: "hardware",
    category: "Soporte",
    title: "Soporte técnico",
    caption: "Ingenieros que conocen tu stack.",
    image: "/images/hardware.jpg",
    serviceKey: "soporte",
  },
  {
    id: "ops",
    category: "Operaciones",
    title: "Sistemas a medida",
    caption: "Flujos alineados a tu proceso.",
    image: "/images/automotive.jpg",
    serviceKey: "software-gestion",
  },
  {
    id: "network",
    category: "Redes",
    title: "Conectividad segura",
    caption: "VPN y acceso controlado.",
    image: "/images/cloud.jpg",
    serviceKey: "cloud",
  },
  {
    id: "web",
    category: "Sitio web",
    title: "Presencia digital",
    caption: "Sitios claros y rápidos.",
    image: "/images/hero-tech.jpg",
    serviceKey: "web",
  },
];

const N = SLIDES.length;
const ANGLE = 360 / N;

/** Flash Devs: xx(cardAngle, rotation) */
function xx(cardAngle: number, rotation: number) {
  return ((((cardAngle + rotation) % 360) + 540) % 360) - 180;
}

function wrapIndex(i: number) {
  return ((i % N) + N) % N;
}

function readCardWidth() {
  if (typeof window === "undefined") return 320;
  const w = window.innerWidth;
  // Móvil: tarjeta protagonista + peek de vecinas, sin overflow de página
  if (w < 360) return Math.min(210, w - 56);
  if (w < 480) return Math.min(248, w - 48);
  if (w < 640) return Math.min(268, w - 56);
  if (w < 1024) return 280;
  return 320;
}

function CarouselCard({
  slide,
  index,
  step,
  radius,
  width,
  rotation,
  isFront,
  onSelect,
}: {
  slide: ShowcaseSlide;
  index: number;
  step: number;
  radius: number;
  width: number;
  rotation: ReturnType<typeof useSpring>;
  isFront: boolean;
  onSelect: () => void;
}) {
  const cardAngle = index * step;

  const transform = useTransform(rotation, (m) => {
    const b = xx(cardAngle, m);
    return `rotateY(${cardAngle}deg) translateZ(${radius}px) rotateY(${-cardAngle - m + b * 0.45}deg)`;
  });

  const depth = useTransform(rotation, (m) => {
    const b = xx(cardAngle, m);
    return (Math.cos((b * Math.PI) / 180) + 1) / 2;
  });

  const opacity = useTransform(depth, (d) => 0.18 + 0.82 * Math.pow(d, 1.6));
  const filter = useTransform(
    depth,
    (d) => `brightness(${0.35 + 0.65 * d}) blur(${(1 - d) * 3}px)`,
  );

  const card = (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-card/95 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.85)] sm:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)] dark:bg-[#0A0F1C] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_24px_48px_-24px_rgba(0,0,0,0.9)] sm:dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_40px_80px_-30px_rgba(0,0,0,0.95)]">
      <div className="p-2 sm:p-3">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0b1222]">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-2.5 py-1.5 sm:px-3 sm:py-2">
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="(max-width: 640px) 70vw, 380px"
              loading={isFront ? "eager" : "lazy"}
              draggable={false}
              className="object-cover object-center transition-transform duration-700 ease-out select-none group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 px-3.5 pb-3.5 pt-1.5 sm:gap-4 sm:px-5 sm:pb-5 sm:pt-2">
        <div className="min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-[11px]">
            {slide.category}
          </span>
          <h3 className="mt-0.5 truncate text-base font-semibold text-foreground sm:mt-1 sm:text-lg">
            {slide.title}
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground sm:mt-1 sm:text-sm">{slide.caption}</p>
        </div>
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-sky-400 text-white shadow-[0_0_24px_rgba(37,99,235,0.45)] transition-transform duration-300 group-hover:rotate-45 sm:mt-1 sm:size-10">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </div>
  );

  return (
    <motion.div
      className="absolute left-1/2 top-0"
      style={{
        width,
        marginLeft: -width / 2,
        transform,
        opacity,
        filter,
        transformStyle: "preserve-3d",
      }}
    >
      {isFront ? (
        <button
          type="button"
          aria-label={`Cotizar ${slide.title}`}
          aria-current="true"
          draggable={false}
          className="block w-full cursor-pointer text-left"
          onClick={() => {
            startQuote({
              servicio: slide.serviceKey,
              label: slide.title,
              mensaje: `Hola Findtec, deseo cotizar: ${slide.title}.`,
            });
          }}
        >
          {card}
        </button>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label={slide.title}
          className="cursor-pointer"
          onClick={onSelect}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect();
            }
          }}
        >
          {card}
        </div>
      )}
    </motion.div>
  );
}

export function ProjectsCarousel() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const dragMoved = useRef(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cardW, setCardW] = useState(320);
  const [inView, setInView] = useState(true);

  const radius = Math.round(
    cardW / 2 / Math.tan(Math.PI / N) + (cardW < 280 ? 28 : 48),
  );
  const ringH = Math.round(cardW * 0.625 + 120);
  const stageH = ringH + 72;

  const rotationMV = useMotionValue(0);
  const rotation = useSpring(rotationMV, reduceMotion
    ? { stiffness: 1000, damping: 100 }
    : { stiffness: 90, damping: 20, mass: 1 });
  const ringTransform = useTransform(
    rotation,
    (r) => `translateZ(${-radius}px) rotateX(-6deg) rotateY(${r}deg)`,
  );

  useEffect(() => {
    const sync = () => setCardW(readCardWidth());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    rotationMV.set(-index * ANGLE);
  }, [ANGLE, index, rotationMV]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "-20% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const go = useCallback((dir: number) => {
    if (dir === 0) return;
    setIndex((i) => i + dir);
  }, []);

  const goTo = useCallback(
    (target: number) => {
      const current = wrapIndex(index);
      let delta = target - current;
      if (delta > N / 2) delta -= N;
      if (delta < -N / 2) delta += N;
      go(delta);
    },
    [go, index],
  );

  useEffect(() => {
    if (reduceMotion || paused || !inView) return;
    const id = window.setInterval(() => go(1), 3800);
    return () => window.clearInterval(id);
  }, [go, inView, paused, reduceMotion]);

  const selected = wrapIndex(index);
  const active = SLIDES[selected];

  const onPan = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    dragMoved.current = true;
    rotationMV.set(-index * ANGLE + info.offset.x * 0.25);
  };

  const onPanEnd = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const steps = Math.round((-info.offset.x * 0.25 - info.velocity.x * 0.05) / ANGLE);
    if (steps !== 0) setIndex((i) => i + steps);
    else rotationMV.set(-index * ANGLE);
    window.setTimeout(() => {
      dragMoved.current = false;
    }, 50);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <section
      ref={sectionRef}
      id="proyectos"
      aria-labelledby="projects-heading"
      className="section-cinematic relative isolate overflow-x-clip scroll-mt-[var(--nav-scroll-offset,5.5rem)] py-10 text-foreground sm:py-14 lg:py-16"
    >
      <div className="container-pro relative z-10">
        <div className="mx-auto max-w-3xl text-center" data-nav-focus-header>
          <SectionEyebrow>Proyectos</SectionEyebrow>
          <h2
            id="projects-heading"
            className="mt-2.5 font-display text-balance text-[1.65rem] font-extrabold leading-tight tracking-tight text-foreground sm:mt-3 sm:text-4xl lg:text-5xl"
          >
            Capacidades que{" "}
            <span className="bg-gradient-to-r from-sky-400 to-primary bg-clip-text text-transparent">
              hablan por nosotros
            </span>
          </h2>
          <p className="mt-2.5 font-sans text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-lg">
            Software, IA, cloud y arquitectura digital para empresas e instituciones en Perú.
          </p>
        </div>
      </div>

      <motion.div
        data-nav-focus
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Proyectos y capacidades Findtec"
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPanStart={() => setPaused(true)}
        onPan={reduceMotion ? undefined : onPan}
        onPanEnd={reduceMotion ? undefined : onPanEnd}
        onClickCapture={(e) => {
          if (dragMoved.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className="relative z-10 mx-auto mt-5 max-w-[100vw] cursor-grab touch-pan-y select-none overflow-x-clip rounded-3xl outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-primary/50 sm:mt-6"
        style={{
          height: stageH,
          perspective: cardW < 280 ? 900 : 1200,
          perspectiveOrigin: "50% 30%",
        }}
      >
        <motion.div
          className="absolute inset-x-0 top-4"
          style={{
            height: ringH,
            transformStyle: "preserve-3d",
            transform: ringTransform,
          }}
        >
          {SLIDES.map((slide, i) => (
            <CarouselCard
              key={slide.id}
              slide={slide}
              index={i}
              step={ANGLE}
              radius={radius}
              width={cardW}
              rotation={rotation}
              isFront={i === selected}
              onSelect={() => goTo(i)}
            />
          ))}
        </motion.div>

        <div
          aria-hidden
          className="absolute bottom-0 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[100%] bg-primary/25 blur-2xl"
        />
      </motion.div>

      {/* Controles originales — solo gap inferior corregido */}
      <div className="container-pro relative z-10 mt-8 pt-1 sm:mt-10 sm:pt-2">
        <div className="flex flex-col items-center gap-3 sm:gap-3.5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <motion.button
              type="button"
              aria-label="Anterior"
              onClick={() => go(-1)}
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-primary/60 hover:shadow-[0_0_24px_rgba(37,99,235,0.25)] active:scale-[0.98] sm:size-10"
            >
              <ChevronLeft className="size-4" />
            </motion.button>

            <div className="min-w-[140px] text-center sm:min-w-[180px]" aria-live="polite">
              <p className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {String(selected + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
              </p>
              <p className="mt-0.5 font-display text-sm font-semibold text-foreground">
                {active.title}
              </p>
            </div>

            <motion.button
              type="button"
              aria-label="Siguiente"
              onClick={() => go(1)}
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:border-primary/60 hover:shadow-[0_0_24px_rgba(37,99,235,0.25)] active:scale-[0.98] sm:size-10"
            >
              <ChevronRight className="size-4" />
            </motion.button>
          </div>

          <div className="flex items-center gap-1.5" role="tablist" aria-label="Slides">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={i === selected}
                aria-label={`Ir a ${slide.title}`}
                onClick={() => goTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === selected
                    ? "w-7 bg-primary"
                    : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground">
            Arrastra, usa las flechas o toca una tarjeta para girar
          </p>
        </div>
      </div>
    </section>
  );
}
