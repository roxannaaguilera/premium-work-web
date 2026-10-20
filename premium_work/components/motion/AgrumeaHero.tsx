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
            className="fab-bob fab-bob-late pointer-events-auto h-14 w-14 justify-self-end drop-shadow-[0_10px_14px_rgba(19,24,52,0.28)]"
          >
            <svg viewBox="0 0 48 48" aria-hidden="true" className="h-full w-full">
              <circle cx="24" cy="24" r="24" fill="#25D366" />
              <path
                fill="#fff"
                d="M35.2 12.8A13.7 13.7 0 0 0 24.1 8.6c-7.6 0-13.8 6.2-13.8 13.8 0 2.4.6 4.8 1.8 6.9L10 39.4l10.3-2.7a13.8 13.8 0 0 0 6.6 1.7h.1c7.6 0 13.8-6.2 13.8-13.8 0-3.7-1.4-7.1-4-9.8zm-11.1 21.2h-.1a11.5 11.5 0 0 1-5.8-1.6l-.4-.2-6.1 1.6 1.6-6-.3-.4a11.4 11.4 0 0 1-1.8-6.1c0-6.3 5.2-11.5 11.5-11.5 3.1 0 6 1.2 8.1 3.4a11.4 11.4 0 0 1 3.4 8.1c0 6.4-5.1 11.5-11.5 11.7zm6.3-8.6c-.3-.2-2-.9-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.1-.2.2-.3.3-.6.1-.2.1-.4 0-.6-.1-.2-.8-1.9-1.1-2.6-.3-.6-.6-.6-.8-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.2-.6-.4z"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
