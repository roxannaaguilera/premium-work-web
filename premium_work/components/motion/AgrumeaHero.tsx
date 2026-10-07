"use client";

import Bell3D from "@/components/three/Bell3D";
import Envelope3D from "@/components/three/Envelope3D";
import Medal3D from "@/components/three/Medal3D";

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

      {/* Medalla 3D a la izquierda */}
      <div className="absolute left-[30%] top-[24%] z-[1] -translate-x-1/2">
        <Medal3D />
      </div>

      {/* Campana 3D al centro: gira 360° al pasar el cursor */}
      <div className="absolute left-[50%] top-[32%] z-[2] -translate-x-1/2">
        <Bell3D />
      </div>

      {/* Sobre 3D a la derecha, simulando un círculo */}
      <div className="absolute left-[70%] top-[24%] z-[1] -translate-x-1/2">
        <Envelope3D />
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
