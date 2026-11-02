"use client";

import React, { useEffect, useState } from "react";
import { PetalIcon } from "./Icons";

interface PetalItem {
  id: number;
  left: number; // percentage 0-100
  top: number; // percentage 0-100
  size: number; // size in px
  duration: number; // animation seconds
  delay: number; // delay in seconds
  rotate: number; // base rotation
  opacity: number;
  drift: number; // horizontal sway distance
}

export const PetalParticles: React.FC = () => {
  const [petals, setPetals] = useState<PetalItem[]>([]);

  useEffect(() => {
    // Generate a curated set of romantic floating petals
    const count = 18;
    const generated: PetalItem[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: -10 - Math.random() * 20,
      size: 14 + Math.random() * 14,
      duration: 12 + Math.random() * 14,
      delay: Math.random() * 8,
      rotate: Math.random() * 360,
      opacity: 0.25 + Math.random() * 0.35,
      drift: -40 + Math.random() * 80,
    }));
    setPetals(generated);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[5]">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute will-change-transform"
          style={{
            left: `${petal.left}%`,
            top: `${petal.top}%`,
            animation: `petalDrift ${petal.duration}s linear ${petal.delay}s infinite`,
            opacity: petal.opacity,
          }}
        >
          <div
            style={{
              transform: `rotate(${petal.rotate}deg)`,
            }}
          >
            <PetalIcon
              style={{
                width: `${petal.size}px`,
                height: `${petal.size}px`,
                color: petal.id % 2 === 0 ? "#FDA4AF" : "#FB7185",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
