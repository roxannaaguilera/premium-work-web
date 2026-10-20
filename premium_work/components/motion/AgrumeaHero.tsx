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

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[40] grid grid-cols-[4.25rem_minmax(0,1fr)_4.25rem] items-center gap-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <a
            href="/politica-de-cookies"
            aria-label={t("legal.cookies")}
            data-pw-cookie
            className="fab-bob pointer-events-auto h-14 w-14 justify-self-start overflow-hidden rounded-full drop-shadow-[0_10px_14px_rgba(19,24,52,0.28)]"
          >
            <img src="/images/cookie.png" alt="" className="h-full w-full object-cover" />
          </a>
          <div className="flex min-w-0 flex-col items-center gap-1">
            <p
              data-pw-front-name
              className="max-w-full truncate text-center text-[clamp(0.85rem,3.6vw,1.15rem)] font-semibold uppercase tracking-[0.12em] text-[#131834]"
            />
            <p className="max-w-full text-center text-[11px] font-semibold uppercase leading-snug tracking-[0.08em] text-[#131834]/70 sm:tracking-[0.16em]">
              {t("hero.hint")}
            </p>
          </div>
          <a
            href="https://wa.me/34604858113"
            target="_blank"
            rel="noreferrer"
            aria-label={t("footer.whatsapp")}
            data-pw-whatsapp
            className="fab-bob fab-bob-late pointer-events-auto flex h-14 w-14 items-center justify-center justify-self-end"
          >
            <img src="/images/whatsapp.png" alt="" className="h-full w-full object-contain drop-shadow-[0_8px_12px_rgba(19,24,52,0.28)]" />
          </a>
        </div>
      </div>
    </section>
  );
}
