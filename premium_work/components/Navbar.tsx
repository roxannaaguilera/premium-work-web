"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { serviceLabels } from "@/lib/service-options";

const services = Object.entries(serviceLabels);

const links = [
  ["Inicio", "/#inicio"],
  ["Profesionales", "/registro"],
  ["Contacto", "/#contacto"],
];

export function Navbar() {
  const [menu, setMenu] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenu(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", closeOnEscape); };
  }, [menu]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`brand-navbar fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "brand-navbar--scrolled" : ""
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-8">

        {/* Logo: marca blanca sobre pastilla negra */}
        <a
          href="/#inicio"
          aria-label="Premium Work, Inicio"
          className="shrink-0 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 shadow-sm transition-shadow hover:shadow-md"
        >
          <Image
            src="/brand/logotipo-horizontal.svg"
            alt="Premium Work"
            width={190}
            height={63}
            priority
            sizes="190px"
            className="h-9 w-auto"
          />
        </a>

        {/* Desktop menu */}
        <div className="hidden items-center gap-7 lg:flex">
          <a href="/#inicio" className="nav-link text-sm font-semibold">Inicio</a>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              className="nav-link flex items-center gap-1 text-sm font-semibold"
            >
              Servicios <ChevronDown size={15} aria-hidden="true" />
            </button>

            {servicesOpen && (
              <div className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-4">
                <div className="rounded-2xl border border-[#e5e7eb] bg-white p-2 shadow-[0_24px_64px_rgba(19,19,19,.12)]">
                  {services.map(([slug, label]) => (
                    <a
                      key={slug}
                      href={`/#${slug}`}
                      onClick={() => setServicesOpen(false)}
                      className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#131313] transition-colors hover:bg-[#f2f6d8]"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {links.slice(1).map(([name, href]) => (
            <a key={name} href={href} className="nav-link text-sm font-semibold">
              {name}
            </a>
          ))}
        </div>

        {/* Desktop CTA — disappears on mobile */}
        {!menu && (
          <a
            href="/solicitar-servicio"
            className="btn btn-dark hidden !min-h-0 !px-6 !py-3 text-sm lg:inline-flex"
          >
            Solicitar servicio
          </a>
        )}

        {/* Hamburger */}
        <button
          aria-expanded={menu}
          aria-controls="mobile-navigation"
          aria-label={menu ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenu(!menu)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#131313] lg:hidden"
        >
          {menu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Fullscreen Menu */}
      {menu && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-50 h-[100dvh] overflow-y-auto bg-white px-5 pb-10 pt-6 text-[#131313] lg:hidden"
        >
          <div className="mx-auto max-w-[1600px]">

            {/* Close button */}
            <button
              aria-label="Cerrar menú"
              onClick={() => setMenu(false)}
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#e5e7eb]"
            >
              <X size={22} />
            </button>

            <div className="mt-14 space-y-6">

              {/* Main links */}
              {links.map(([name, href]) => (
                <a
                  onClick={() => setMenu(false)}
                  className="block text-lg font-bold"
                  href={href}
                  key={name}
                >
                  {name}
                </a>
              ))}

              {/* Services */}
              <div className="pt-4">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8b8b8b]">
                  Servicios
                </p>

                <div className="mt-3 grid gap-1 sm:grid-cols-2">
                  {services.map(([slug, label]) => (
                    <a
                      onClick={() => setMenu(false)}
                      href={`/#${slug}`}
                      key={slug}
                      className="flex min-h-11 items-center rounded-xl px-3 text-base font-semibold transition hover:bg-[#f6f6f6]"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <a
                href="/solicitar-servicio"
                onClick={() => setMenu(false)}
                className="btn btn-dark mt-6 w-full"
              >
                Solicitar servicio
              </a>
              <a
                href="/registro"
                onClick={() => setMenu(false)}
                className="btn btn-outline w-full"
              >
                Soy profesional
              </a>

              {/* Footer */}
              <div className="mt-10 border-t border-[#e5e7eb] pt-6 text-sm">
                <p className="mb-3 font-bold">Contacto</p>

                <a
                  href="https://api.whatsapp.com/send/?phone=34604858113"
                  className="block py-2"
                  target="_blank"
                >
                  WhatsApp
                </a>

                <a
                  href="mailto:hola@premiumwork.es"
                  className="block py-2"
                  target="_blank"
                >
                  Email: hola@premiumwork.es
                </a>

                <p className="mt-6 text-xs text-[#8b8b8b]">
                  © {new Date().getFullYear()} Premium Work
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
