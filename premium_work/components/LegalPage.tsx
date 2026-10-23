"use client";

import type { ReactNode } from "react";
import FixedHeader from "@/components/chrome/FixedHeader";
import { ServiceFooter } from "@/components/ServiceFooter";
import { useLang } from "@/components/i18n/lang";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  const { t } = useLang();
  return <>
    <FixedHeader />
    <main className="bg-[#faf6ee] text-[#131834]">
      <article className="legal-copy mx-auto max-w-4xl px-5 pt-44 pb-16 md:px-10 md:pt-52 md:pb-24">
        <p className="eyebrow flex items-center gap-2 text-[#131834]/60">
          <span className="text-[#eab308]" aria-hidden="true">◆</span> {t("legal.eyebrow")}
        </p>
        <h1 className="font-serif mt-5 text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] font-semibold tracking-[-0.01em]">{title}</h1>
        <p className="mt-5 text-sm text-[#131834]/60">{t("legal.version")}</p>
        {children}
        <nav aria-label={t("legal.navAria")} className="mt-12 flex flex-wrap gap-5 border-t border-[#131834]/15 pt-6 text-sm font-semibold">
          <a className="underline underline-offset-4 transition-colors hover:text-[#eab308]" href="/aviso-legal">{t("legal.notice")}</a>
          <a className="underline underline-offset-4 transition-colors hover:text-[#eab308]" href="/politica-de-privacidad">{t("legal.privacy")}</a>
          <a className="underline underline-offset-4 transition-colors hover:text-[#eab308]" href="/politica-de-cookies">{t("legal.cookies")}</a>
          <a className="underline underline-offset-4 transition-colors hover:text-[#eab308]" href="/">{t("legal.backHome")}</a>
        </nav>
      </article>
    </main>
    <ServiceFooter />
  </>;
}
