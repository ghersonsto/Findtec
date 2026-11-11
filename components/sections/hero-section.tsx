"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ArrowRight,
  Code2,
  Server,
  Sparkles,
} from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useState, type MouseEvent } from "react";

import { SectionAnchor } from "@/components/section-anchor";
import { WhatsAppBadge } from "@/components/whatsapp-icon";
import { company, whatsappHref } from "@/lib/company";
import { startQuote } from "@/lib/quote";

/** Token brand local — evita fetch /api/design en el critical path del Hero. */
const HERO_CYAN = "#38bdf8";

const Hero3DEcosystem = dynamic(
  () => import("@/components/hero-3d-ecosystem").then((m) => m.Hero3DEcosystem),
  { ssr: false, loading: () => null },
);

/** Ventana tipo Flash Devs (chrome + imagen). */
function HeroWindow({
  src,
  alt,
  className,
  imgClassName,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/10 bg-[#0b1222] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ${className ?? ""}`}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-3 py-2">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 h-4 flex-1 rounded bg-white/5" />
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {priority ? (
          // LCP: WebP estático con fetchPriority — evita cola de /_next/image en 1ª visita
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            width={880}
            height={550}
            fetchPriority="high"
            decoding="async"
            className={`h-full w-full object-cover ${imgClassName ?? "object-top"}`}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 68vw, (max-width: 1024px) 50vw, 440px"
            loading="lazy"
            className={`object-cover ${imgClassName ?? "object-top"}`}
          />
        )}
      </div>
    </div>
  );
}

const HERO_TAGS = [
  {
    icon: Server,
    label: "Infraestructura",
    /** Parte superior + centro de la ventana trasera */
    pos: "top-[-6%] left-[40%] sm:top-[-12%] lg:top-[-22%]",
    z: 140,
    center: true,
    float: { y: 10, duration: 7, delay: 0 },
  },
  {
    icon: Code2,
    label: "Software",
    pos: "top-[12%] right-[4%] sm:top-[14%] sm:right-[6%]",
    z: 160,
    center: false,
    float: { y: 14, duration: 6, delay: 0.5 },
  },
  {
    icon: Sparkles,
    label: "IA",
    pos: "bottom-[4%] left-[44%] sm:bottom-[8%] sm:left-[48%]",
    z: 150,
    center: false,
    float: { y: 8, duration: 5, delay: 1 },
  },
] as const;

const SHOW_HERO_STACK = true;

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [allowWebGL, setAllowWebGL] = useState(false);
  /** Diferir Three.js hasta idle largo — no compite con LCP/FCP. */
  const [loadScene, setLoadScene] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const sync = () => setAllowWebGL(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!allowWebGL) {
      setLoadScene(false);
      return;
    }
    let cancelled = false;
    const start = () => {
      if (!cancelled) setLoadScene(true);
    };
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(start, { timeout: 4500 });
    } else {
      timeoutId = window.setTimeout(start, 2800);
    }
    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [allowWebGL]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 140, damping: 22, mass: 0.55 });
  const sy = useSpring(my, { stiffness: 140, damping: 22, mass: 0.55 });
  // Tilt original del día (antes de ajustes Flash)
  const rotateY = useTransform(sx, [-0.5, 0.5], [22, -22]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  const onPointerMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      const rect = event.currentTarget.getBoundingClientRect();
      mx.set((event.clientX - rect.left) / rect.width - 0.5);
      my.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [mx, my, reduceMotion],
  );

  const onPointerLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const onQuote = () => {
    startQuote({
      servicio: "software-gestion",
      label: "Cotización Findtec",
      mensaje: `Hola, deseo solicitar una cotización personalizada para mi empresa con ${company.name}.`,
    });
  };

  return (
    <section
      id="inicio"
      className="relative flex min-h-0 w-full items-center overflow-hidden bg-transparent pt-[5.25rem] pb-8 text-foreground sm:min-h-[90vh] sm:pt-28 sm:pb-12 lg:pt-28 lg:pb-16"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="aurora-glow absolute -top-[12%] left-[8%] h-[460px] w-[520px] opacity-80"
          style={{ background: `radial-gradient(circle, ${HERO_CYAN}55, transparent 70%)` }}
        />
        <div className="aurora-glow absolute -top-[8%] right-[6%] h-[540px] w-[600px]" />
        <div className="absolute bottom-0 left-1/2 h-[48%] w-[140%] -translate-x-1/2 [perspective:900px]">
          <div className="h-full w-full origin-bottom scale-y-[1.45] bg-[linear-gradient(to_right,rgba(37,99,235,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.12)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_top,black_10%,transparent_78%)] [transform:rotateX(64deg)] dark:bg-[linear-gradient(to_right,rgba(56,189,248,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.14)_1px,transparent_1px)]" />
        </div>
        <div className="hero-floor-glow" />
        {allowWebGL && loadScene && !sceneFailed ? (
          <div
            className={`absolute top-[6%] bottom-[18%] left-1/2 w-[min(72vw,760px)] -translate-x-1/2 transition-opacity duration-1000 ${
              sceneReady ? "opacity-[0.4] dark:opacity-[0.52]" : "opacity-0"
            }`}
          >
            <Hero3DEcosystem
              onReady={() => setSceneReady(true)}
              onFailure={() => setSceneFailed(true)}
            />
          </div>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-transparent to-transparent" />
        {/* Fundido al abyss compartido — más largo, sin barra opaca */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background from-[5%] via-background/35 to-transparent sm:h-56" />
      </div>

      <div className="container-pro relative z-10 w-full">
        <div className="grid items-start gap-12 sm:items-center sm:gap-14 lg:grid-cols-12 lg:items-center lg:gap-4">
          {/* Copy del Hero sin Motion: LCP/FCP no dependen de la hidratación. */}
          <div
            className={
              SHOW_HERO_STACK
                ? "relative z-20 max-w-xl lg:col-span-5"
                : "relative z-20 max-w-2xl lg:col-span-8"
            }
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-foreground shadow-sm backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.04]">
              <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
              FINDTEC SOLUCIONES
            </div>

            <h1 className="mt-4 font-display text-balance text-[clamp(1.85rem,7.2vw,2.35rem)] font-extrabold leading-[1.05] tracking-tight text-foreground sm:mt-5 sm:text-5xl lg:text-[3.55rem]">
              Ingeniería digital para{" "}
              <span className="bg-gradient-to-r from-sky-400 to-primary bg-clip-text text-transparent">
                operar con control
              </span>
            </h1>

            <p className="mt-3.5 max-w-[28rem] font-sans text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-[1.05rem]">
              Software de gestión, tiendas, plataformas a medida e infraestructura TI para empresas e
              instituciones en Perú.
            </p>

            <div className="mt-6 flex w-full flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <button
                type="button"
                onClick={onQuote}
                className="group btn-primary inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white transition-transform active:scale-[0.98] sm:w-auto"
              >
                <span>Solicitar cotización</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <a
                href={whatsappHref(
                  "Hola Findtec, deseo solicitar información y una cotización para mi empresa.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-[#25D366]/45 bg-[#25D366]/10 px-5 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:bg-[#25D366]/16 active:scale-[0.98] dark:bg-[#25D366]/12 sm:w-auto"
              >
                <WhatsAppBadge />
                <span>Escríbenos por WhatsApp</span>
              </a>
            </div>

            <div className="mt-4 flex flex-col items-start gap-1.5 sm:mt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1.5">
              <p className="max-w-[22rem] text-[11px] leading-snug text-muted-foreground sm:max-w-none sm:text-[12px]">
                Cotización personalizada y sin compromiso · Respuesta en menos de 24 h
              </p>
              <SectionAnchor
                id="proyectos"
                className="inline-flex min-h-10 items-center text-[12px] font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary sm:min-h-0"
              >
                Ver proyectos
              </SectionAnchor>
            </div>
          </div>

          {/* Stack 3D — temporalmente oculto (SHOW_HERO_STACK) */}
          {SHOW_HERO_STACK ? (
            <motion.div
              className="relative z-10 mx-auto mt-1 w-full max-w-[min(82%,248px)] pt-1 sm:mt-0 sm:max-w-[320px] sm:pt-2 md:max-w-[380px] lg:col-span-7 lg:ml-auto lg:mr-0 lg:max-w-[500px] lg:pt-0"
              style={{ perspective: 1600 }}
              onMouseMove={onPointerMove}
              onMouseLeave={onPointerLeave}
              initial={reduceMotion ? false : { y: 28 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 30, delay: 0.05 }}
            >
              <motion.div
                className="relative aspect-[16/12] [transform-style:preserve-3d] sm:aspect-[16/11]"
                style={
                  reduceMotion
                    ? { rotateY: -18, rotateX: 8 }
                    : { rotateX, rotateY }
                }
              >
                <div
                  aria-hidden
                  className="absolute inset-[10%] rounded-3xl bg-primary/25 blur-3xl"
                  style={{ transform: "translateZ(-100px)" }}
                />

                <div
                  className="absolute left-[4%] top-[-8%] w-[70%] sm:top-[-16%] sm:w-[72%] lg:top-[-28%]"
                  style={{ transform: "translateZ(-50px)" }}
                >
                  <motion.div
                    animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <HeroWindow
                      src="/images/findtec-service-cloud-hero.webp"
                      alt="Cloud e infraestructura Findtec"
                      className="opacity-90"
                    />
                  </motion.div>
                </div>

                <div
                  className="absolute right-[2%] top-[16%] w-[70%] sm:top-[14%] sm:w-[74%]"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <motion.div
                    animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    <HeroWindow
                      src="/images/findtec-service-erp-hero.webp"
                      alt="Software de gestión Findtec"
                      imgClassName="object-[center_72%]"
                      priority
                    />
                  </motion.div>
                </div>

                <div
                  className="absolute bottom-[4%] left-[12%] w-[40%] sm:bottom-[2%] sm:left-[14%] sm:w-[42%]"
                  style={{ transform: "translateZ(110px)" }}
                >
                  <motion.div
                    animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <HeroWindow
                      src="/images/findtec-service-ia-hero.webp"
                      alt="Integraciones con IA Findtec"
                    />
                  </motion.div>
                </div>

                {HERO_TAGS.map((tag, i) => {
                  const Icon = tag.icon;
                  return (
                    <div
                      key={tag.label}
                      className={`absolute hidden sm:block ${tag.pos}`}
                      style={{
                        transform: tag.center
                          ? `translate3d(-50%, 0, ${tag.z}px)`
                          : `translateZ(${tag.z}px)`,
                      }}
                    >
                      <motion.div
                        animate={
                          reduceMotion
                            ? undefined
                            : { y: [0, -tag.float.y, 0] }
                        }
                        transition={{
                          duration: tag.float.duration,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: tag.float.delay,
                        }}
                      >
                        <motion.div
                          aria-hidden
                          initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: reduceMotion ? 0 : 1 + i * 0.12,
                            type: "spring",
                            stiffness: 200,
                            damping: 16,
                          }}
                          className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-black/[0.08] bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-800 shadow-[0_12px_28px_-12px_rgba(15,23,42,0.35)] backdrop-blur-md dark:border-white/10 dark:bg-[#0b1222]/92 dark:text-zinc-100 dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.9)]"
                        >
                          <span className="flex size-5 items-center justify-center rounded-md bg-primary/15 text-primary dark:bg-primary/20 dark:text-sky-300">
                            <Icon className="size-3" />
                          </span>
                          {tag.label}
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
