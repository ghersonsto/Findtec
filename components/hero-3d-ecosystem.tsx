"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import {
  Component,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  MathUtils,
  Vector2,
  type Group,
  type Mesh,
  type OrthographicCamera,
} from "three";

/** Paleta corporativa Findtec (Electric Blue). */
const C = {
  primary: "#2563eb",
  primaryDark: "#1d4ed8",
  sky: "#38bdf8",
  soft: "#60a5fa",
  navy: "#0f172a",
  slate: "#1e3a5f",
  mist: "#e0f2fe",
} as const;

type Trace = { points: Array<[number, number]>; accent: boolean; layer: 0 | 1 };

function buildTraces(dense: boolean): Trace[] {
  const core: Trace[] = [
    { points: [[-3.4, 0], [-0.95, 0], [0.95, 0], [3.4, 0]], accent: true, layer: 1 },
    { points: [[0, -2.9], [0, -0.95], [0, 0.95], [0, 2.9]], accent: true, layer: 1 },
    { points: [[-3.4, 1.9], [-1.95, 1.9], [-1.95, 0]], accent: false, layer: 0 },
    { points: [[3.4, 1.9], [1.95, 1.9], [1.95, 0]], accent: false, layer: 0 },
    { points: [[-3.4, -1.9], [-1.95, -1.9], [-1.95, 0]], accent: false, layer: 0 },
    { points: [[3.4, -1.9], [1.95, -1.9], [1.95, 0]], accent: false, layer: 0 },
    { points: [[-2.55, 2.75], [-2.55, 1.05], [-0.95, 1.05]], accent: true, layer: 1 },
    { points: [[2.55, 2.75], [2.55, 1.05], [0.95, 1.05]], accent: true, layer: 1 },
    { points: [[-2.55, -2.75], [-2.55, -1.05], [-0.95, -1.05]], accent: false, layer: 0 },
    { points: [[2.55, -2.75], [2.55, -1.05], [0.95, -1.05]], accent: false, layer: 0 },
    { points: [[-1.95, 1.9], [-0.95, 0.95]], accent: true, layer: 1 },
    { points: [[1.95, 1.9], [0.95, 0.95]], accent: true, layer: 1 },
    { points: [[-1.95, -1.9], [-0.95, -0.95]], accent: false, layer: 0 },
    { points: [[1.95, -1.9], [0.95, -0.95]], accent: false, layer: 0 },
  ];

  if (!dense) return core;

  return [
    ...core,
    { points: [[-3.4, 0], [-3.4, 1.15], [-4.05, 1.15]], accent: false, layer: 0 },
    { points: [[3.4, 0], [3.4, -1.15], [4.05, -1.15]], accent: false, layer: 0 },
    { points: [[0, 2.9], [1.2, 2.9], [1.2, 3.4]], accent: true, layer: 1 },
    { points: [[0, -2.9], [-1.2, -2.9], [-1.2, -3.4]], accent: true, layer: 1 },
  ];
}

function buildHubs(dense: boolean): Array<[number, number, number]> {
  const base: Array<[number, number, number]> = [
    [-1.95, 1.9, 0.075],
    [1.95, 1.9, 0.075],
    [-1.95, -1.9, 0.075],
    [1.95, -1.9, 0.075],
    [-2.55, 2.75, 0.06],
    [2.55, 2.75, 0.06],
    [-2.55, -2.75, 0.06],
    [2.55, -2.75, 0.06],
    [-3.4, 0, 0.07],
    [3.4, 0, 0.07],
    [0, 2.9, 0.07],
    [0, -2.9, 0.07],
  ];
  if (!dense) return base;
  return [...base, [-4.05, 1.15, 0.055], [4.05, -1.15, 0.055], [1.2, 3.4, 0.055], [-1.2, -3.4, 0.055]];
}

function FrameCamera({
  pointer,
  moving,
  compact,
}: {
  pointer: Vector2;
  moving: boolean;
  compact: boolean;
}) {
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    const cam = camera as OrthographicCamera;
    // Encuadre que deja aire a izquierda/derecha (zonas copy / stack)
    cam.position.set(5.4, 5.1, 5.6);
    cam.up.set(0, 1, 0);
    cam.lookAt(0.15, -0.15, 0.1);
    const zoom = Math.min(
      size.width / (compact ? 10.4 : 12.6),
      size.height / (compact ? 6.8 : 8.2),
      compact ? 86 : 78,
    );
    cam.zoom = zoom;
    cam.near = -50;
    cam.far = 50;
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height, compact]);

  useFrame((_, delta) => {
    if (!moving) return;
    const cam = camera as OrthographicCamera;
    cam.position.x = MathUtils.damp(cam.position.x, 5.4 + pointer.x * 0.22, 6, delta);
    cam.position.y = MathUtils.damp(cam.position.y, 5.1 + pointer.y * -0.14, 6, delta);
    cam.lookAt(0.15 + pointer.x * 0.08, -0.15, 0.1);
  });

  return null;
}

/** Suelo digital con fade atmosférico hacia el horizonte. */
function TechFloor({ dark, compact }: { dark: boolean; compact: boolean }) {
  const color = dark ? C.sky : C.primary;
  const span = compact ? 5.2 : 6.4;
  const step = compact ? 0.85 : 0.72;
  const lines = useMemo(() => {
    const list: Array<{ axis: "x" | "z"; pos: number; opacity: number }> = [];
    for (let i = -span; i <= span + 0.01; i += step) {
      const dist = Math.abs(i) / span;
      const opacity = Math.max(0.02, (dark ? 0.14 : 0.09) * (1 - dist * 0.85));
      list.push({ axis: "x", pos: i, opacity });
      list.push({ axis: "z", pos: i, opacity });
    }
    return list;
  }, [span, step, dark]);

  return (
    <group position={[0, -0.02, 0.35]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[span * 2.1, span * 2.1]} />
        <meshBasicMaterial
          color={dark ? C.navy : C.soft}
          transparent
          opacity={dark ? 0.04 : 0.025}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {lines.map((line, index) =>
        line.axis === "x" ? (
          <mesh key={`fx-${index}`} position={[0, 0.004, line.pos]}>
            <boxGeometry args={[span * 2, 0.004, 0.01]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={line.opacity}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ) : (
          <mesh key={`fz-${index}`} position={[line.pos, 0.004, 0]}>
            <boxGeometry args={[0.01, 0.004, span * 2]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={line.opacity}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ),
      )}
      {/* Horizonte suave */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, -span * 0.55]}>
        <planeGeometry args={[span * 1.6, 0.8]} />
        <meshBasicMaterial
          color={C.primary}
          transparent
          opacity={dark ? 0.06 : 0.04}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function ComputeCore({ dark, reduced }: { dark: boolean; reduced: boolean }) {
  const group = useRef<Group>(null);
  const shell = dark ? C.slate : "#64748b";
  const face = C.primary;
  const glow = dark ? C.sky : C.primary;

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    if (!reduced) {
      group.current.rotation.y = MathUtils.damp(group.current.rotation.y, t * 0.12, 2, delta);
      const s = 1 + Math.sin(t * 1.4) * 0.012;
      group.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group} position={[0, 0.22, 0]}>
      <mesh position={[0, -0.1, 0]} castShadow={false}>
        <boxGeometry args={[1.28, 0.07, 1.28]} />
        <meshStandardMaterial
          color={shell}
          metalness={0.55}
          roughness={0.32}
          transparent
          opacity={dark ? 0.72 : 0.42}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[0.98, 0.28, 0.98]} />
        <meshStandardMaterial
          color={face}
          metalness={0.35}
          roughness={0.38}
          transparent
          opacity={dark ? 0.78 : 0.58}
          envMapIntensity={0.6}
        />
      </mesh>
      {/* Micro-detalle: ranuras */}
      {[-0.28, 0, 0.28].map((z) => (
        <mesh key={z} position={[0, 0.16, z]}>
          <boxGeometry args={[0.72, 0.018, 0.04]} />
          <meshBasicMaterial color={glow} transparent opacity={dark ? 0.45 : 0.32} toneMapped={false} />
        </mesh>
      ))}
      {[0.18, 0.3, 0.42].map((y, i) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[0.78 - i * 0.07, 0.05, 0.78 - i * 0.07]} />
          <meshStandardMaterial
            color={i === 1 ? glow : face}
            metalness={0.4}
            roughness={0.28}
            transparent
            opacity={dark ? 0.5 - i * 0.06 : 0.36 - i * 0.05}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[0.34, 0.07, 0.34]} />
        <meshBasicMaterial color={glow} transparent opacity={dark ? 0.7 : 0.5} toneMapped={false} />
      </mesh>
      {/* Halo discreto */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.14, 0]}>
        <ringGeometry args={[0.75, 1.05, 48]} />
        <meshBasicMaterial
          color={C.primary}
          transparent
          opacity={dark ? 0.16 : 0.1}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function EnterpriseScene({
  dark,
  moving,
  pointer,
  compact,
  reduced,
  onReady,
}: {
  dark: boolean;
  moving: boolean;
  pointer: Vector2;
  compact: boolean;
  reduced: boolean;
  onReady: () => void;
}) {
  const root = useRef<Group>(null);
  const packets = useRef<Group>(null);
  const ready = useRef(false);
  const t = useRef(0);

  const traces = useMemo(() => buildTraces(!compact), [compact]);
  const hubs = useMemo(() => buildHubs(!compact), [compact]);

  const major = dark ? C.sky : C.primary;
  const minor = dark ? C.soft : C.primaryDark;
  const accent = dark ? C.sky : C.primary;

  const segments = useMemo(() => {
    const list: Array<{
      ax: number; az: number; bx: number; bz: number;
      accent: boolean; layer: 0 | 1; len: number; rot: number; mx: number; mz: number;
    }> = [];
    for (const trace of traces) {
      for (let i = 0; i < trace.points.length - 1; i += 1) {
        const [ax, az] = trace.points[i];
        const [bx, bz] = trace.points[i + 1];
        const dx = bx - ax;
        const dz = bz - az;
        const len = Math.hypot(dx, dz);
        if (len < 0.01) continue;
        list.push({
          ax, az, bx, bz,
          accent: trace.accent,
          layer: trace.layer,
          len,
          rot: -Math.atan2(dz, dx),
          mx: (ax + bx) / 2,
          mz: (az + bz) / 2,
        });
      }
    }
    return list;
  }, [traces]);

  useFrame((_, delta) => {
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
    t.current += Math.min(delta, 0.05);
    const time = t.current;

    if (root.current && moving && !reduced) {
      root.current.rotation.y = MathUtils.damp(root.current.rotation.y, pointer.x * 0.06, 6, delta);
      root.current.rotation.x = MathUtils.damp(root.current.rotation.x, pointer.y * 0.035, 6, delta);
      root.current.position.y = Math.sin(time * 0.55) * 0.025;
    }

    if (!moving || reduced || !packets.current) return;
    const packetSegs = segments.filter((s) => s.accent);
    packets.current.children.forEach((child, index) => {
      const seg = packetSegs[index % Math.max(packetSegs.length, 1)];
      if (!seg) return;
      const u = (time * 0.28 + index * 0.14) % 1;
      child.position.set(
        MathUtils.lerp(seg.ax, seg.bx, u),
        0.08 + seg.layer * 0.04,
        MathUtils.lerp(seg.az, seg.bz, u),
      );
      const s = 0.55 + Math.sin(u * Math.PI) * 0.35;
      (child as Mesh).scale.setScalar(s);
    });
  });

  return (
    <group ref={root} position={[0.1, -0.05, 0.15]} scale={compact ? 0.82 : 0.9}>
      <ambientLight intensity={dark ? 0.48 : 0.68} />
      <hemisphereLight args={[dark ? "#dbeafe" : "#f8fafc", dark ? C.navy : "#94a3b8", dark ? 0.45 : 0.55]} />
      <directionalLight position={[-3.5, 7.5, 4]} intensity={dark ? 1.45 : 1.65} color="#f8fafc" />
      <directionalLight position={[4.5, 2.5, -3]} intensity={0.55} color={C.soft} />

      <TechFloor dark={dark} compact={compact} />

      {segments.map((seg, index) => {
        const y = 0.035 + seg.layer * 0.045;
        const thick = 0.018;
        const opacity = dark
          ? seg.accent
            ? 0.48
            : 0.22
          : seg.accent
            ? 0.36
            : 0.16;
        return (
          <mesh key={index} position={[seg.mx, y, seg.mz]} rotation={[0, seg.rot, 0]}>
            <boxGeometry args={[seg.len, 0.012, thick]} />
            <meshBasicMaterial
              color={seg.accent ? accent : minor}
              transparent
              opacity={opacity}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        );
      })}

      {hubs.map(([x, z, r], index) => (
        <group key={`h-${index}`} position={[x, 0.07, z]}>
          <mesh>
            <cylinderGeometry args={[r, r, 0.04, 16]} />
            <meshBasicMaterial
              color={major}
              transparent
              opacity={dark ? 0.55 : 0.4}
              toneMapped={false}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.008, 0]}>
            <ringGeometry args={[r * 1.2, r * 1.45, 20]} />
            <meshBasicMaterial
              color={C.primary}
              transparent
              opacity={dark ? 0.18 : 0.12}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      <ComputeCore dark={dark} reduced={reduced} />

      <group ref={packets} visible={moving && !reduced}>
        {Array.from({ length: compact ? 5 : 7 }, (_, index) => (
          <mesh key={index}>
            <boxGeometry args={[0.06, 0.028, 0.06]} />
            <meshBasicMaterial
              color={index % 2 ? C.mist : C.sky}
              transparent
              opacity={dark ? 0.55 : 0.4}
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function Hero3DEcosystem({ onReady, onFailure }: { onReady: () => void; onFailure: () => void }) {
  const { resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const region = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [compact, setCompact] = useState(false);
  const [pointer] = useState(() => new Vector2());
  const moving = visible && !reducedMotion;

  useEffect(() => {
    const target = region.current;
    if (!target) return;

    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.08,
    });
    io.observe(target);

    const ro = new ResizeObserver(([entry]) => {
      setCompact(entry.contentRect.width < 640);
    });
    ro.observe(target);

    return () => {
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  // Parallax global sin capturar clics del Hero (capa decorativa)
  useEffect(() => {
    if (!moving) return;
    const onMove = (event: PointerEvent) => {
      const el = region.current;
      if (!el) return;
      const bounds = el.getBoundingClientRect();
      if (bounds.width < 1 || bounds.height < 1) return;
      pointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -(((event.clientY - bounds.top) / bounds.height) * 2 - 1),
      );
    };
    const onLeave = () => pointer.set(0, 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
    };
  }, [moving, pointer]);

  return (
    <div ref={region} className="pointer-events-none absolute inset-0" aria-hidden>
      <SceneBoundary onFailure={onFailure}>
        <Canvas
          orthographic
          camera={{ position: [5.4, 5.1, 5.6], zoom: 78, near: -50, far: 50 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
            premultipliedAlpha: false,
            stencil: false,
          }}
          dpr={[1, 1.5]}
          frameloop={moving ? "always" : "demand"}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
          style={{ width: "100%", height: "100%", background: "transparent", pointerEvents: "none" }}
        >
          <FrameCamera pointer={pointer} moving={moving} compact={compact} />
          <EnterpriseScene
            dark={resolvedTheme !== "light"}
            moving={moving}
            pointer={pointer}
            compact={compact}
            reduced={!!reducedMotion}
            onReady={onReady}
          />
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
