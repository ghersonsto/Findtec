import { NextResponse } from "next/server";

import { company } from "@/lib/company";
import { heroReel } from "@/lib/media";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

/** API de diseño / motion 3D para el front (tokens + capas + tilt). */
export async function GET(request: Request) {
  const limited = rateLimit(`design:${clientIp(request)}`, 60, 60_000);
  if (!limited.ok) return rateLimitResponse(limited.retryAfterSec);

  return NextResponse.json({
    ok: true,
    brand: {
      name: company.name,
      mark: "/icon.svg",
      primary: "#2563eb",
      accent: "#3b82f6",
      deep: "#1e3a8a",
      cyan: "#38bdf8",
      ink: "#05080f",
    },
    motion: {
      heroFrameMs: 6000,
      parallax: { maxX: 18, maxY: 12, maxRotate: 8 },
      popZ: { logo: 56, panel: 36, card: 28 },
      tilt: { intensity: 12, pop: 28 },
      reduceMotionSafe: true,
    },
    scene3d: {
      enabled: true,
      depth: 900,
      orbs: [
        { id: "primary", color: "rgba(37,99,235,0.35)", size: 280, x: 72, y: 28, z: 40 },
        { id: "cyan", color: "rgba(56,189,248,0.18)", size: 180, x: 82, y: 62, z: -20 },
        { id: "deep", color: "rgba(30,58,138,0.22)", size: 220, x: 18, y: 70, z: 10 },
      ],
      planes: [
        { id: "a", rotateX: 62, rotateY: -18, opacity: 0.08 },
        { id: "b", rotateX: 58, rotateY: 22, opacity: 0.06 },
      ],
    },
    layers: [
      { id: "scene", z: 0, kind: "atmosphere3d" },
      { id: "media", z: 1, kind: "reel" },
      { id: "copy", z: 2, kind: "content" },
    ],
    reel: heroReel,
    updatedAt: new Date().toISOString(),
  });
}
