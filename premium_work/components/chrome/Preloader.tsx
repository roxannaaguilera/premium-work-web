"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getLenis } from "@/lib/lenis-instance";

/**
 * Porcentaje de carga, encima del telón rayado de la cáscara.
 * El porcentaje se ve primero. Al llegar a 100 el beige se va y la
 * cáscara abre ese mismo telón. No hay una segunda cortina.
 *
 * Solo en la primera visita de la sesión. El flag se resuelve en un
 * layout effect para que el HTML del servidor y la hidratación coincidan.
 */
export default function Preloader({ onDone }: { onDone?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem("pw-booted") === "1") setDone(true);
    } catch {
      /* sin almacenamiento: se muestra la carga */
    }
  }, []);

  useEffect(() => {
    if (done) return;
    const root = rootRef.current;
    if (!root) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const finish = () => {
      document.body.style.overflow = "";
      lenis?.start();
      try {
        sessionStorage.setItem("pw-booted", "1");
      } catch {
        /* sin almacenamiento: se repite la carga */
      }
      setDone(true);
      onDoneRef.current?.();
    };

    if (reduced) {
      gsap.to(root, { opacity: 0, duration: 0.4, delay: 0.3, onComplete: finish });
      return;
    }

    const counter = { v: 0 };
    const num = root.querySelector("[data-pl-num]");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(counter, {
        v: 100,
        duration: 1.9,
        ease: "power2.inOut",
        onUpdate: () => {
          if (num) num.textContent = `${Math.round(counter.v)}%`;
        },
      });
      tl.to(root, { opacity: 0, duration: 0.28, ease: "power2.in" }, "+=0.08");
    }, root);
    return () => ctx.revert();
  }, [done, reduced]);

  if (done) return null;

  return (
    <div ref={rootRef} aria-hidden="true" className="fixed inset-0 z-[100]">
      <div data-pl-beige className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#fdf3eb]">
        <span data-pl-num className="font-serif text-7xl md:text-8xl font-semibold text-[#131834] tabular-nums">
          0%
        </span>
        <span className="mt-4 text-xs tracking-[0.45em] uppercase text-[#131834]/60 font-semibold">
          Premium Work
        </span>
      </div>
    </div>
  );
}
