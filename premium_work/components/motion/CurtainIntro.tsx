"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { signalCurtainsOpening } from "./curtainSignal";

const OPEN = 0.85;

function easeInOut(u: number) {
  const t = Math.min(1, Math.max(0, u));
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

const STRIPES =
  "repeating-linear-gradient(90deg, #131834 0px, #131834 22px, #1b2148 22px, #1b2148 44px)";

/**
 * Al volver al inicio, el mismo telón rayado del preloader se abre hacia
 * los lados. No cubre la primera visita (ahí abre el preloader) y no hay
 * una segunda cortina subiendo desde abajo.
 */
export default function CurtainIntro() {
  const [play, setPlay] = useState(false);
  const [xs, setXs] = useState<[number, number]>([0, 0]);
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem("pw-booted") === "1") setPlay(true);
    } catch {
      /* primera visita: la abre el preloader */
    }
  }, []);

  useEffect(() => {
    if (!play) return;
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    let signaled = false;
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      elapsed += dt;
      if (!signaled) {
        signaled = true;
        signalCurtainsOpening();
      }
      const u = easeInOut(elapsed / OPEN);
      setXs([-102 * u, 102 * u]);
      if (elapsed > OPEN + 0.05) {
        setGone(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play]);

  if (!play || gone) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      {xs.map((x, i) => (
        <div
          key={i}
          className={`absolute top-0 bottom-0 w-1/2 ${i === 0 ? "left-0" : "right-0"}`}
          style={{ background: STRIPES, transform: `translateX(${x}%)` }}
        >
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#eab308]" />
        </div>
      ))}
    </div>
  );
}
