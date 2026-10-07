"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * AnimatedHero — hero cinematográfico de apertura.
 * Cielo de amanecer sobre azul medianoche, sol que asciende con el scroll,
 * titular gigante con revelado por caracteres y CTAs en píldora.
 */
export function AnimatedHero() {
  const root = useRef<HTMLElement>(null);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useLayoutEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      // Revelado del titular por caracteres
      const split = new SplitText("[data-hero-title] .line-inner", {
        type: "chars",
        charsClass: "hero-char",
      });
      gsap.set(split.chars, { yPercent: 110, opacity: 0 });
      gsap.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.022,
        delay: 0.25,
      });

      // Entrada del resto
      gsap.fromTo(
        "[data-hero-fade]",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.9 }
      );

      // El sol asciende y el contenido hace parallax al hacer scroll
      gsap.to("[data-hero-sun]", {
        y: "-38vh",
        scale: 1.25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-content]", {
        y: "-12vh",
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-glow]", {
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "70% top", scrub: true },
      });

      // Respiración de los brillos
      gsap.to("[data-hero-glow]", {
        scale: 1.12,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "50% 100%",
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      id="inicio"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#0a1428] text-white"
    >
      {/* Cielo: amanecer sobre medianoche */}
      <div data-hero-glow aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-x-0 bottom-[-30%] h-[85%] bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(245,166,80,0.55),rgba(36,81,230,0.35)_45%,transparent_75%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_80%_10%,rgba(36,81,230,0.5),transparent_70%)]" />
      </div>

      {/* Sol naciente */}
      <div
        data-hero-sun
        aria-hidden="true"
        className="absolute bottom-[8%] left-1/2 h-[34vmin] w-[34vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,214,140,0.95),rgba(245,166,80,0.55)_55%,transparent_72%)] blur-[2px]"
      />

      {/* Diamantes flotantes de marca */}
      <span aria-hidden="true" className="absolute left-[12%] top-[22%] text-[#eab308]/70 text-xl animate-pulse">◆</span>
      <span aria-hidden="true" className="absolute right-[14%] top-[34%] text-[#eab308]/50 text-sm animate-pulse">◆</span>
      <span aria-hidden="true" className="absolute left-[20%] bottom-[26%] text-[#eab308]/40 text-xs animate-pulse">◆</span>

      {/* Contenido */}
      <div data-hero-content className="relative z-10 mx-auto max-w-[1100px] px-5 pt-24 text-center md:px-8">
        <p data-hero-fade className="eyebrow text-[#9db8ff]">
          <span aria-hidden="true" className="text-[#eab308]">◆</span> Premium Work · Hospitality · Madrid
        </p>
        <h1
          data-hero-title
          className="display mx-auto mt-6 text-[clamp(3rem,11vw,7.5rem)] leading-[0.98]"
        >
          <span className="block overflow-hidden pb-2">
            <span className="line-inner block">¿Servicio perfecto?</span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span className="line-inner block">
              <span className="box-decoration-clone bg-[#2451e6] px-4 text-white">Equipo correcto.</span>
            </span>
          </span>
        </h1>
        <p data-hero-fade className="mx-auto mt-7 max-w-[36rem] text-[15px] leading-7 text-[#c6d4f5] sm:text-base">
          Profesionales de hospitality seleccionados, formados y supervisados
          a la medida de su marca. Del montaje a la gala: cubrimos el día entero.
        </p>
        <div data-hero-fade className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/solicitar-servicio"
            className="inline-flex items-center rounded-full bg-[#2451e6] px-8 py-4 text-[15px] font-bold text-white transition-transform duration-300 hover:scale-[1.04] hover:bg-[#173aab]"
          >
            Solicitar servicio
          </a>
          <a
            href="/registro"
            className="inline-flex items-center rounded-full border border-white/30 px-8 py-4 text-[15px] font-bold text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
          >
            Soy profesional
          </a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div data-hero-fade aria-hidden="true" className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
        <p className="eyebrow text-white/50">Desliza · el día empieza</p>
        <div className="mx-auto mt-3 h-10 w-px bg-gradient-to-b from-white/70 to-transparent" />
      </div>
    </section>
  );
}
