"use client";

import ElementsCarousel from "@/components/three/ElementsCarousel";
import CurtainIntro from "./CurtainIntro";
import { useLang } from "@/components/i18n/lang";

/**
 * Hero: carrusel 360° con los 8 elementos reales de Premium Work.
 * Al volver, el telón rayado se abre hacia los lados y los elementos
 * caen detrás. Arrastra o desplaza para girar entre sectores.
 * Un click en el objeto principal abre su página de servicio.
 */
export default function AgrumeaHero() {
  const { t } = useLang();
  return (
    <section
      id="inicio"
      aria-label={t("hero.aria")}
      className="relative h-screen overflow-hidden bg-[#fdf3eb]"
    >
      {/* Cortinas de presentación */}
      <CurtainIntro />

      {/* Carrusel: cada objeto cae, rebota una vez y se queda */}
      <div className="relative h-full">
        <ElementsCarousel />

        {/* Desliza para descubrir, como Agrumea */}
        <p className="pointer-events-none absolute inset-x-0 bottom-8 z-[2] text-center text-[11px] font-semibold uppercase tracking-[0.4em] text-[#131834]/70">
          {t("hero.hint")}
        </p>
      </div>

      {/* Privacidad y cookies */}
      <a
        href="/privacidad"
        className="absolute bottom-6 left-6 z-[2] text-xs text-[#131834]/70 underline underline-offset-4 hover:text-[#131834]"
      >
        {t("hero.privacy")}
      </a>
    </section>
  );
}
