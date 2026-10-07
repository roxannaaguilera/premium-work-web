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

      {/* Insignia giratoria: ¿servicio perfecto? equipo correcto */}
      <div aria-hidden="true" className="absolute left-1/2 top-[27%] z-[3] animate-[floatY_5s_ease-in-out_infinite] will-change-transform">
        <div className="relative h-60 w-60 md:h-72 md:w-72">
          <div className="absolute inset-0 animate-[spin_16s_linear_infinite]">
            <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-[0_18px_35px_rgba(19,24,52,0.25)]">
              <path
                d="M100,10 C138,8 176,30 188,68 C200,106 188,148 152,170 C116,192 70,186 40,158 C10,130 8,86 26,50 C44,14 62,12 100,10 Z"
                fill="#fdf3eb"
                stroke="#131834"
                strokeWidth="2.5"
              />
              <defs>
                <path id="pw-spin-circle" d="M100,34 a66,66 0 1,1 -0.01,0" fill="none" />
              </defs>
              <text fill="#131834" fontSize="14.5" letterSpacing="2.5" fontFamily="Georgia, serif" fontWeight="700">
                <textPath href="#pw-spin-circle">
                  ¿SERVICIO PERFECTO? · EQUIPO CORRECTO ·
                </textPath>
              </text>
            </svg>
          </div>
          <span className="absolute left-1/2 top-1/2 inline-block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#eab308]" />
        </div>
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
