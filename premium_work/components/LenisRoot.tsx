"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Scroll suave global (estilo Agrumea).
 * Lenis es agnóstico al framework; no requiere migrar a Nuxt.
 */
export default function LenisRoot() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}
