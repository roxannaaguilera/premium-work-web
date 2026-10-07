"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getLenis } from "@/lib/lenis-instance";

const LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

export default function FixedHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);

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
            ? "bg-[#faf6ee]/90 backdrop-blur-md border-b border-[#131834]/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-5 md:px-8 py-3">
          <a href="#inicio" aria-label="Premium Work — inicio" className="block">
            <img
              src="/images/logo-premium-work.png"
              alt="Premium Work"
              className="h-10 md:h-11 w-auto"
            />
          </a>
          <div className="flex items-center gap-3">
            <a
              href="#contacto"
              className="hidden md:inline-flex rounded-full border border-[#131834]/25 px-5 py-2 text-sm font-semibold text-[#131834] hover:bg-[#131834] hover:text-[#faf6ee] transition-colors"
            >
              Solicitar servicio
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              className="inline-flex items-center gap-2 rounded-full bg-[#131834] px-5 py-2 text-sm font-semibold tracking-wide text-[#faf6ee] hover:bg-[#1e2450] transition-colors"
            >
              MENÚ
              <span aria-hidden="true" className="inline-block h-2 w-2 rotate-45 bg-[#eab308]" />
            </button>
          </div>
        </div>
      </header>

      {/* Menú a pantalla completa */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
        style={{ display: "none", opacity: 0 }}
        className="fixed inset-0 z-[70] flex-col bg-[#131834] text-[#faf6ee]"
      >
        <div className="flex items-center justify-between px-5 md:px-8 py-3">
          <span className="font-serif text-xl md:text-2xl tracking-[0.25em] font-semibold">
            PREMIUM WORK
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar menú"
            className="inline-flex items-center gap-2 rounded-full border border-[#faf6ee]/30 px-5 py-2 text-sm font-semibold tracking-wide hover:bg-[#faf6ee] hover:text-[#131834] transition-colors"
          >
            CERRAR
            <span aria-hidden="true" className="text-lg leading-none">✕</span>
          </button>
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
          <span>Personal de hospitality para eventos en Madrid</span>
          <a href="#contacto" onClick={close} className="underline underline-offset-4 hover:text-[#eab308]">
            Solicitar servicio →
          </a>
        </div>
      </div>
    </>
  );
}
