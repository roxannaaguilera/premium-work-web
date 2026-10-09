"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getLenis } from "@/lib/lenis-instance";
import { signalCurtainsOpening } from "@/components/motion/curtainSignal";

/**
 * Preloader estilo Agrumea con telón de teatro:
 * 1. Ventana beige #fdf3eb con % de carga. Las cortinas quedan detrás y no
 *    tapan el porcentaje.
 * 2. Al 100%, el beige se va y queda el telón rayado ya cerrado.
 * 3. Una sola apertura hacia los lados. No hay una segunda cortina subiendo
 *    desde abajo.
 *
 * La carga con porcentajes solo se muestra en la primera visita de la sesión;
 * al volver, solo aparece la cortina rayada del hero. El flag se resuelve en un
 * efecto (no en el inicializador de useState) para que el HTML del servidor y
 * la hidratación coincidan: así React retira el overlay con una actualización
 * normal en vez de dejar un div huérfano tapando la pantalla. La comprobación
 * va en un layout effect para que al volver no se pinte ni un fotograma beige.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useLayoutEffect(() => {
    // Al volver, marcar como hecho antes del primer pintado: sin parpadeo beige.
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
    };

    if (reduced) {
      gsap.to(root, { opacity: 0, duration: 0.4, delay: 0.3, onComplete: finish });
      return;
    }

    const counter = { v: 0 };
    const num = root.querySelector("[data-pl-num]");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });
      // Las cortinas ya están cerradas, detrás del beige. No suben desde abajo.
      gsap.set("[data-pl-curtain]", { xPercent: 0, yPercent: 0 });
      // 1. Contador 0 → 100 sobre beige, sin telón encima
      tl.to(counter, {
        v: 100,
        duration: 1.9,
        ease: "power2.inOut",
        onUpdate: () => {
          if (num) num.textContent = `${Math.round(counter.v)}%`;
        },
      });
      // 2. El beige se va y deja ver el telón rayado cerrado
      tl.to("[data-pl-beige]", { opacity: 0, duration: 0.28, ease: "power2.in" }, "+=0.08");
      // 3. Una sola apertura hacia los lados. Los objetos caen en ese instante.
      tl.to("[data-pl-curtain]", {
        xPercent: (i) => (i === 0 ? -102 : 102),
        duration: 0.85,
        ease: "power4.inOut",
        onStart: () => signalCurtainsOpening(),
      }, "+=0.12");
      tl.to(root, { opacity: 0, duration: 0.25 }, "-=0.2");
    }, root);
    return () => ctx.revert();
  }, [done, reduced]);

  if (done) return null;

  return (
    <div ref={rootRef} aria-hidden="true" className="fixed inset-0 z-[100]">
      {/* Telón rayado cerrado, detrás del porcentaje hasta que este termina */}
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
      {/* Ventana beige con porcentaje, por encima del telón */}
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
