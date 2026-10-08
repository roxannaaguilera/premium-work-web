"use client";

import { useEffect, useState } from "react";
import { preloaderCurtainIsUp, signalCurtainsOpening } from "./curtainSignal";

const PANELS = 5;
const IN = 0.7;
const HOLD = 1.1;
const OUT = 0.8;
const STAGGER = 0.07;

function easeInOut(u: number) {
  const t = Math.min(1, Math.max(0, u));
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Cortinas de presentación. Caen, cubren, y al empezar a abrirse
 * disparan la caída de los objetos. El reloj avanza como máximo
 * 32 ms por frame para no saltarse la apertura en un fotograma lento.
 */
export default function CurtainIntro() {
  const [ys, setYs] = useState<number[]>(() => Array(PANELS).fill(-100));
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    let signaled = false;
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      elapsed += dt;
      if (!signaled && elapsed >= HOLD && !preloaderCurtainIsUp()) {
        signaled = true;
        signalCurtainsOpening();
      }
      const next = Array.from({ length: PANELS }, (_, i) => {
        if (elapsed < IN) return -100 + 100 * easeInOut(elapsed / IN);
        if (elapsed < HOLD + i * STAGGER) return 0;
        const u = (elapsed - HOLD - i * STAGGER) / OUT;
        return 100 * easeInOut(u);
      });
      setYs(next);
      if (elapsed > HOLD + (PANELS - 1) * STAGGER + OUT + 0.05) {
        setGone(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex" aria-hidden="true">
      {ys.map((y, i) => (
        <div
          key={i}
          className="relative h-full flex-1 bg-[#131834]"
          style={{ transform: `translateY(${y}%)` }}
        >
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-[#d8a93c]" />
        </div>
      ))}
    </div>
  );
}
