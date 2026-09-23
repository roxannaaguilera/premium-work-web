import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { CookieSettingsButton } from "@/components/CookiePreferences";
import { legalReady } from "@/lib/legal";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return <><Navbar /><main className="min-h-screen bg-white px-5 pb-24 pt-32 text-[#131313] md:px-8"><article className="legal-copy mx-auto max-w-4xl">
    <p className="eyebrow text-[#6e7a10]">Premium Work · Información legal</p>
    <h1 className="display mt-5 text-4xl md:text-6xl">{title}</h1>
    <p className="mt-5 text-sm">Versión de 10 de septiembre de 2026.</p>
    {!legalReady() && <p className="my-6 rounded-xl border border-[#d2d943] bg-[#f2f6d8] p-4 text-sm"><strong>Documento pendiente de completar.</strong> Faltan datos identificativos y condiciones de tratamiento que debe confirmar el titular antes de publicar y recoger datos reales.</p>}
    {children}
    <nav aria-label="Información legal" className="mt-12 flex flex-wrap gap-5 border-t border-[#e5e7eb] pt-6 text-sm"><a href="/aviso-legal">Aviso legal</a><a href="/politica-de-privacidad">Privacidad</a><a href="/politica-de-cookies">Cookies</a><CookieSettingsButton className="underline" /><a href="/">Volver al inicio</a></nav>
  </article></main></>;
}
