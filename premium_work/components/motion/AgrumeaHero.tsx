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

        {/* Desliza para descubrir, como Agrumea */}
        <p className="pointer-events-none absolute inset-x-4 bottom-5 z-[2] text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[#131834]/70 sm:bottom-8 sm:text-[11px] sm:tracking-[0.4em]">
          {t("hero.hint")}
        </p>
      </div>

      {/* Privacidad y cookies */}
      <a
        href="/privacidad"
        className="absolute bottom-12 left-4 z-[2] max-w-[46%] text-[11px] text-[#131834]/70 underline underline-offset-4 hover:text-[#131834] sm:bottom-6 sm:left-6 sm:max-w-none sm:text-xs"
      >
        {t("hero.privacy")}
      </a>
    </section>
  );
}
