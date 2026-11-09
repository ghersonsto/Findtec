<script setup lang="ts">
import { useGLTF } from "@tresjs/cientos";
import { useLoop } from "@tresjs/core";
import type { Object3D } from "three";
import { onMounted, onUnmounted, ref, shallowRef, watch } from "vue";

const props = withDefaults(
  defineProps<{
    /** Ruta pública del modelo .gltf / .glb */
    modelUrl?: string;
    /** Escala uniforme del modelo */
    scale?: number;
    /** Amplitud máxima de rotación en Y (radianes) */
    rotateAmplitude?: number;
    /** Velocidad de suavizado (mayor = responde más rápido) */
    lerpSpeed?: number;
  }>(),
  {
    modelUrl: "/models/server.gltf",
    scale: 1,
    rotateAmplitude: Math.PI * 0.45,
    lerpSpeed: 4,
  },
);

const { state, isLoading } = useGLTF(props.modelUrl);
const modelRef = shallowRef<Object3D | null>(null);

const targetRotationY = ref(0);
const currentRotationY = ref(0);

watch(
  () => state.value?.scene,
  (scene) => {
    if (!scene) return;
    scene.scale.setScalar(props.scale);
    modelRef.value = scene;
  },
  { immediate: true },
);

onMounted(() => {
  const onPointerMove = (event: PointerEvent) => {
    const normalizedX = event.clientX / window.innerWidth - 0.5;
    targetRotationY.value = normalizedX * props.rotateAmplitude * 2;
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  onUnmounted(() => {
    window.removeEventListener("pointermove", onPointerMove);
  });
});

const { onBeforeRender } = useLoop();

onBeforeRender(({ delta, elapsed }) => {
  const model = modelRef.value;
  if (!model) return;

  // Interpolación exponencial: rotación Y suave según el mouse
  const t = 1 - Math.exp(-props.lerpSpeed * delta);
  currentRotationY.value += (targetRotationY.value - currentRotationY.value) * t;
  model.rotation.y = currentRotationY.value;

  // Servidor flotante
  model.position.y = Math.sin(elapsed * 1.15) * 0.12;
});
</script>

<template>
  <primitive v-if="state?.scene" :object="state.scene" />

  <!-- Placeholder mientras carga o si falta el archivo -->
  <TresMesh v-else-if="!isLoading" :position="[0, 0, 0]">
    <TresBoxGeometry :args="[1.1, 1.7, 0.75]" />
    <TresMeshStandardMaterial color="#1e3a8a" :metalness="0.4" :roughness="0.35" />
  </TresMesh>
</template>
