"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const services = [
  "Camareros",
  "Maîtres",
  "Office y Housekeeping",
  "Hostess",
  "Personal de cocina",
  "Supervisores"
];

const links = [
  ["Inicio", "/#inicio"],
  ["Acerca de nosotros", "/#nosotros"],
  ["Contacto", "/#contacto"]
];

const serviceId = (service: string) =>
  service.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replaceAll(" ", "-");
    

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
      className={`brand-navbar fixed inset-x-0 top-0 z-50 border-b text-white transition-all duration-300 ${
        scrolled
          ? "brand-navbar--scrolled border-white/15"
          : "border-white/15"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-8">

        {/* Logo */}
        <a
          href="/#inicio"
          aria-label="Premium Work, Inicio"
          className="relative block h-16 w-[min(60vw,15rem)] shrink-0 md:h-20 md:w-72"
        >
          <Image
            src="/brand/logotipo-horizontal.svg"
            alt="Premium Work"
            fill
            priority
            sizes="192px"
            className="object-contain brightness-0 invert transition-opacity"
          />
        </a>

        {/* Desktop menu */}
        <div className="hidden items-center gap-7 lg:flex">
          <a href="/#inicio" className="text-sm font-semibold transition-colors hover:text-[#e5c65a]">Inicio</a>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
            onClick={() => setServicesOpen(!servicesOpen)}
            className="flex items-center gap-1 text-sm font-semibold transition-colors hover:text-[#e5c65a]"
          >
            Servicios <ChevronDown size={15} />
          </button>
          
            {servicesOpen && (
              <div className="absolute left-1/2 top-full w-60 -translate-x-1/2 pt-4">
                <div className="border border-white/15 bg-[#0B1F3A]/90 p-2 text-white shadow-xl backdrop-blur-xl">
                  {services.map((s) => (
                    <a
                      key={s}
                      href={`/#${serviceId(s)}`}
                      onClick={() => setServicesOpen(false)}
                      className="block px-4 py-3 text-sm transition-colors hover:bg-white/10 hover:text-[#e5c65a]"
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {links.slice(1).map(([name, href]) => (
            <a key={name} href={href} className="text-sm font-semibold transition-colors hover:text-[#e5c65a]">
              {name}
            </a>
          ))}
        </div>

        {/* Desktop CTA — disappears on mobile */}
        {!menu && (
          <a
            href="/registro"
            className="hidden rounded-full bg-[#C9A227] px-5 py-3 text-sm font-bold text-[#0B1F3A] transition hover:-translate-y-0.5 hover:bg-[#e2be3d] active:translate-y-0 lg:block"
          >
            CANDIDATO / Registrarse
          </a>
        )}

        {/* Hamburger */}
        <button
          aria-expanded={menu}
          aria-controls="mobile-navigation"
          aria-label={menu ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenu(!menu)}
          className="p-2 lg:hidden"
        >
          {menu ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Fullscreen Menu */}
      {menu && (
        <div
          id="mobile-navigation" className="brand-navbar fixed inset-0 z-50 h-[100dvh] overflow-y-auto px-5 pb-10 pt-6 text-white transition-all lg:hidden"
        >
          <div className="mx-auto max-w-[1600px]">

            {/* Close button */}
            <button
              aria-label="Cerrar menú"
              onClick={() => setMenu(false)}
              className="absolute right-5 top-5 p-2"
            >
              <X size={28} />
            </button>

            <div className="mt-14 space-y-6">

              {/* Main links */}
              {links.map(([name, href]) => (
                <a
                  onClick={() => setMenu(false)}
                  className="block text-lg font-semibold"
                  href={href}
                  key={name}
                >
                  {name}
                </a>
              ))}

              {/* Services */}
              <div className="pt-4">
                <p className="text-xs font-bold uppercase tracking-wider opacity-60">
                  Servicios
                </p>

                <div className="mt-3 space-y-3">
                  {services.map((s) => (
                    <a
                      onClick={() => setMenu(false)}
                      href={`/#${serviceId(s)}`}
                      key={s}
                      className="flex min-h-11 items-center text-base"
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <a
                href="/registro"
                onClick={() => setMenu(false)}
                className="mt-6 block rounded-full bg-[#C9A227] px-5 py-4 text-center text-base font-bold text-[#0B1F3A] transition hover:-translate-y-0.5 hover:bg-[#e2be3d] active:translate-y-0"
              >
                CANDIDATO / Registrarse
              </a>

              {/* Footer */}
              <div className="mt-10 border-t pt-6 text-sm opacity-90">
                <p className="font-semibold mb-3">Contacto</p>

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

                <p className="mt-6 text-xs opacity-70">
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
