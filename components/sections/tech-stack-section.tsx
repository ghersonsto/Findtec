"use client";

import Image from "next/image";
import {
  Bot,
  Box,
  Braces,
  Code2,
  Container,
  Database,
  Server,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";

import { Reveal } from "@/components/reveal";
import { useSiteStatus } from "@/hooks/use-site-status";

const stackMeta: Record<
  string,
  { role: string; detail: string; icon: LucideIcon; image: string }
> = {
  Laravel: {
    role: "Backend ERP",
    detail: "APIs y sistemas de gestión con arquitectura clara",
    icon: Code2,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
  },
  "Vue.js": {
    role: "Frontend ágil",
    detail: "Interfaces productivas para operación diaria",
    icon: Braces,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  },
  MySQL: {
    role: "Datos relacionales",
    detail: "MySQL 8.0 para ventas, inventarios y permisos",
    icon: Database,
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=80",
  },
  Docker: {
    role: "Despliegue estable",
    detail: "Entornos reproducibles con Docker Compose",
    icon: Container,
    image:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=900&q=80",
  },
  Python: {
    role: "Datos e IA",
    detail: "Automatización, análisis y modelos predictivos",
    icon: Workflow,
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80",
  },
  FastAPI: {
    role: "APIs de IA",
    detail: "Servicios predictivos en tiempo real",
    icon: Server,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
  },
  IA: {
    role: "Inteligencia útil",
    detail: "Asistentes, predicción y flujos inteligentes",
    icon: Bot,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
  },
  "Microsoft 365": {
    role: "Operación diaria",
    detail: "Power Automate, SharePoint, tickets y colaboración",
    icon: Box,
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80",
  },
};

const defaultStack = [
  "Laravel",
  "Vue.js",
  "MySQL",
  "Docker",
  "Python",
  "FastAPI",
  "Microsoft 365",
];

const pillSpring = { type: "spring" as const, stiffness: 400, damping: 28, mass: 0.8 };

type StackItem = {
  name: string;
  role: string;
  detail: string;
  icon: LucideIcon;
  image: string;
};

function setTrackPaused(node: HTMLDivElement | null, paused: boolean) {
  node?.getAnimations().forEach((animation) => {
    if (paused) animation.pause();
    else void animation.play();
  });
}

function TechPill({ item, reduceMotion }: { item: StackItem; reduceMotion: boolean | null }) {
  const Icon = item.icon;

  return (
    <motion.li
      title={`${item.role}. ${item.detail}`}
      whileHover={reduceMotion ? undefined : { scale: 1.05 }}
      transition={pillSpring}
      className="group flex shrink-0 items-center gap-2.5 rounded-full border border-black/[0.06] bg-white px-3 py-2 shadow-sm backdrop-blur-sm dark:border-white/[0.08] dark:bg-zinc-900/40 dark:shadow-none"
    >
      <span className="relative h-6 w-6 overflow-hidden rounded-md">
        <Image src={item.image} alt="" fill className="object-cover" sizes="24px" />
      </span>
      <Icon
        className="h-3.5 w-3.5 text-zinc-500 group-hover:text-[#3b82f6] group-hover:brightness-125"
        aria-hidden
      />
      <span className="whitespace-nowrap text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {item.name}
      </span>
    </motion.li>
  );
}

export function TechStackSection() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { status } = useSiteStatus();
  const names = status.stack.length ? status.stack : defaultStack;

  const items = names.map((name) => {
    const meta = stackMeta[name] ?? {
      role: "Stack Findtec",
      detail: "Parte de nuestro stack de implementación",
      icon: Code2,
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
    };
    return { name, ...meta };
  });

  return (
    <section id="tecnologias" className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 gradient-radial opacity-50" />
      <div className="absolute inset-0 grid-pattern opacity-25" />

      <div className="container-pro relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Stack tecnológico
          </p>
          <h2 className="font-display mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Tecnologías con las que construimos
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Laravel, Vue.js, MySQL, Docker, Python, FastAPI y Microsoft 365 —
            stack probado en ERP, APIs de IA e infraestructura.
          </p>
        </Reveal>

      </div>

      {reduceMotion ? (
        <ul className="container-pro relative mt-10 flex flex-wrap justify-center gap-3 sm:mt-12">
          {items.map((item) => (
            <TechPill key={item.name} item={item} reduceMotion />
          ))}
        </ul>
      ) : (
        <div
          className="relative mt-10 overflow-hidden py-3 sm:mt-12 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
          onMouseEnter={() => setTrackPaused(trackRef.current, true)}
          onMouseLeave={() => setTrackPaused(trackRef.current, false)}
        >
          <motion.div
            ref={trackRef}
            className="flex w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          >
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
                className="flex shrink-0 items-center gap-3 pr-3"
              >
                {items.map((item) => (
                  <TechPill
                    key={`${item.name}-${copy}`}
                    item={item}
                    reduceMotion={false}
                  />
                ))}
              </ul>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
}
