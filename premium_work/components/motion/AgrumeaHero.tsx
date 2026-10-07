"use client";

import ElementsCarousel from "@/components/three/ElementsCarousel";

/**
 * Hero: carrusel 3D con los 8 elementos de Premium Work.
 * Arrastra o desplaza para girar entre sectores — como Agrumea.
 */
export default function AgrumeaHero() {
  return (
    <section
      id="inicio"
      aria-label="Premium Work — inicio"
      className="relative h-screen overflow-hidden bg-[#fdf3eb]"
    >
      <h1 className="sr-only">
        Premium Work — Profesionales de hospitality para eventos en Madrid
      </h1>

      {/* Carrusel 3D de los 8 sectores */}
      <ElementsCarousel />

      {/* Privacidad y cookies */}
      <a
        href="/privacidad"
        className="absolute bottom-6 left-6 z-[2] text-xs text-[#131834]/70 underline underline-offset-4 hover:text-[#131834]"
      >
        Privacidad y Cookies
      </a>
    </section>
  );
}
