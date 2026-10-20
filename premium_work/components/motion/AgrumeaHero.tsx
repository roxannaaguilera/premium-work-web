"use client";

import ElementsCarousel from "@/components/three/ElementsCarousel";
import { useLang } from "@/components/i18n/lang";

/**
 * Hero: carrusel 360° con los 8 elementos reales de Premium Work.
 * Arrastra o desplaza para girar entre sectores.
 * Un click en el objeto principal abre su página de servicio.
 */
export default function AgrumeaHero() {
  const { t } = useLang();
  return (
    <section
      id="inicio"
      aria-label={t("hero.aria")}
      className="relative h-dvh overflow-hidden bg-[#fdf3eb]"
    >
      {/* Carrusel: cada objeto cae, rebota una vez y se queda */}
      <div className="relative h-full">
        <ElementsCarousel />

        <a
          href="/politica-de-cookies"
          aria-label={t("legal.cookies")}
          data-pw-cookie
          className="absolute bottom-24 left-4 z-[40] flex h-14 w-14 items-center justify-center rounded-full"
        >
          <svg viewBox="0 0 56 56" aria-hidden="true" className="h-14 w-14 drop-shadow-[0_6px_14px_rgba(19,24,52,0.35)]">
            <circle cx="28" cy="28" r="24" fill="#f6e2b8" stroke="#131834" strokeWidth="3.5" />
            <circle cx="18" cy="22" r="3.4" fill="#131834" />
            <circle cx="31" cy="17" r="2.5" fill="#131834" />
            <circle cx="38" cy="28" r="3.1" fill="#131834" />
            <circle cx="24" cy="32" r="3.6" fill="#131834" />
            <circle cx="35" cy="38" r="2.4" fill="#131834" />
            <circle cx="16" cy="36" r="2.2" fill="#131834" />
          </svg>
        </a>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p
            data-pw-front-name
            className="max-w-[calc(100%-9.5rem)] truncate text-center text-[clamp(0.85rem,3.6vw,1.15rem)] font-semibold uppercase tracking-[0.12em] text-[#131834]"
          />
          <p className="max-w-[calc(100%-9.5rem)] px-2 text-center text-[11px] font-semibold uppercase leading-snug tracking-[0.08em] text-[#131834]/70 sm:tracking-[0.16em]">
            {t("hero.hint")}
          </p>
        </div>
      </div>
    </section>
  );
}
