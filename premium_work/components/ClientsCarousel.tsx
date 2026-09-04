"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const sectors = [
  { title: "Hoteles", slug: "hoteles", src: "/images/serv-1-display.webp", position: "object-[50%_center]" },
  { title: "Restaurantes", slug: "restaurantes", src: "/images/serv-2-display.webp", position: "object-[50%_center]" },
  { title: "Catering", slug: "catering", src: "/images/serv-5-display.webp", position: "object-[50%_center]" },
  { title: "Eventos corporativos", slug: "eventos-corporativos", src: "/images/serv-4-display.webp", position: "object-[50%_20%]" },
  { title: "Congresos", slug: "congresos", src: "/images/serv-6-display.webp", position: "object-[50%_center]" },
  { title: "Ferias", slug: "ferias", src: "/images/serv-3-display.webp", position: "object-[50%_70%]" },
  { title: "Eventos deportivos", slug: "eventos-deportivos", src: "/images/hero-2.webp", position: "object-[60%_center]" },
  { title: "Festivales", slug: "festivales", src: "/images/hero-3.webp", position: "object-[55%_center]" },
  { title: "Bodas y celebraciones", slug: "bodas-y-celebraciones", src: "/images/hero-4.webp", position: "object-[50%_center]" },
  { title: "Espacios culturales", slug: "espacios-culturales", src: "/images/hero-5.webp", position: "object-[50%_center]" },
  { title: "Clubs y ocio", slug: "clubs-y-ocio", src: "/images/serv-4-display.webp", position: "object-[50%_35%]" },
  { title: "Experiencias privadas", slug: "experiencias-privadas", src: "/images/serv-1-display.webp", position: "object-[50%_center]" },
];

export function ClientsCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (paused) return;
    const interval = window.setInterval(() => setActive((current) => (current + 1) % sectors.length), 3800);
    return () => window.clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    const rail = railRef.current;
    const card = cardsRef.current[active];
    if (!rail || !card) return;
    rail.scrollTo({ left: card.offsetLeft - (rail.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
  }, [active]);

  const move = (direction: number) => setActive((current) => (current + direction + sectors.length) % sectors.length);

  return (
    <section className="flex min-h-[calc(100svh-5rem)] flex-col justify-center overflow-hidden bg-[#F8F7F4] py-10 md:py-12">
      <div className="mx-auto mb-8 flex w-full max-w-[1600px] items-center justify-between gap-5 px-5 md:mb-10 md:px-8 lg:px-10">
        <div className="flex items-center gap-3 text-[#C9A227]">
          <span className="text-sm" aria-hidden="true">◆</span>
          <p className="eyebrow text-[#0B1F3A]/70">Sectores para los que diseñamos nuestros servicios</p>
        </div>
        <div className="hidden items-center border border-[#0B1F3A]/20 md:flex">
          <button type="button" onClick={() => move(-1)} aria-label="Sector anterior" className="p-3 transition hover:bg-[#0B1F3A] hover:text-white"><ArrowLeft size={18} /></button>
          <button type="button" onClick={() => move(1)} aria-label="Siguiente sector" className="border-l border-[#0B1F3A]/20 p-3 transition hover:bg-[#0B1F3A] hover:text-white"><ArrowRight size={18} /></button>
        </div>
      </div>

      <div ref={railRef} className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[14vw] pb-6 md:gap-6 md:px-[22vw]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)}>
        {sectors.map((sector, index) => {
          const isActive = index === active;
          return (
            <a key={sector.slug} ref={(element) => { cardsRef.current[index] = element; }} href={`/solicitar-servicio?sector=${sector.slug}`} onFocus={() => setActive(index)} onClick={() => setActive(index)} className={`group relative h-[clamp(22rem,58svh,34rem)] min-w-[72vw] snap-center overflow-hidden bg-[#0B1F3A] transition-all duration-700 ease-out md:min-w-[34vw] ${isActive ? "scale-100 opacity-100 grayscale-0 shadow-2xl" : "scale-[.92] opacity-35 grayscale"}`}>
              <img src={sector.src} alt={sector.title} loading={index < 3 ? "eager" : "lazy"} decoding="async" className={`h-full w-full object-cover ${sector.position} transition duration-700 group-hover:scale-105`} />
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,31,58,.02)_40%,rgba(11,31,58,.9)_100%)]" />
              <span className="absolute inset-x-0 bottom-0 p-6 text-xl font-bold uppercase leading-tight tracking-[.1em] text-white md:p-8 md:text-2xl">{sector.title}</span>
            </a>
          );
        })}
      </div>

      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 text-xs font-semibold uppercase tracking-[.14em] text-[#0B1F3A]/55 md:px-8">
        <span>{String(active + 1).padStart(2, "0")} / {String(sectors.length).padStart(2, "0")}</span>
        <span>Selecciona un sector para solicitar un servicio</span>
      </div>
    </section>
  );
}
