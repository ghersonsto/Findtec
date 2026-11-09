"use client";

import Spline from "@splinetool/react-spline";

type HeroSplineBgProps = {
  scene: string;
};

export function HeroSplineBg({ scene }: HeroSplineBgProps) {
  return (
    <Spline
      scene={scene}
      className="h-full w-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
