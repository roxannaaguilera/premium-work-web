"use client";

import { useLang } from "@/components/i18n/lang";

/**
 * Capa HTML del inicio. El lienzo y el telón viven en la cáscara y no
 * se desmontan al abrir un servicio. Esta sección deja pasar el click
 * hasta los objetos.
 */
export default function AgrumeaHero() {
  const { t } = useLang();
  return (
    <section
      id="inicio"
      aria-label={t("hero.aria")}
      className="pointer-events-none relative h-screen"
    >
      <h1 className="sr-only">{t("hero.title")}</h1>
      <p className="pointer-events-none absolute inset-x-0 bottom-8 z-[2] text-center text-[11px] font-semibold uppercase tracking-[0.4em] text-[#131834]/70">
        {t("hero.hint")}
      </p>
      <a
        href="/privacidad"
        className="pointer-events-auto absolute bottom-6 left-6 z-[2] text-xs text-[#131834]/70 underline underline-offset-4 hover:text-[#131834]"
      >
        {t("hero.privacy")}
      </a>
    </section>
  );
}
