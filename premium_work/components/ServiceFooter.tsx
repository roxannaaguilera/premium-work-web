"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
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
 * columnas de enlaces y el nombre gigante recortado por el borde inferior.
 *
 * Al hacer scroll, cada bloque aparece y desaparece en orden de izquierda
 * a derecha (contacto, servicios, enlaces, legal y, por último, el
 * logo gigante); al subir y bajar se vuelve a animar. Con movimiento
 * reducido no hay animación.
 */
function Reveal({ index, className, children }: { index: number; className?: string; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: -32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ServiceFooter() {
  const { dict } = useLang();
  const year = new Date().getFullYear();
  const sf = dict.serviceFooter;
  const linkCls = "text-[#f6ede1]/55 transition-colors hover:text-[#f6ede1]";

  return (
    <footer id="contacto" className="relative flex min-h-dvh flex-col overflow-hidden bg-[#131834] text-[#f6ede1]">
      {/* Guías verticales tenues, como en Yellowball */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute top-0 bottom-0 left-1/4 w-px bg-white/[0.05]" />
        <span className="absolute top-0 bottom-0 left-2/4 w-px bg-white/[0.05]" />
        <span className="absolute top-0 bottom-0 left-3/4 w-px bg-white/[0.05]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 pt-12 md:px-10 md:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:gap-10">
          {/* Contacto */}
          <Reveal index={0} className="col-span-2 md:col-span-1">
            <a
              href={`mailto:${EMAIL}`}
              className="font-logo text-[1.4rem] font-semibold tracking-tight break-all transition-colors hover:text-[#e8b13a] md:text-[1.7rem]"
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
          </Reveal>

          {/* Servicios */}
          <Reveal index={1}>
          <nav aria-label={sf.servicesTitle}>
            <p className="font-logo text-sm font-semibold">{sf.servicesTitle}</p>
            <ul className="mt-5 space-y-3">
              {dict.serviceDetail.items.map((it, i) => (
                <li key={it.slug}>
                  <Link href={`/servicios/${it.slug}`} className={linkCls}>{dict.sectors.items[i]?.title ?? it.slug}</Link>
                </li>
              ))}
            </ul>
          </nav>
          </Reveal>

          {/* Enlaces */}
          <Reveal index={2}>
          <nav aria-label={sf.linksTitle}>
            <p className="font-logo text-sm font-semibold">{sf.linksTitle}</p>
            <ul className="mt-5 space-y-3">
              {NAV_HREFS.map((href, i) => (
                <li key={href}>
                  <Link href={href} className={linkCls}>{dict.header.nav[i]}</Link>
                </li>
              ))}
            </ul>
          </nav>
          </Reveal>

          {/* Legal */}
          <Reveal index={3}>
          <nav aria-label={sf.legalTitle}>
            <p className="font-logo text-sm font-semibold">{sf.legalTitle}</p>
            <ul className="mt-5 space-y-3">
              {LEGAL_HREFS.map((href, i) => (
                <li key={href}>
                  <Link href={href} className={linkCls}>{dict.footer.legal[i]}</Link>
                </li>
              ))}
            </ul>
          </nav>
          </Reveal>
        </div>
      </div>

      {/* Nombre gigante recortado por el borde inferior */}
      <Reveal index={5} className="relative mt-4 overflow-hidden md:mt-6">
      <div aria-hidden="true" className="px-5 md:px-10">
        <p
          className="font-logo translate-y-[24%] text-center font-black whitespace-nowrap text-[#f6ede1]/[0.05] select-none transition-[-webkit-text-stroke-color] duration-300 [-webkit-text-stroke:1.5px_transparent] hover:[-webkit-text-stroke-color:#eab308] text-[calc((100vw_-_40px)/8.566)] md:text-[calc((100vw_-_80px)/8.566)]"
          style={{ lineHeight: 0.85, letterSpacing: "-0.02em" }}
        >
          PREMIUM WORK<span className="text-[#eab308]">.</span>
        </p>
      </div>
      </Reveal>
    </footer>
  );
}
