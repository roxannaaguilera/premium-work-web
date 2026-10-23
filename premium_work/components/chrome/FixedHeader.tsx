"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { getLenis } from "@/lib/lenis-instance";
import { useLang } from "@/components/i18n/lang";

const MENU_LINKS: { href: string; action?: "footer" }[] = [
  { href: "/" },
  { href: "/servicios" },
  { href: "/nosotros" },
  { href: "#contacto", action: "footer" },
];

function LangToggle() {
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
              ? "bg-[#131834] text-[#faf6ee]"
              : "border border-[#131834]/25 text-[#131834]/60 hover:border-[#131834]/60 hover:text-[#131834]"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function FixedHeader({
  hideUntilTop = false,
  scrolledAway = false,
}: {
  hideUntilTop?: boolean;
  scrolledAway?: boolean;
}) {
  const { t, dict } = useLang();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const menuLogoRef = useRef<HTMLImageElement>(null);
  const LINKS = MENU_LINKS.map((l, i) => ({ ...l, label: dict.header.nav[i] }));
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
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
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideUntilTop]);

  const close = useCallback(() => setOpen(false), []);

  // Desplazar con Lenis cuando está activo; si no, scroll nativo suave.
  const scrollToTarget = (target: HTMLElement | number) => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target);
    else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  // CONTACTO baja al footer de la página (o a la página de contacto si
  // la página no tiene footer). SERVICIOS navega a la página de
  // servicios como cualquier otro enlace. Se espera a que el menú se
  // cierre para que el scroll no quede bloqueado.
  const handleMenuLink = (e: { preventDefault(): void }, l: (typeof LINKS)[number]) => {
    if (!l.action) {
      close();
      return;
    }
    e.preventDefault();
    close();
    window.setTimeout(() => {
      const el = document.getElementById("contacto") ?? document.querySelector("footer");
      if (el) scrollToTarget(el as HTMLElement);
      else window.location.href = "/solicitar-servicio";
    }, 350);
  };

  // El logo del menú lleva arriba, al header de la página.
  const goTop = () => {
    close();
    window.setTimeout(() => scrollToTarget(0), 350);
  };

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
      // El logo entra con un movimiento de ola (salvo movimiento reducido).
      const logo = menuLogoRef.current;
      if (logo && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const tl = gsap.timeline({ delay: 0.05, defaults: { ease: "sine.inOut" } });
        tl.fromTo(logo, { y: -36, opacity: 0 }, { y: 16, opacity: 1, duration: 0.35 })
          .to(logo, { y: -8, duration: 0.3 })
          .to(logo, { y: 0, duration: 0.25 });
      }
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
          (hidden || (hideUntilTop && scrolledAway)) && !open
            ? "-translate-y-full pointer-events-none opacity-0"
            : "translate-y-0 opacity-100"
        } ${open ? "pointer-events-none opacity-0" : ""}`}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 md:px-8 pt-7 md:pt-9 pb-3">
          <div className="justify-self-start">
            <LangToggle />
          </div>
          <a href="/" aria-label={t("header.logoLabel")} className="block justify-self-center">
            <img
              src="/images/logo-premium-work.png"
              alt="Premium Work"
              className="h-28 md:h-36 w-auto"
            />
          </a>
          <div className="flex items-center gap-2 justify-self-end">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              className="inline-flex items-center rounded-full bg-[#131834] px-5 py-2 text-sm font-semibold tracking-wide text-[#faf6ee] hover:bg-[#1e2450] transition-colors"
            >
              {t("header.menu")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-label={t("header.openMenu")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#131834] hover:bg-[#1e2450] transition-colors"
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
        className="fixed inset-0 z-[70] flex-col overflow-y-auto bg-[#131834] text-[#faf6ee]"
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 md:px-8 pt-7 md:pt-9 pb-3">
          <div aria-hidden="true" />
          <button
            type="button"
            onClick={goTop}
            aria-label={t("header.logoLabel")}
            className="justify-self-center cursor-pointer bg-transparent p-0"
          >
            <img
              ref={menuLogoRef}
              src="/images/logo-premium-work.png"
              alt="Premium Work"
              className="block h-28 md:h-36 w-auto [filter:brightness(0)_invert(1)]"
            />
          </button>
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
          <ul ref={linksRef} className="w-full">
            {LINKS.map((l, i) => {
              const active = isActive(l.href);
              // Simetría: INICIO pegado a la izquierda y CONTACTO pegado a
              // la derecha (mismo resguardo); SERVICIOS arranca en la mitad
              // de INICIO (18%) y NOSOTROS deja el mismo 18% a la derecha.
              const align = [
                "justify-start",
                "justify-center md:justify-start md:pl-[18%]",
                "justify-end pr-6 md:pr-[18%]",
                "justify-end",
              ][i];
              return (
                <li key={l.href} className="border-t border-[#faf6ee]/20 last:border-b">
                  <a
                    href={l.href}
                    onClick={(e) => handleMenuLink(e, l)}
                    className={`group flex py-3 md:py-4 ${align}`}
                  >
                    <span
                      className={`font-logo text-[clamp(3.75rem,min(11vw,14dvh),11rem)] font-semibold uppercase leading-none transition-colors ${
                        active ? "text-[#faf6ee]" : "text-[#faf6ee]/40 group-hover:text-[#faf6ee]"
                      }`}
                    >
                      {l.label.split("").map((ch, li) => (
                        <span
                          key={li}
                          aria-hidden="true"
                          className="pw-letter inline-block"
                          style={{ animationDelay: `${li * 45}ms` }}
                        >
                          {ch === " " ? "\u00A0" : ch}
                        </span>
                      ))}
                      <span className="sr-only">{l.label}</span>
                      {active && (
                        <span aria-hidden="true" className="ml-[0.3em] inline-block h-[0.18em] w-[0.18em] rotate-45 bg-[#eab308] align-middle" />
                      )}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
