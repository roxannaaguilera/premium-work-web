"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const services = ["Camareros", "Hostess", "Maîtres", "Office y Housekeeping", "Personal de cocina", "Supervisores"];
const links = [["Home", "#inicio"], ["Acerca de nosotros", "#nosotros"], ["Contacto", "#contacto"]];
const serviceId = (service: string) => service.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replaceAll(" ", "-");

export function Navbar() {
  const [menu, setMenu] = useState(false); const [servicesOpen, setServicesOpen] = useState(false); const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const handler = () => setScrolled(window.scrollY > 24); handler(); window.addEventListener("scroll", handler); return () => window.removeEventListener("scroll", handler); }, []);
  return <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-[#0B1F3A]/10 bg-[#F8F7F4]/94 shadow-sm backdrop-blur" : "border-white/20 bg-[#0B1F3A]/20 text-white backdrop-blur-sm"}`}>
    <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-8">
      <a href="#inicio" aria-label="Premium Work, Inicio" className="relative block h-16 w-60 md:h-20 md:w-72"><Image src="/brand/logotipo-horizontal.svg" alt="Premium Work" fill priority sizes="192px" className={`object-contain transition-opacity ${scrolled ? "opacity-100" : "brightness-0 invert"}`} /></a>
      <div className="hidden items-center gap-7 lg:flex">
        <a href="#inicio" className="text-sm font-semibold">Inicio</a>
        <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
          <button onClick={() => setServicesOpen(!servicesOpen)} className="flex items-center gap-1 text-sm font-semibold">Servicios <ChevronDown size={15} /></button>
          {servicesOpen && <div className="absolute left-1/2 top-full mt-4 w-60 -translate-x-1/2 border border-[#0B1F3A]/10 bg-[#F8F7F4] p-2 text-[#0B1F3A] shadow-xl">{services.map(s => <a key={s} href={`#${serviceId(s)}`} className="block px-4 py-3 text-sm hover:bg-[#0B1F3A] hover:text-white">{s}</a>)}</div>}
        </div>
        {links.slice(1).map(([name, href]) => <a key={name} href={href} className="text-sm font-semibold">{name}</a>)}
      </div>
      <a href="#contacto" className="hidden rounded-sm bg-[#C9A227] px-5 py-3 text-sm font-bold text-[#0B1F3A] transition hover:scale-[1.03] active:scale-[.98] sm:block">CANDIDATOS / Registrarse </a>
      <button aria-label={menu ? "Cerrar menú" : "Abrir menú"} onClick={() => setMenu(!menu)} className="p-2 lg:hidden">{menu ? <X /> : <Menu />}</button>
    </nav>
    {menu && <div className="border-t border-[#0B1F3A]/10 bg-[#F8F7F4] px-5 pb-5 text-[#0B1F3A] lg:hidden"><div className="mx-auto max-w-[1600px]">{links.map(([name, href]) => <a onClick={() => setMenu(false)} className="block border-b border-[#0B1F3A]/10 py-3 text-sm font-semibold" href={href} key={name}>{name}</a>)}<p className="pt-4 text-xs font-bold uppercase tracking-wider text-[#0B1F3A]/55">Servicios</p>{services.map(s => <a onClick={() => setMenu(false)} href={`#${serviceId(s)}`} key={s} className="block py-2 text-sm">{s}</a>)}<a href="#contacto" className="mt-3 block rounded-sm bg-[#C9A227] px-5 py-3 text-center text-sm font-bold">Agenda tu cita</a></div></div>}
  </header>;
}
