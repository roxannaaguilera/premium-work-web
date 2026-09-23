"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import carouselImages from "@/lib/carousel-images.json";

const sectors = [
  { title: "Hoteles", slug: "hoteles", src: "/images/serv-hoteles.webp", position: "object-[50%_center]" },
  { title: "Restaurantes", slug: "restaurantes", src: "/images/serv-restaurants.webp", position: "object-[50%_center]" },
  { title: "Catering", slug: "catering", src: "/images/serv-catering.webp", position: "object-[50%_center]" },
  { title: "Eventos corporativos", slug: "eventos-corporativos", src: "/images/serv-eventos-corporativos.webp", position: "object-[50%_20%]" },
  { title: "Eventos deportivos", slug: "eventos-deportivos", src: "/images/serv-eventos-deportivos.webp", position: "object-[60%_center]" },
  { title: "Festivales", slug: "festivales", src: "/images/serv-festivales.webp", position: "object-[55%_center]" },
  { title: "Bodas y celebraciones", slug: "bodas-y-celebraciones", src: "/images/serv-bodas-celebraciones.webp", position: "object-[50%_center]" },
  { title: "Eventos privados", slug: "experiencias-privadas", src: "/images/serv-eventos-priv.webp", position: "object-[50%_center]" },
];

const slides = [...sectors, ...sectors, ...sectors];

export function ClientsCarousel() {
  const [position, setPosition] = useState(sectors.length);
  const [animated, setAnimated] = useState(true);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const active = ((position % sectors.length) + sectors.length) % sectors.length;

  const move = (direction: number) => {
    setAnimated(true);
    setPosition((current) => Math.max(0, Math.min(slides.length - 1, current + direction)));
  };

  useEffect(() => {
    if (paused) return;
    const interval = window.setInterval(() => {
      setAnimated(true);
      setPosition((current) => current + 1);
    }, 3000);
    return () => window.clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    if (position >= sectors.length && position < sectors.length * 2) return;
    const timeout = window.setTimeout(() => {
      setAnimated(false);
      setPosition(sectors.length + active);
    }, 560);
    return () => window.clearTimeout(timeout);
  }, [position, active]);

  return (
    <section aria-label="Sectores para los que trabajamos" aria-roledescription="carrusel" className="relative isolate overflow-hidden bg-white py-12 md:py-16">
      <div className="mx-auto mb-8 flex w-full max-w-[1600px] items-center gap-3 px-5 md:mb-10 md:px-8 lg:px-10">
        <span className="text-sm text-[#6e7a10]" aria-hidden="true">◆</span>
        <h2 className="eyebrow text-[#4a5264]">Sectores para los que diseñamos nuestros servicios</h2>
      </div>
      <div className="relative mx-auto max-w-[1600px] md:px-14" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
        <button type="button" onClick={() => move(-1)} aria-label="Sector anterior" className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-[#e5e7eb] bg-white p-3 text-[#131313] shadow-md transition hover:bg-[#d2d943] md:block"><ChevronLeft size={22} /></button>
        <div className="sectors-viewport overflow-hidden py-2" onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; setPaused(true); }} onTouchEnd={(event) => { if (touchStart.current !== null) { const distance = touchStart.current - event.changedTouches[0].clientX; if (Math.abs(distance) > 40) move(distance > 0 ? 1 : -1); } touchStart.current = null; setPaused(false); }} onTouchCancel={() => { touchStart.current = null; setPaused(false); }}>
          <div className="sectors-track flex" style={{ transform: `translateX(calc(50% - var(--sector-width) / 2 - ${position} * (var(--sector-width) + var(--sector-gap))))`, transition: animated ? "transform 550ms ease" : "none" }}>
            {slides.map((sector, index) => {
              const visible = Math.abs(index - position) <= 1;
              const image = carouselImages[sector.src as keyof typeof carouselImages];
              return (
                <a key={`${sector.slug}-${index}`} href={`/solicitar-servicio?sector=${sector.slug}`} tabIndex={visible ? 0 : -1} aria-hidden={!visible} className="sector-card card group relative shrink-0 overflow-hidden !rounded-[20px] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#6e7a10]">
                  <picture>
                    <source media="(min-width: 768px)" srcSet={image.desktop.srcSet} sizes="(min-width: 1600px) 447px, calc(30vw - 33.6px)" width={image.desktop.width} height={image.desktop.height} />
                    <img src={image.mobile.src} srcSet={image.mobile.srcSet} sizes="76vw" width={image.mobile.width} height={image.mobile.height} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </picture>
                  <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="display absolute inset-x-0 bottom-0 p-5 text-2xl font-semibold leading-tight text-white lg:p-6 lg:text-3xl">{sector.title}</span>
                </a>
              );
            })}
          </div>
        </div>
        <button type="button" onClick={() => move(1)} aria-label="Siguiente sector" className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-[#e5e7eb] bg-white p-3 text-[#131313] shadow-md transition hover:bg-[#d2d943] md:block"><ChevronRight size={22} /></button>
      </div>
      <div className="mt-5 flex justify-center" aria-label="Seleccionar sector">
        {sectors.map((sector, index) => (
          <button key={sector.slug} type="button" aria-label={`Ver ${sector.title}`} aria-current={active === index ? "true" : undefined} onClick={() => { setAnimated(true); setPosition(sectors.length + index); }} className="flex h-8 w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#131313] md:w-7">
            <span className={`h-2.5 w-2.5 rounded-full transition-colors md:h-3 md:w-3 ${active === index ? "bg-[#131313]" : "bg-[#d4d4d4]"}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
