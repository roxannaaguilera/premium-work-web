"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  { src: "/images/hero-1.webp", mobileSrc: "/images/hero-1-mobile.webp", mobilePosition: "object-[47%_center]" },
  { src: "/images/hero-2.webp", mobileSrc: "/images/hero-2-mobile.webp", mobilePosition: "object-[79%_center]" },
  { src: "/images/hero-3.webp", mobileSrc: "/images/hero-3-mobile.webp", mobilePosition: "object-[70%_center]" },
  { src: "/images/hero-4.webp", mobileSrc: "/images/hero-4-mobile.webp", mobilePosition: "object-[70%_center]" },
  { src: "/images/hero-5.webp", mobileSrc: "/images/hero-5-mobile.webp", mobilePosition: "object-[67%_center]" },
];

const headlineLines = [
  { text: "¿Servicio perfecto?", accent: false },
  { text: "Equipo correcto.", accent: true },
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const reducedMotion = useReducedMotion();
  const go = (amount: number) => setCurrent((slide) => (slide + amount + slides.length) % slides.length);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const id = window.setInterval(() => go(1), 5600);
    return () => window.clearInterval(id);
  }, []);

  return <section id="inicio" className="relative isolate overflow-hidden bg-white pt-28 text-[#131313] md:pt-36">
    <div className="hero-dots pointer-events-none absolute inset-0" aria-hidden="true" />
    <div className="hero-glow" aria-hidden="true" />

    <div className="relative mx-auto max-w-[1100px] px-5 text-center md:px-8">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
        <span className="pill-badge pill-badge--lime"><span aria-hidden="true">◆</span> Hospitality · Eventos · Hoteles</span>
      </motion.div>
      <h1 className="display mx-auto mt-6 max-w-[14ch] text-[clamp(2.6rem,9vw,4.6rem)]">
        {headlineLines.map((line, index) => (
          <span key={line.text} className="block overflow-hidden pb-1">
            <motion.span
              className={`block ${index > 0 ? "mt-1" : ""}`}
              initial={reducedMotion ? { opacity: 0 } : { y: "110%" }}
              animate={reducedMotion ? { opacity: 1 } : { y: "0%" }}
              transition={{ duration: reducedMotion ? .5 : .9, delay: reducedMotion ? .1 * index : .2 + index * .14, ease: [0.22, 1, 0.36, 1] }}
            >
              {line.accent ? <span className="box-decoration-clone bg-[#d2d943] px-3">{line.text}</span> : line.text}
            </motion.span>
          </span>
        ))}
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .6, delay: reducedMotion ? .2 : .65 }}
        className="mx-auto mt-6 max-w-[34rem] text-[15px] leading-7 text-[#4a5264] sm:text-base"
      >
        Profesionales de hospitality seleccionados, formados y supervisados a la medida de su marca.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .6, delay: reducedMotion ? .3 : .8 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <a href="/solicitar-servicio" className="btn btn-dark">Solicitar servicio</a>
        <a href="/registro" className="btn btn-outline">Soy profesional</a>
      </motion.div>
    </div>

    {/* Tarjeta fotográfica con carrusel */}
    <motion.div
      initial={{ opacity: 0, y: reducedMotion ? 0 : 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .8, delay: reducedMotion ? .2 : .5, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-12 max-w-[1280px] px-5 pb-16 md:px-8 md:pb-24"
    >
      <div className="group relative overflow-hidden rounded-[24px] border border-[#e5e7eb] shadow-[0_24px_64px_rgba(19,19,19,.1)]">
        <div className="relative aspect-[4/5] sm:aspect-[16/10] md:aspect-[21/10]">
          <AnimatePresence mode="sync">
            <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .8 }} className="absolute inset-0">
              <picture className="absolute inset-0">
                <source media="(max-width: 767px)" srcSet={slides[current].mobileSrc} />
                <img src={slides[current].src} alt="Servicio Premium Work" className={`h-full w-full object-cover ${slides[current].mobilePosition} md:object-center`} />
              </picture>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(11,11,11,.45)_100%)]" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 p-4 md:p-6">
          <div className="flex flex-1 gap-2">{slides.map((_, index) => <button aria-label={`Ver imagen ${index + 1}`} onClick={() => setCurrent(index)} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/50" key={index}><span className={`block h-full rounded-full bg-[#d2d943] transition-all duration-500 ${index === current ? "w-full" : "w-0"}`} /></button>)}</div>
          <div className="flex gap-2">
            <button aria-label="Imagen anterior" onClick={() => go(-1)} className="flex size-11 items-center justify-center rounded-full bg-white text-[#131313] shadow-md transition hover:bg-[#d2d943]"><ArrowLeft size={18} /></button>
            <button aria-label="Imagen siguiente" onClick={() => go(1)} className="flex size-11 items-center justify-center rounded-full bg-white text-[#131313] shadow-md transition hover:bg-[#d2d943]"><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  </section>;
}
