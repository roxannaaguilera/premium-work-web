"use client";

import Link from "next/link";
import { useLang } from "@/components/i18n/lang";

const WHATSAPP_NUMBER = "34604858113";
const EMAIL = "hola@premiumwork.es";
const NAV_HREFS = ["/", "/servicios", "/nosotros", "/solicitar-servicio"];
const LEGAL_HREFS = ["/aviso-legal", "/politica-de-privacidad", "/politica-de-cookies"];

function InstagramIcon() {
  return <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></svg>;
}

function LinkedInIcon() {
  return <svg className="size-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.5 8.7H3.4V20h3.1V8.7ZM5 3.7A1.8 1.8 0 1 0 5 7.3a1.8 1.8 0 0 0 0-3.6ZM20.6 13.5c0-3.4-1.8-5-4.3-5-2 0-2.9 1.1-3.4 1.9V8.7H9.8V20h3.1v-5.6c0-1.5.3-3 2.1-3 1.9 0 1.9 1.8 1.9 3.1V20H20v-6.5h.6Z" /></svg>;
}

function FacebookIcon() {
  return <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H16V3.9c-.4-.1-1.3-.1-2.3-.1-2.4 0-4 1.4-4 4.1V10H7v3h2.7v8h3.8Z" /></svg>;
}

/**
 * Pie de las páginas de servicio, estilo Yellowball: fondo azul noche,
 * columnas de enlaces, párrafo de la marca y el nombre gigante recortado
 * por el borde inferior.
 */
export function ServiceFooter() {
  const { dict } = useLang();
  const year = new Date().getFullYear();
  const sf = dict.serviceFooter;
  const linkCls = "text-[#f6ede1]/55 transition-colors hover:text-[#f6ede1]";

  return (
    <footer className="relative overflow-hidden bg-[#131834] text-[#f6ede1]">
      {/* Guías verticales tenues, como en Yellowball */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute top-0 bottom-0 left-1/4 w-px bg-white/[0.05]" />
        <span className="absolute top-0 bottom-0 left-2/4 w-px bg-white/[0.05]" />
        <span className="absolute top-0 bottom-0 left-3/4 w-px bg-white/[0.05]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 pt-16 md:px-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:gap-10">
          {/* Contacto */}
          <div>
            <a
              href={`mailto:${EMAIL}`}
              className="text-2xl font-semibold tracking-tight break-all transition-colors hover:text-[#e8b13a] md:text-[1.7rem]"
            >
              {EMAIL}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block text-lg text-[#f6ede1]/70 transition-colors hover:text-[#f6ede1]"
            >
              {dict.footer.whatsapp} <span aria-hidden="true">↗</span>
            </a>
            <p className="mt-8 text-sm font-semibold">{dict.footer.follow}</p>
            <div className="mt-3 flex gap-2">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex size-10 items-center justify-center rounded-full border border-white/20 text-[#f6ede1]/80 transition hover:border-[#e8b13a] hover:text-[#e8b13a]"><InstagramIcon /></a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex size-10 items-center justify-center rounded-full border border-white/20 text-[#f6ede1]/80 transition hover:border-[#e8b13a] hover:text-[#e8b13a]"><LinkedInIcon /></a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex size-10 items-center justify-center rounded-full border border-white/20 text-[#f6ede1]/80 transition hover:border-[#e8b13a] hover:text-[#e8b13a]"><FacebookIcon /></a>
            </div>
            <p className="mt-10 text-sm text-[#f6ede1]/40">© Premium Work {year}</p>
          </div>

          {/* Servicios */}
          <nav aria-label={sf.servicesTitle}>
            <p className="text-sm font-semibold">{sf.servicesTitle}</p>
            <ul className="mt-5 space-y-3">
              {dict.serviceDetail.items.map((it, i) => (
                <li key={it.slug}>
                  <Link href={`/servicios/${it.slug}`} className={linkCls}>{dict.sectors.items[i]?.title ?? it.slug}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Enlaces */}
          <nav aria-label={sf.linksTitle}>
            <p className="text-sm font-semibold">{sf.linksTitle}</p>
            <ul className="mt-5 space-y-3">
              {NAV_HREFS.map((href, i) => (
                <li key={href}>
                  <Link href={href} className={linkCls}>{dict.header.nav[i]}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label={sf.legalTitle}>
            <p className="text-sm font-semibold">{sf.legalTitle}</p>
            <ul className="mt-5 space-y-3">
              {LEGAL_HREFS.map((href, i) => (
                <li key={href}>
                  <Link href={href} className={linkCls}>{dict.footer.legal[i]}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Párrafo de la marca */}
        <p className="mt-16 max-w-5xl text-base leading-relaxed text-[#f6ede1]/50 md:mt-20 md:text-lg">
          {dict.footer.tagline}
        </p>
      </div>

      {/* Nombre gigante recortado por el borde inferior */}
      <div aria-hidden="true" className="relative mt-4 overflow-hidden md:mt-6">
        <p
          className="translate-y-[24%] text-center font-black whitespace-nowrap text-[#f6ede1]/[0.05] select-none"
          style={{ fontSize: "12.6vw", lineHeight: 0.85, letterSpacing: "-0.02em" }}
        >
          PREMIUM WORK
        </p>
      </div>
    </footer>
  );
}
