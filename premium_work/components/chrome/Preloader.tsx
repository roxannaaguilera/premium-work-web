"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getLenis } from "@/lib/lenis-instance";

/**
 * Preloader estilo Agrumea con telón de teatro:
 * 1. Ventana beige #fdf3eb con % de carga en azul.
 * 2. Al 100%, dos cortinas azules suben desde abajo y cubren la pantalla.
 * 3. Las cortinas se abren hacia los lados revelando la web.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  // La carga con porcentajes solo se muestra en la primera visita;
  // al volver, solo aparece la cortina azul del hero.
  const [done, setDone] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("pw-booted") === "1"
  );
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || done) return;
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
    };

    if (reduced) {
      gsap.to(root, { opacity: 0, duration: 0.4, delay: 0.3, onComplete: finish });
      return;
    }

    const counter = { v: 0 };
    const num = root.querySelector("[data-pl-num]");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });
      // 1. Contador 0 → 100 sobre beige
      tl.to(counter, {
        v: 100,
        duration: 1.9,
        ease: "power2.inOut",
        onUpdate: () => {
          if (num) num.textContent = `${Math.round(counter.v)}%`;
        },
      });
      // 2. El beige se desvanece y las cortinas suben desde abajo
      tl.to("[data-pl-beige]", { opacity: 0, duration: 0.35, ease: "power2.in" }, "+=0.1");
      tl.fromTo(
        "[data-pl-curtain]",
        { yPercent: 112 },
        { yPercent: 0, duration: 0.85, ease: "power4.inOut", stagger: 0.09 },
        "<"
      );
      // 3. Pausa dramática y apertura del telón hacia los lados
      tl.to("[data-pl-curtain]", {
        xPercent: (i) => (i === 0 ? -102 : 102),
        duration: 1.1,
        ease: "power4.inOut",
      }, "+=0.3");
      tl.to(root, { opacity: 0, duration: 0.3 }, "-=0.25");
    }, root);
    return () => ctx.revert();
  }, [done, reduced]);

  if (done) return null;

  return (
    <div ref={rootRef} aria-hidden="true" className="fixed inset-0 z-[100]">
      {/* Ventana beige con porcentaje */}
      <div data-pl-beige className="absolute inset-0 flex flex-col items-center justify-center bg-[#fdf3eb]">
        <span data-pl-num className="font-serif text-7xl md:text-8xl font-semibold text-[#131834] tabular-nums">
          0%
        </span>
        <span className="mt-4 text-xs tracking-[0.45em] uppercase text-[#131834]/60 font-semibold">
          Premium Work
        </span>
      </div>
      {/* Cortinas azules con pliegues sutiles */}
      {[0, 1].map((i) => (
        <div
          key={i}
          data-pl-curtain
          className={`absolute top-0 bottom-0 w-1/2 ${i === 0 ? "left-0" : "right-0"}`}
          style={{
            background:
              "repeating-linear-gradient(90deg, #131834 0px, #131834 22px, #1b2148 22px, #1b2148 44px)",
          }}
        >
          {/* dobladillo dorado del telón */}
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#eab308]" />
        </div>
      ))}
    </div>
  );
}
