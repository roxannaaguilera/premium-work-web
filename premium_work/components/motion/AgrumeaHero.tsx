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
          className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-[3] flex h-12 w-12 items-center justify-center"
        >
          <svg viewBox="0 0 48 48" aria-hidden="true" className="h-11 w-11 drop-shadow-[0_4px_10px_rgba(19,24,52,0.22)]">
            <circle cx="23" cy="25" r="16" fill="#e7b86a" stroke="#c4923e" strokeWidth="1.5" />
            <circle cx="35" cy="13" r="7.5" fill="#fdf3eb" />
            <circle cx="15" cy="20" r="2.1" fill="#6a3d22" />
            <circle cx="24" cy="18" r="1.5" fill="#6a3d22" />
            <circle cx="19" cy="28" r="2.3" fill="#6a3d22" />
            <circle cx="28" cy="27" r="1.7" fill="#6a3d22" />
            <circle cx="26" cy="34" r="1.9" fill="#6a3d22" />
            <circle cx="15" cy="34" r="1.3" fill="#6a3d22" />
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
