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

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p
            data-pw-front-name
            className="max-w-full truncate text-center text-[clamp(0.85rem,3.6vw,1.15rem)] font-semibold uppercase tracking-[0.12em] text-[#131834]"
          />
          <p className="max-w-full px-2 text-center text-[11px] font-semibold uppercase leading-snug tracking-[0.08em] text-[#131834]/70 sm:tracking-[0.16em]">
            {t("hero.hint")}
          </p>
          <a
            href="/politica-de-cookies"
            className="pointer-events-auto inline-flex min-h-11 items-center rounded-full bg-[#131834] px-4 text-xs font-semibold tracking-wide text-[#faf6ee]"
          >
            {t("legal.cookies")}
          </a>
        </div>
      </div>
    </section>
  );
}
