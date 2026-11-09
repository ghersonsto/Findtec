"use client";

import { Environment, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, type MutableRefObject } from "react";
import type { Group } from "three";

/** Opcional: define NEXT_PUBLIC_HERO_MODEL=/models/server.glb cuando tengas el archivo */
const MODEL_URL = process.env.NEXT_PUBLIC_HERO_MODEL?.trim() || "";
const CYAN = "#22d3ee";
const KEY_BLUE = "#38bdf8";

type MouseState = { x: number };

function usePointerNorm() {
  const mouse = useRef<MouseState>({ x: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      mouse.current.x = event.clientX / window.innerWidth - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return mouse;
}

function useYFollow(mouse: MutableRefObject<MouseState>, amplitude = Math.PI * 0.45) {
  const group = useRef<Group>(null);
  const currentY = useRef(0);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;
    const target = mouse.current.x * amplitude * 2;
    const t = 1 - Math.exp(-4 * delta);
    currentY.current += (target - currentY.current) * t;
    node.rotation.y = currentY.current;
    node.position.y = Math.sin(state.clock.elapsedTime * 1.15) * 0.12;
  });

  return group;
}

/** Servidor rack procedural — siempre disponible en producción */
function ProceduralServer({ mouse }: { mouse: MutableRefObject<MouseState> }) {
  const group = useYFollow(mouse);

  return (
    <group ref={group} scale={1.05}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.25, 1.85, 0.72]} />
        <meshStandardMaterial color="#0b1220" metalness={0.55} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0, 0.365]}>
        <boxGeometry args={[1.18, 1.78, 0.02]} />
        <meshStandardMaterial color="#111827" metalness={0.4} roughness={0.45} />
      </mesh>
      {Array.from({ length: 7 }).map((_, index) => (
        <mesh key={index} position={[0, 0.72 - index * 0.24, 0.38]}>
          <boxGeometry args={[0.95, 0.07, 0.03]} />
          <meshStandardMaterial
            color={CYAN}
            emissive={CYAN}
            emissiveIntensity={index % 2 === 0 ? 1.1 : 0.45}
            metalness={0.2}
            roughness={0.25}
          />
        </mesh>
      ))}
      <mesh position={[0.42, 0.82, 0.4]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[-0.42, -0.95, 0]}>
        <boxGeometry args={[0.18, 0.08, 0.55]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.42, -0.95, 0]}>
        <boxGeometry args={[0.18, 0.08, 0.55]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function GltfServer({
  url,
  mouse,
}: {
  url: string;
  mouse: MutableRefObject<MouseState>;
}) {
  const { scene } = useGLTF(url);
  const group = useYFollow(mouse);

  return (
    <group ref={group} scale={1.15}>
      <primitive object={scene} />
    </group>
  );
}

function SceneContent({
  modelUrl,
  reduceMotion,
}: {
  modelUrl: string | null;
  reduceMotion: boolean;
}) {
  const mouse = usePointerNorm();

  useEffect(() => {
    if (!reduceMotion) return;
    mouse.current.x = 0;
  }, [mouse, reduceMotion]);

  return (
    <>
      <color attach="background" args={["#05080f"]} />
      <ambientLight color={CYAN} intensity={0.9} />
      <hemisphereLight args={[KEY_BLUE, "#0b1220", 0.55]} />
      <directionalLight color={KEY_BLUE} intensity={1.4} position={[3.5, 4.5, 2.5]} castShadow />
      <directionalLight color={CYAN} intensity={0.5} position={[-2.5, 1.5, -2]} />
      <spotLight color={CYAN} intensity={1.1} position={[0, 4, 2]} angle={0.45} penumbra={0.6} />

      <Suspense fallback={<ProceduralServer mouse={mouse} />}>
        {modelUrl ? <GltfServer url={modelUrl} mouse={mouse} /> : <ProceduralServer mouse={mouse} />}
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]} receiveShadow>
        <circleGeometry args={[2.4, 64]} />
        <meshStandardMaterial color="#0b1220" metalness={0.2} roughness={0.85} />
      </mesh>

      <Environment preset="city" environmentIntensity={0.22} />
    </>
  );
}

type HeroServerCanvasProps = {
  className?: string;
  reduceMotion?: boolean;
};

export function HeroServerCanvas({ className, reduceMotion = false }: HeroServerCanvasProps) {
  const modelUrl = MODEL_URL || null;

  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.45, 4.1], fov: 40, near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: false }}
        className="h-full w-full touch-none"
      >
        <SceneContent modelUrl={modelUrl} reduceMotion={Boolean(reduceMotion)} />
      </Canvas>
    </div>
  );
}
