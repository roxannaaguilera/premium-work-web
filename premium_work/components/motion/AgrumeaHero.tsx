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
      className="relative h-screen overflow-hidden bg-[#fdf3eb] supports-[height:100dvh]:h-dvh"
    >
      {/* Carrusel: cada objeto cae, rebota una vez y se queda */}
      <div className="relative h-full">
        <ElementsCarousel />

        {/* Desliza para descubrir, como Agrumea: tamaño fluido y pasos
            a 1024 px y 480 px, como el título de Agrumea. */}
        <p className="pointer-events-none absolute inset-x-0 bottom-16 z-[2] text-center text-[clamp(10px,2.5vw,11px)] font-semibold uppercase tracking-[0.4em] text-[#131834]/70 lg:bottom-8">
          {t("hero.hint")}
        </p>
      </div>

      {/* Privacidad y cookies: margen lateral 20 px en móvil, como Agrumea */}
      <a
        href="/politica-de-privacidad"
        className="absolute bottom-6 left-6 z-[2] text-xs text-[#131834]/70 underline underline-offset-4 hover:text-[#131834] max-[480px]:bottom-5 max-[480px]:left-5"
      >
        {t("hero.privacy")}
      </a>
    </section>
  );
}
