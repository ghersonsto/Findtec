"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "motion/react";

const CYAN = "#00D9FF";
const BLUE_ELECTRIC = "#2563EB";
const BLUE_LIGHT = "#3B82F6";
const EMERALD = "#10B981";

interface MouseRef {
  x: number;
  y: number;
}

// Single high-detail futuristic server rack unit
function ServerRack({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  ledSeed = 0,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  ledSeed?: number;
}) {
  const meshRef = useRef<THREE.Group>(null);

  // Generate randomized blink phase for LED activity
  const ledStates = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      speed: 1.2 + ((ledSeed + i) % 4) * 0.7,
      color: i === 5 ? EMERALD : (i % 2 === 0 ? CYAN : BLUE_LIGHT),
    }));
  }, [ledSeed]);

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Outer Metallic Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.3, 2.7, 0.9]} />
        <meshStandardMaterial
          color="#060c18"
          metalness={0.92}
          roughness={0.22}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Recessed Server Faceplate */}
      <mesh position={[0, 0, 0.455]}>
        <boxGeometry args={[1.2, 2.58, 0.02]} />
        <meshStandardMaterial color="#0b1528" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Rack Mount Screws / Accents */}
      <mesh position={[-0.56, 0, 0.465]}>
        <boxGeometry args={[0.04, 2.55, 0.01]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.56, 0, 0.465]}>
        <boxGeometry args={[0.04, 2.55, 0.01]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Individual 1U/2U Server Blades */}
      {Array.from({ length: 7 }).map((_, i) => {
        const yPos = 1.05 - i * 0.35;
        return (
          <group key={i} position={[0, yPos, 0.47]}>
            {/* Blade body */}
            <mesh>
              <boxGeometry args={[1.08, 0.28, 0.04]} />
              <meshStandardMaterial
                color="#071224"
                metalness={0.85}
                roughness={0.25}
              />
            </mesh>

            {/* LED Status Array */}
            <mesh position={[-0.38, 0, 0.025]}>
              <boxGeometry args={[0.18, 0.03, 0.01]} />
              <meshStandardMaterial
                color={ledStates[i % ledStates.length].color}
                emissive={ledStates[i % ledStates.length].color}
                emissiveIntensity={1.8}
              />
            </mesh>

            {/* Ventilation Grill Texture Bar */}
            <mesh position={[0.12, 0, 0.025]}>
              <boxGeometry args={[0.55, 0.14, 0.005]} />
              <meshStandardMaterial
                color="#030712"
                metalness={0.5}
                roughness={0.7}
              />
            </mesh>

            {/* Power LED Indicator */}
            <mesh position={[0.46, 0, 0.025]}>
              <circleGeometry args={[0.018, 16]} />
              <meshBasicMaterial color={EMERALD} />
            </mesh>
          </group>
        );
      })}

      {/* Top Exhaust Vent with Cyan Glow */}
      <mesh position={[0, 1.36, 0]}>
        <boxGeometry args={[1.1, 0.02, 0.7]} />
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

// Particle field of floating digital telemetry
function DataParticles({ count = 60 }: { count?: number }) {
  const particles = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.03;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={CYAN}
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Floor Grid Plane with reflective metallic texture
function ServerRoomFloor() {
  return (
    <group position={[0, -1.8, 0]}>
      {/* Dark Reflective Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[25, 25]} />
        <meshStandardMaterial
          color="#040914"
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>

      {/* Technical Grid Overlay */}
      <gridHelper
        args={[24, 24, CYAN, "#0b1c36"]}
        position={[0, 0.01, 0]}
      />
    </group>
  );
}

// Scene Root with Cursor-driven Camera Parallax
function DataCenterScene({ mouseRef }: { mouseRef: React.MutableRefObject<MouseRef> }) {
  const sceneGroup = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!sceneGroup.current) return;

    // Subtle breathing float
    const elapsed = state.clock.elapsedTime;
    const idleY = Math.sin(elapsed * 0.6) * 0.06;

    // Cursor parallax lerp
    const targetRotY = mouseRef.current.x * 0.28;
    const targetRotX = -mouseRef.current.y * 0.18;

    sceneGroup.current.rotation.y += (targetRotY - sceneGroup.current.rotation.y) * delta * 2.2;
    sceneGroup.current.rotation.x += (targetRotX - sceneGroup.current.rotation.x) * delta * 2.2;
    sceneGroup.current.position.y = idleY;
  });

  return (
    <group ref={sceneGroup}>
      {/* Ambient Lighting */}
      <ambientLight intensity={0.6} color="#0d1b33" />

      {/* Main Blue Electric Key Light */}
      <spotLight
        position={[4, 6, 6]}
        angle={0.6}
        penumbra={0.8}
        intensity={2.8}
        color={BLUE_LIGHT}
        castShadow
        shadow-bias={-0.0001}
      />

      {/* Cyan Rim Accent Light */}
      <pointLight position={[-5, 3, -2]} intensity={2.2} color={CYAN} />

      {/* Volumetric Under-glow */}
      <pointLight position={[0, -1.2, 2]} intensity={1.8} color={BLUE_ELECTRIC} />

      {/* Central Server Rack Array */}
      {/* Center Main Unit */}
      <ServerRack position={[0, 0, 0]} scale={1.12} ledSeed={1} />

      {/* Left Supporting Rack (Slightly Angled) */}
      <ServerRack
        position={[-1.75, -0.15, -0.55]}
        rotation={[0, 0.28, 0]}
        scale={0.96}
        ledSeed={4}
      />

      {/* Right Supporting Rack (Slightly Angled) */}
      <ServerRack
        position={[1.75, -0.15, -0.55]}
        rotation={[0, -0.28, 0]}
        scale={0.96}
        ledSeed={7}
      />

      {/* Deep Background Racks to give true scale */}
      <ServerRack
        position={[-3.3, -0.3, -1.8]}
        rotation={[0, 0.45, 0]}
        scale={0.82}
        ledSeed={9}
      />
      <ServerRack
        position={[3.3, -0.3, -1.8]}
        rotation={[0, -0.45, 0]}
        scale={0.82}
        ledSeed={12}
      />

      {/* Cyber Floating Particles */}
      <DataParticles count={70} />

      {/* Technical Floor */}
      <ServerRoomFloor />
    </group>
  );
}

// Fallback high-fidelity 2.5D visual for low-end / mobile devices
function DataCenterFallback() {
  return (
    <div className="relative w-full h-full min-h-[440px] flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_45%,rgba(37,99,235,0.22),transparent)]" />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-gradient-to-b from-[#0b1528]/90 via-[#07101f]/95 to-[#040813] p-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>FINDTEC :: CLOUD RACK HA</span>
          </div>
          <span className="text-cyan-400 font-semibold">ONLINE</span>
        </div>

        <div className="mt-5 space-y-3">
          {[
            { label: "Blade 01: Core ERP & Facturación", val: "SUNAT OK", col: "text-emerald-400" },
            { label: "Blade 02: Pipeline IA & FastAPI", val: "142 ms", col: "text-cyan-400" },
            { label: "Blade 03: Docker Clúster Nodos", val: "4 Activos", col: "text-blue-400" },
            { label: "Blade 04: VPN & Seguridad TI", val: "Cifrado", col: "text-emerald-400" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs"
            >
              <span className="text-zinc-300 font-medium">{item.label}</span>
              <span className={`font-mono text-[11px] font-semibold ${item.col}`}>{item.val}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span>SLA 99.98% · RUC 20613828606</span>
          <span className="text-cyan-400">LIMA (GMT-5)</span>
        </div>
      </div>
    </div>
  );
}

export function HeroDataCenterCanvas() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mouseRef = useRef<MouseRef>({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  if (!mounted || reduceMotion || isMobile) {
    return <DataCenterFallback />;
  }

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] select-none">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 5.2], fov: 42, near: 0.1, far: 50 }}
        gl={{ powerPreference: "high-performance", alpha: true, antialias: true }}
        className="h-full w-full touch-none cursor-grab active:cursor-grabbing"
      >
        <DataCenterScene mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
