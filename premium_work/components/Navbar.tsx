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
  ["Inicio", "#inicio"],
  ["Acerca de nosotros", "#nosotros"],
  ["Contacto", "#contacto"]
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
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-[#0B1F3A]/10 bg-[#F8F7F4]/94 shadow-sm backdrop-blur"
          : "border-white/20 bg-[#0B1F3A]/20 text-white backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-8">

        {/* Logo */}
        <a
          href="#inicio"
          aria-label="Premium Work, Inicio"
          className="relative block h-16 w-60 md:h-20 md:w-72"
        >
          <Image
            src="/brand/logotipo-horizontal.svg"
            alt="Premium Work"
            fill
            priority
            sizes="192px"
            className={`object-contain transition-opacity ${
              scrolled ? "opacity-100" : "brightness-0 invert"
            }`}
          />
        </a>

        {/* Desktop menu */}
        <div className="hidden items-center gap-7 lg:flex">
          <a href="#inicio" className="text-sm font-semibold">Inicio</a>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
            onClick={() => setServicesOpen(!servicesOpen)}
            className="flex items-center gap-1 text-sm font-semibold"
          >
            Servicios <ChevronDown size={15} />
          </button>
          
            {servicesOpen && (
              <div className="absolute left-1/2 top-full w-60 -translate-x-1/2 pt-4">
                <div className={`border p-2 shadow-xl ${
                  scrolled
                    ? "border-[#0B1F3A]/10 bg-[#F8F7F4] text-[#0B1F3A]"
                    : "border-white/20 bg-[#0B1F3A]/95 text-white backdrop-blur"
                }`}>
                  {services.map((s) => (
                    <a
                      key={s}
                      href={`#${serviceId(s)}`}
                      onClick={() => setServicesOpen(false)}
                      className={`block px-4 py-3 text-sm transition-colors ${
                        scrolled
                          ? "hover:bg-[#0B1F3A] hover:text-white"
                          : "hover:bg-white/10"
                      }`}
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {links.slice(1).map(([name, href]) => (
            <a key={name} href={href} className="text-sm font-semibold">
              {name}
            </a>
          ))}
        </div>

        {/* Desktop CTA — disappears on mobile */}
        {!menu && (
          <a
            href="/registro"
            className="hidden rounded-sm bg-[#C9A227] px-5 py-3 text-sm font-bold text-[#0B1F3A] transition hover:scale-[1.03] active:scale-[.98] lg:block"
          >
            CANDIDATO / Registrarse
          </a>
        )}

        {/* Hamburger */}
        <button
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
          className={`fixed inset-0 z-50 h-screen overflow-y-auto px-5 pb-10 pt-6 lg:hidden transition-all ${
            scrolled
              ? "bg-[#F8F7F4] text-[#0B1F3A]"
              : "bg-[#0B1F3A]/95 text-white backdrop-blur"
          }`}
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
                      href={`#${serviceId(s)}`}
                      key={s}
                      className="block text-base"
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
                className="mt-6 block rounded-sm bg-[#C9A227] px-5 py-4 text-center text-base font-bold text-[#0B1F3A]"
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
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=info@premiumwork.es"
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
