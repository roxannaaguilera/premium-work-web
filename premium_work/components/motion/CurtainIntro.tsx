"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PANELS = 5;

/**
 * Cortinas de presentación: caen de arriba hacia abajo cubriendo la
 * pantalla y después barren hacia abajo liberando el hero, mientras
 * los elementos aparecen detrás.
 */
export default function CurtainIntro() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("out"), 1100);
    const t2 = setTimeout(() => setPhase("done"), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "done") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex" aria-hidden="true">
      {Array.from({ length: PANELS }).map((_, i) => (
        <motion.div
          key={i}
          className="relative h-full flex-1 bg-[#131834]"
          initial={{ y: "-100%" }}
          animate={{ y: phase === "in" ? "0%" : "100%" }}
          transition={{
            duration: phase === "in" ? 0.7 : 0.8,
            delay: i * 0.07,
            ease: [0.65, 0, 0.35, 1],
          }}
        >
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-[#d8a93c]" />
        </motion.div>
      ))}
    </div>
  );
}
