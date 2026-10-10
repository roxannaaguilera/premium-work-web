"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getLenis } from "@/lib/lenis-instance";
import { useLang } from "@/components/i18n/lang";

const LINK_HREFS = ["#inicio", "#servicios", "#nosotros", "#contacto"];

function LangToggle({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div role="group" aria-label="Language / Idioma" className="flex items-center gap-2">
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={l === "es" ? "Español" : "English"}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
            lang === l
              ? dark
                ? "bg-[#faf6ee] text-[#131834]"
                : "bg-[#131834] text-[#faf6ee]"
              : dark
                ? "border border-white/25 text-white/60 hover:border-white/60 hover:text-white"
                : "border border-[#131834]/25 text-[#131834]/60 hover:border-[#131834]/60 hover:text-[#131834]"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function FixedHeader({ dark = false }: { dark?: boolean }) {
  const { t, dict } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const LINKS = LINK_HREFS.map((href, i) => ({ href, label: dict.header.nav[i] }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Bloqueo de scroll + animación de apertura/cierre del menú
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(
        overlay,
        { opacity: 0, yPercent: -4 },
        { opacity: 1, yPercent: 0, duration: 0.45, ease: "power3.out" }
      );
      const items = linksRef.current?.querySelectorAll("li");
      if (items?.length) {
        gsap.fromTo(
          items,
          { y: 44, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: "power3.out", delay: 0.12 }
        );
      }
    } else {
      document.body.style.overflow = "";
      lenis?.start();
      if (overlay.style.display !== "none") {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => gsap.set(overlay, { display: "none" }),
        });
      }
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-300 ${
          scrolled
            ? dark
              ? "bg-[#131834]/90 backdrop-blur-md border-b border-white/10"
              : "bg-[#fdf3eb]/90 backdrop-blur-md border-b border-[#131834]/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 md:px-8 pt-7 md:pt-9 pb-3">
          <div className="justify-self-start">
            <LangToggle dark={dark} />
          </div>
          <a href="#inicio" aria-label={t("header.logoLabel")} className="block justify-self-center">
            <img
              src="/images/logo-premium-work.png"
              alt="Premium Work"
              className={`h-28 md:h-36 w-auto${dark ? " invert" : ""}`}
            />
          </a>
          <div className="flex items-center gap-2 justify-self-end">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              className={`inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold tracking-wide transition-colors ${
                dark
                  ? "bg-[#faf6ee] text-[#131834] hover:bg-white"
                  : "bg-[#131834] text-[#faf6ee] hover:bg-[#1e2450]"
              }`}
            >
              {t("header.menu")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-label={t("header.openMenu")}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                dark ? "bg-[#faf6ee] hover:bg-white" : "bg-[#131834] hover:bg-[#1e2450]"
              }`}
            >
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rotate-45 bg-[#eab308]" />
            </button>
          </div>
        </div>
      </header>

      {/* Menú a pantalla completa */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("header.menuLabel")}
        style={{ display: "none", opacity: 0 }}
        className="fixed inset-0 z-[70] flex-col bg-[#131834] text-[#faf6ee]"
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 md:px-8 pt-7 md:pt-9 pb-3">
          <div aria-hidden="true" />
          <span className="font-serif text-xl md:text-2xl tracking-[0.25em] font-semibold justify-self-center">
            PREMIUM WORK
          </span>
          <div className="flex items-center justify-self-end">
            <button
              type="button"
              onClick={close}
              aria-label={t("header.closeMenu")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#faf6ee]/40 text-[#faf6ee] hover:bg-[#faf6ee] hover:text-[#131834] transition-colors"
            >
              <span aria-hidden="true" className="text-lg leading-none">✕</span>
            </button>
          </div>
        </div>
        <nav className="flex flex-1 items-center px-5 md:px-16">
          <ul ref={linksRef} className="space-y-2 md:space-y-4">
            {LINKS.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={close}
                  className="group flex items-baseline gap-4 md:gap-6"
                >
                  <span className="text-sm text-[#faf6ee]/50 font-mono">
                    0{i + 1}
                  </span>
                  <span className="font-serif text-5xl md:text-7xl font-semibold leading-tight text-[#faf6ee] group-hover:text-[#eab308] transition-colors">
                    {l.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between px-5 md:px-16 pb-8 text-sm text-[#faf6ee]/70">
          <span>{t("header.tagline")}</span>
          <a href="#contacto" onClick={close} className="underline underline-offset-4 hover:text-[#eab308]">
            {t("header.requestService")} →
          </a>
        </div>
      </div>
    </>
  );
}
