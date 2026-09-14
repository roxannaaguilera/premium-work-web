"use client";

import { CookieSettingsButton } from "@/components/CookiePreferences";
import { ArrowUpRight, Mail } from "lucide-react";

const WHATSAPP_NUMBER = "34604858113";

const navigation = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

const services = ["Camareros/as", "Maîtres", "Office y Housekeeping", "Hostess", "Personal de cocina", "Supervisores"];

function InstagramIcon() {
  return <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></svg>;
}

function LinkedInIcon() {
  return <svg className="size-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.5 8.7H3.4V20h3.1V8.7ZM5 3.7A1.8 1.8 0 1 0 5 7.3a1.8 1.8 0 0 0 0-3.6ZM20.6 13.5c0-3.4-1.8-5-4.3-5-2 0-2.9 1.1-3.4 1.9V8.7H9.8V20h3.1v-5.6c0-1.5.3-3 2.1-3 1.9 0 1.9 1.8 1.9 3.1V20H20v-6.5h.6Z" /></svg>;
}

function FacebookIcon() {
  return <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H16V3.9c-.4-.1-1.3-.1-2.3-.1-2.4 0-4 1.4-4 4.1V10H7v3h2.7v8h3.8Z" /></svg>;
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contacto" className="brand-footer scroll-mt-[calc(5rem+1px)] min-h-[calc(100svh-5rem)] text-[#F8F7F4]">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col px-5 py-5 md:px-8 md:py-6 lg:px-10">
        <header className="flex shrink-0 items-center justify-between border-b border-white/15 pb-4">
          <p className="eyebrow flex items-center gap-2 text-white/60"><span className="text-[#C9A227]" aria-hidden="true">◆</span> Hablemos de su próximo servicio</p>

        </header>

        <div className="grid min-h-0 flex-1 gap-8 py-6 md:gap-14 lg:grid-cols-[1.35fr_.65fr] lg:py-7">
          <div className="flex min-h-0 flex-col justify-center">
            <p className="hidden max-w-lg text-sm leading-6 text-white/55 md:block">Diseñamos la operativa y cuidamos cada detalle para que su servicio esté a la altura de su marca.</p>
            <h2 className="display mt-4 text-[clamp(2.8rem,5.2vw,5.8rem)] leading-[1.12] !tracking-[-.025em] md:leading-[.95] md:!tracking-[-.05em] text-[#F8F7F4] md:mt-7">Hagamos que <em className="mt-2 block font-normal text-[#C9A227] md:mt-0 md:inline">todo funcione.</em></h2>
            <div className="mt-10 flex flex-wrap gap-3 md:mt-12">
              <a href="/solicitar-servicio" className="group inline-flex items-center gap-2 rounded-full bg-[#C9A227] px-5 py-3 text-sm font-bold text-[#0B1F3A] transition hover:-translate-y-0.5 hover:bg-[#e2be3d]">Solicitar un servicio <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
              <a href="mailto:hola@premiumwork.es" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-[#0B1F3A] active:translate-y-0"><Mail size={16} /> hola@premiumwork.es</a>
            </div>
          </div>

          <div className="flex flex-col items-start gap-7 border-t border-white/15 pt-5 sm:flex-row sm:items-center sm:gap-14 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div>
              <p className="eyebrow text-[#C9A227]">Atención comercial</p>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-white transition hover:text-[#C9A227]">Hablar por WhatsApp <ArrowUpRight size={17} /></a>
              <a href="mailto:hola@premiumwork.es" className="mt-2 block text-sm text-white/55 transition hover:text-white">hola@premiumwork.es</a>
            </div>
            <div>
              <p className="eyebrow text-[#C9A227]">Síguenos</p>
              <div className="mt-3 flex gap-2">
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex size-10 items-center justify-center rounded-full border border-white/20 transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-[#0B1F3A]"><InstagramIcon /></a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex size-10 items-center justify-center rounded-full border border-white/20 transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-[#0B1F3A]"><LinkedInIcon /></a>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex size-10 items-center justify-center rounded-full border border-white/20 transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-[#0B1F3A]"><FacebookIcon /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid shrink-0 gap-4 border-y border-white/15 py-4 sm:grid-cols-2 lg:grid-cols-[.65fr_1.35fr]">
          <nav aria-label="Navegación del pie de página" className="flex flex-wrap gap-x-5 gap-y-1">{navigation.map((item) => <a key={item.label} href={item.href} className="text-sm text-white/65 transition hover:text-[#C9A227]">{item.label}</a>)}</nav>
          <div className="flex flex-wrap gap-x-5 gap-y-3">{services.map((service) => <a key={service} href={`/#${service === "Camareros/as" ? "camareros" : service.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replaceAll(" ", "-")}`} className="text-sm text-white/65 transition hover:text-[#C9A227]">{service}</a>)}</div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 pb-12 pt-4 text-[0.62rem] uppercase tracking-[.12em] text-white/35">
          <p>© {year} Premium Work</p>
          <div className="flex flex-wrap gap-4"><a href="/aviso-legal" className="hover:text-white">Aviso legal</a><a href="/politica-de-privacidad" className="hover:text-white">Privacidad</a><a href="/politica-de-cookies" className="hover:text-white">Cookies</a><CookieSettingsButton className="hover:text-white" /></div>
        </div>
      </div>
    </footer>
  );
}
