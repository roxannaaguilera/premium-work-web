"use client";

import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { legalReady } from "@/lib/legal";
import { useLang } from "@/components/i18n/lang";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  const { t } = useLang();
  return <><Navbar /><main className="min-h-screen bg-white px-5 pb-24 pt-32 text-[#131313] md:px-8"><article className="legal-copy mx-auto max-w-4xl">
    <p className="eyebrow text-[#173aab]">{t("legal.eyebrow")}</p>
    <h1 className="display mt-5 text-4xl md:text-6xl">{title}</h1>
    <p className="mt-5 text-sm">{t("legal.version")}</p>
    {!legalReady() && <p className="my-6 rounded-xl border border-[#2451e6] bg-[#e9eefd] p-4 text-sm"><strong>{t("legal.pendingTitle")}</strong> {t("legal.pending")}</p>}
    {children}
    <nav aria-label={t("legal.navAria")} className="mt-12 flex flex-wrap gap-5 border-t border-[#e5e7eb] pt-6 text-sm"><a href="/aviso-legal">{t("legal.notice")}</a><a href="/politica-de-privacidad">{t("legal.privacy")}</a><a href="/politica-de-cookies">{t("legal.cookies")}</a><a href="/">{t("legal.backHome")}</a></nav>
  </article></main></>;
}
