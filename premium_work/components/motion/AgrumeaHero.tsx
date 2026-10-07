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

      {/* Mancha orgánica azul */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 top-[24%] pointer-events-none">
        <svg
          viewBox="0 0 1200 760"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 h-full w-full"
        >
          <path
            d="M110,700 C110,430 300,270 580,250 C860,230 1070,390 1080,620 C1085,745 900,760 590,760 C300,760 110,745 110,700 Z"
            fill="#131834"
          />
          <defs>
            <path id="pw-blob-curve" d="M130,660 C280,420 520,270 950,300" fill="none" />
          </defs>
          <text fill="#eab308" fontSize="92" letterSpacing="6" fontFamily="Georgia, serif" fontWeight="600">
            <textPath href="#pw-blob-curve" startOffset="0%">
              ELEGANCIA · SERVICIO · AUTENTICIDAD ·
            </textPath>
          </text>
        </svg>
      </div>

      {/* Mensaje de scroll */}
      <p className="absolute inset-x-0 bottom-8 z-[2] text-center text-[11px] font-semibold uppercase tracking-[0.4em] text-[#faf6ee]/90 pointer-events-none">
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
