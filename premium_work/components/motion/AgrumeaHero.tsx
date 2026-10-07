"use client";

import Bell3D from "@/components/three/Bell3D";

/**
 * Hero: campana 3D flotante que gira al hover,
 * mensaje de scroll y botón de privacidad — como Agrumea.
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

      {/* Campana 3D al centro: gira al pasar el cursor */}
      <div className="absolute left-1/2 top-[30%] z-[2] -translate-x-1/2">
        <Bell3D />
      </div>

      {/* Mensaje de scroll */}
      <p className="absolute inset-x-0 bottom-8 z-[2] text-center text-[11px] font-semibold uppercase tracking-[0.4em] text-[#131834]/70 pointer-events-none">
        Desliza para descubrir
      </p>

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
