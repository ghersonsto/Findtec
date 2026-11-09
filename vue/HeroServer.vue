<script setup lang="ts">
/**
 * Hero 3D con TresJS — servidor flotante .GLTF
 *
 * Dependencias:
 *   npm i vue three @tresjs/core @tresjs/cientos
 *
 * Coloca tu modelo en: public/models/server.gltf
 *
 * Uso:
 *   <HeroServer model-url="/models/server.gltf" />
 */
import { TresCanvas } from "@tresjs/core";

import FloatingServerModel from "./FloatingServerModel.vue";

const props = withDefaults(
  defineProps<{
    modelUrl?: string;
    /** Color de fondo del canvas (hex) */
    clearColor?: string;
    className?: string;
  }>(),
  {
    modelUrl: "/models/server.gltf",
    clearColor: "#05080f",
    className: "",
  },
);

/** Azul cian — alineado con acento Findtec / Electric Blue cyan */
const ambientCyan = "#22d3ee";
const keyBlue = "#38bdf8";
</script>

<template>
  <section
    class="relative isolate min-h-[min(72vh,640px)] w-full overflow-hidden"
    :class="props.className"
    aria-label="Hero 3D — infraestructura Findtec"
  >
    <TresCanvas
      :clear-color="props.clearColor"
      shadows
      class="absolute inset-0 h-full w-full"
    >
      <TresPerspectiveCamera :position="[0, 0.6, 4.2]" :fov="42" :near="0.1" :far="100" />

      <!-- Luz ambiental azul cian -->
      <TresAmbientLight :color="ambientCyan" :intensity="0.85" />

      <!-- Relleno cian suave desde arriba -->
      <TresHemisphereLight :args="[keyBlue, '#0b1220', 0.55]" />

      <!-- Acento direccional para volumen del servidor -->
      <TresDirectionalLight
        :color="keyBlue"
        :intensity="1.35"
        :position="[3.5, 4.5, 2.5]"
        cast-shadow
      />
      <TresDirectionalLight :color="ambientCyan" :intensity="0.45" :position="[-2.5, 1.5, -2]" />

      <FloatingServerModel :model-url="props.modelUrl" :scale="1" />
    </TresCanvas>

    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#05080f] via-[#05080f]/40 to-transparent px-6 pb-10 pt-24"
    >
      <p class="font-mono text-[10px] tracking-widest text-cyan-400/80 uppercase">
        Infraestructura 3D
      </p>
      <h1 class="mt-2 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Servidor en operación
      </h1>
      <p class="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
        Mueve el cursor para rotar el modelo. Escena TresJS con luz ambiental cian.
      </p>
    </div>
  </section>
</template>
