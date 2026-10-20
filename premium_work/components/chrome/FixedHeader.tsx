"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getLenis } from "@/lib/lenis-instance";
import { useLang } from "@/components/i18n/lang";

const LINK_HREFS = ["/", "/servicios", "/nosotros", "/solicitar-servicio"];

function LangToggle() {
  const { lang, setLang } = useLang();
  const next = lang === "es" ? "en" : "es";
  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={lang === "es" ? "Español" : "English"}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#131834] text-xs font-bold uppercase tracking-wider text-[#faf6ee]"
    >
      {lang}
    </button>
  );
}

export default function FixedHeader({ hideUntilTop = false }: { hideUntilTop?: boolean }) {
  const { t, dict } = useLang();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const LINKS = LINK_HREFS.map((href, i) => ({ href, label: dict.header.nav[i] }));

  useEffect(() => {
    const onScroll = () => {
      const overlay = document.querySelector("[data-pw-service-scroll]") as HTMLElement | null;
      const y = overlay ? overlay.scrollTop : window.scrollY || document.documentElement.scrollTop || 0;
      if (hideUntilTop) {
        // Service pages: visible only at rest. Any scroll hides it until the top.
        setHidden(y > 16);
      } else if (y <= 8) setHidden(false);
      else if (y > lastY.current + 6) setHidden(true);
      else if (y < lastY.current - 6) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pw-detail-scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pw-detail-scroll", onScroll);
    };
  }, [hideUntilTop]);

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
        className={`fixed inset-x-0 top-0 z-[60] border-b border-transparent bg-transparent transition-[transform,translate,opacity] duration-300 ${
          hidden && !open ? "-translate-y-full pointer-events-none opacity-0" : "translate-y-0 opacity-100"
        } ${open ? "pointer-events-none opacity-0" : ""}`}
      >
        <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center px-3 pt-3 pb-2 md:grid-cols-[4.5rem_minmax(0,1fr)_4.5rem] md:px-8 md:pt-9 md:pb-3">
          <div className="justify-self-start">
            <LangToggle />
          </div>
          <a href="/" aria-label={t("header.logoLabel")} className="block min-w-0 justify-self-center">
            <img
              src="/images/logo-premium-work.png"
              alt="Premium Work"
              className="mx-auto h-12 w-auto max-w-[calc(100vw-8.5rem)] object-contain md:h-36 md:max-w-[42vw]"
            />
          </a>
          <div className="flex items-center justify-self-end">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-label={t("header.openMenu")}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#131834] hover:bg-[#1e2450] transition-colors"
            >
              <span aria-hidden="true" className="flex w-[22px] flex-col gap-1">
                <span className="block h-[3px] w-full rounded-full bg-[#faf6ee]" />
                <span className="block h-[3px] w-full rounded-full bg-[#faf6ee]" />
                <span className="block h-[3px] w-full rounded-full bg-[#faf6ee]" />
              </span>
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
        className="fixed inset-0 z-[70] flex-col overflow-y-auto bg-[#131834] text-[#faf6ee]"
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 pt-4 pb-3 md:px-8 md:pt-9">
          <div aria-hidden="true" />
          <span className="justify-self-center font-serif text-base font-semibold tracking-[0.14em] md:text-2xl md:tracking-[0.25em]">
            PREMIUM WORK
          </span>
          <div className="flex items-center justify-self-end">
            <button
              type="button"
              onClick={close}
              aria-label={t("header.closeMenu")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#faf6ee]/40 text-[#faf6ee] hover:bg-[#faf6ee] hover:text-[#131834] transition-colors"
            >
              <span aria-hidden="true" className="text-lg leading-none">✕</span>
            </button>
          </div>
        </div>
        <nav className="flex flex-1 items-center px-4 md:px-16">
          <ul ref={linksRef} className="w-full space-y-2 md:space-y-4">
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
                  <span className="font-serif text-[clamp(2.25rem,12vw,4.5rem)] font-semibold leading-none text-[#faf6ee] transition-colors group-hover:text-[#eab308] md:text-7xl md:leading-tight">
                    {l.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between px-5 md:px-16 pb-8 text-sm text-[#faf6ee]/70">
          <span>{t("header.tagline")}</span>
          <a href="/solicitar-servicio" onClick={close} className="underline underline-offset-4 hover:text-[#eab308]">
            {t("header.requestService")} →
          </a>
        </div>
      </div>
    </>
  );
}
