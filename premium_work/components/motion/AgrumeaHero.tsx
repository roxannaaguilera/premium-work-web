"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero concepto Agrumea: escena única a pantalla completa.
 * Mancha azul #131834 emergiendo desde abajo con texto curvo,
 * elementos flotantes (objetos 3D + tarjetas de servicio) con
 * profundidad que desfilan horizontalmente al hacer scroll.
 */
const FLOATERS = [
  { src: "/images/elementos/cloche.png", alt: "Campana de servicio", left: "3%", top: "30%", r: -8, speed: 0.55, size: "w-28 md:w-44", depth: "far", mobile: true, kind: "object" },
  { src: "/images/escaparate-flotante/camareros.jpg", alt: "Camareros", left: "17%", top: "16%", r: 5, speed: 0.8, size: "w-36 md:w-52", depth: "mid", mobile: true, kind: "card" },
  { src: "/images/elementos/copa-champagne.png", alt: "Copa de champán", left: "35%", top: "32%", r: 7, speed: 1.15, size: "w-28 md:w-44", depth: "near", mobile: true, kind: "object" },
  { src: "/images/escaparate-flotante/maitres.jpg", alt: "Maîtres", left: "52%", top: "14%", r: -4, speed: 0.8, size: "w-36 md:w-52", depth: "mid", mobile: false, kind: "card" },
  { src: "/images/elementos/pajarita.png", alt: "Pajarita", left: "66%", top: "34%", r: -6, speed: 0.55, size: "w-28 md:w-40", depth: "far", mobile: false, kind: "object" },
  { src: "/images/escaparate-flotante/cocina.jpg", alt: "Personal de cocina", left: "80%", top: "18%", r: 6, speed: 1.15, size: "w-36 md:w-52", depth: "near", mobile: false, kind: "card" },
  { src: "/images/elementos/gorro-chef.png", alt: "Gorro de chef", left: "95%", top: "32%", r: 8, speed: 0.8, size: "w-28 md:w-44", depth: "mid", mobile: true, kind: "object" },
];

const DEPTH_CLASS: Record<string, string> = {
  far: "blur-[2.5px] brightness-[0.82] saturate-[0.9]",
  mid: "",
  near: "drop-shadow-[0_25px_45px_rgba(19,24,52,0.35)]",
};

export default function AgrumeaHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      // Deriva horizontal de los flotantes con parallax por velocidad
      gsap.utils.toArray<HTMLElement>("[data-hero-float]").forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "1");
        gsap.fromTo(
          el,
          { x: () => window.innerWidth * 0.06 * speed },
          {
            x: () => -window.innerWidth * 0.62 * speed,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 1.2 },
          }
        );
      });
      // Flotación idle (respiración) en el wrapper interior
      gsap.utils.toArray<HTMLElement>("[data-hero-bob]").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -16 : 16,
          rotation: i % 2 === 0 ? 2 : -2,
          duration: 3.4 + (i % 3),
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });
      // La mancha azul emerge un poco más
      gsap.fromTo(
        "[data-hero-blob]",
        { yPercent: 16 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 1.2 },
        }
      );
      // La palabra gigante deriva en sentido contrario
      gsap.fromTo(
        "[data-hero-word]",
        { xPercent: 5 },
        {
          xPercent: -9,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 1.2 },
        }
      );
      // El indicador y el titular se desvanecen al empezar a bajar
      gsap.to("[data-hero-fade]", {
        opacity: 0,
        y: -24,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "22% top", scrub: true },
      });
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      aria-label="Premium Work — inicio"
      className="relative h-[240vh] bg-[#faf6ee]"
    >
      <h1 className="sr-only">
        Premium Work — Profesionales de hospitality para eventos en Madrid
      </h1>

      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Palabra gigante de fondo */}
        <div
          data-hero-word
          aria-hidden="true"
          className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none select-none"
        >
          <span className="font-serif font-bold text-[24vw] leading-none tracking-tight text-transparent [-webkit-text-stroke:1.5px_rgba(19,24,52,0.16)] whitespace-nowrap">
            PREMIUM
          </span>
        </div>

        {/* Mancha azul orgánica con texto curvo */}
        <div data-hero-blob aria-hidden="true" className="absolute inset-x-0 bottom-0 z-[2] h-[48%] pointer-events-none">
          <svg viewBox="0 0 1440 340" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path
              d="M0,150 C220,60 420,190 660,110 C900,30 1120,180 1440,90 L1440,340 L0,340 Z"
              fill="#131834"
            />
            <defs>
              <path id="pw-curve" d="M120,235 Q720,110 1320,235" fill="none" />
            </defs>
            <g>
              <text fill="#eab308" fontSize="34" letterSpacing="10" fontFamily="serif">
                <textPath href="#pw-curve" startOffset="0%">
                  ELEGANCIA · SERVICIO · AUTENTICIDAD · ELEGANCIA · SERVICIO · AUTENTICIDAD ·
                </textPath>
              </text>
            </g>
          </svg>
        </div>

        {/* Elementos flotantes */}
        <div className="absolute inset-0 z-[3]">
          {FLOATERS.map((f) => (
            <div
              key={f.src}
              data-hero-float
              data-speed={f.speed}
              className={`absolute ${f.size} ${f.mobile ? "" : "hidden md:block"}`}
              style={{ left: f.left, top: f.top }}
            >
              <div data-hero-bob style={{ transform: `rotate(${f.r}deg)` }}>
                {f.kind === "object" ? (
                  <img
                    src={f.src}
                    alt={f.alt}
                    loading={f.mobile ? "eager" : "lazy"}
                    className={`w-full h-auto ${DEPTH_CLASS[f.depth]}`}
                  />
                ) : (
                  <figure className={`overflow-hidden rounded-2xl shadow-[0_25px_60px_rgba(19,24,52,0.35)] ${DEPTH_CLASS[f.depth]}`}>
                    <img src={f.src} alt={f.alt} loading="lazy" className="w-full h-auto object-cover aspect-[4/5]" />
                  </figure>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Titular superior + indicador de scroll */}
        <div data-hero-fade className="absolute inset-x-0 top-0 z-[4] pt-24 md:pt-28 text-center px-6 pointer-events-none">
          <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-[#131834]/60 font-semibold">
            Hospitality · Madrid
          </p>
          <p className="mt-3 font-serif text-2xl md:text-4xl text-[#131834] font-semibold">
            El equipo que representa tu imagen
          </p>
        </div>
        <div data-hero-fade className="absolute inset-x-0 bottom-6 z-[4] text-center pointer-events-none">
          <p className="text-[11px] tracking-[0.4em] uppercase text-[#faf6ee]/80 font-semibold">
            Desliza para descubrir
          </p>
          <div aria-hidden="true" className="mx-auto mt-2 h-8 w-px bg-[#faf6ee]/50" />
        </div>
      </div>
    </section>
  );
}
