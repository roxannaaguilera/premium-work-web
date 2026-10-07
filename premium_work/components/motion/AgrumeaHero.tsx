"use client";

/**
 * Hero: mancha orgánica azul con texto curvo dorado,
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

      {/* Campana 3D flotante */}
      <div aria-hidden="true" className="absolute left-1/2 top-[32%] z-[1] animate-[floatY_6s_ease-in-out_infinite]">
        <img
          src="/images/elementos/campana-3d.png"
          alt=""
          className="w-64 md:w-96 drop-shadow-[0_30px_40px_rgba(19,24,52,0.25)]"
        />
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
