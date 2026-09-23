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
  { text: "¿Servicio perfecto?", gold: false },
  { text: "Equipo correcto.", gold: true },
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

  return <section id="inicio" className="relative isolate overflow-hidden bg-[#0B1F3A] text-white md:min-h-screen">
    <div className="absolute inset-0 bg-[#0B1F3A] md:hidden" aria-hidden="true" />
    <div className="hidden md:block">
    <AnimatePresence mode="sync">
      <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .8 }} className="absolute inset-0">
        <picture className="absolute inset-0">
          <img src={slides[current].src} alt="Servicio Premium Work" className={`h-full w-full object-cover ${slides[current].mobilePosition} md:object-right md:object-top`} />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,31,58,.12)_0%,rgba(11,31,58,.22)_42%,rgba(11,31,58,.78)_100%)]" />
        <div className="absolute inset-y-0 left-0 w-2/3 bg-[linear-gradient(90deg,rgba(11,31,58,.55),transparent)]" />
      </motion.div>
    </AnimatePresence>
    <div className="hero-glow" aria-hidden="true" />
    </div>
    <div className="relative mx-auto flex min-h-[34rem] max-w-[1600px] items-end px-5 pb-16 pt-28 md:min-h-screen md:px-8 md:pb-28">
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="max-w-5xl">
        <p className="mb-4 text-[10px] font-bold uppercase leading-4 tracking-[.14em] text-[#e5c65a] sm:mb-5 sm:text-xs sm:tracking-[.18em]">Hospitality · eventos · excelencia</p>
        <h1 className="display max-w-[15ch] text-[clamp(2.2rem,10vw,3.4rem)] leading-[1.05] sm:text-7xl lg:text-8xl">
          {headlineLines.map((line, index) => (
            <span key={line.text} className="block overflow-hidden pb-1">
              <motion.span
                className={`block ${line.gold ? "font-normal text-[#e5c65a]" : ""} ${index > 0 ? "mt-2" : ""}`}
                initial={reducedMotion ? { opacity: 0 } : { y: "110%" }}
                animate={reducedMotion ? { opacity: 1 } : { y: "0%" }}
                transition={{ duration: reducedMotion ? .5 : .9, delay: reducedMotion ? .1 * index : .25 + index * .14, ease: [0.22, 1, 0.36, 1] }}
              >
                {line.text}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6, delay: reducedMotion ? .2 : .7 }} className="mt-6 max-w-[32rem] text-[15px] leading-6 text-white/85 sm:mt-7 sm:text-base sm:leading-7">Seleccionado, formado y supervisado a la medida de su marca</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6, delay: reducedMotion ? .3 : .85 }}>
          <a href="/solicitar-servicio" className="btn btn-gold mt-7 sm:mt-8">EMPRESAS / Solicitar servicio</a>
        </motion.div>
      </motion.div>
    </div>
    <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 xl:flex" aria-hidden="true">
      <span className="scroll-cue-label">Desliza</span>
      <span className="scroll-cue-line" />
    </div>
    <div className="absolute bottom-8 left-8 right-8 hidden items-end gap-6 md:flex">
      <div className="flex flex-1 gap-2">{slides.map((_, index) => <button aria-label={`Ver imagen ${index + 1}`} onClick={() => setCurrent(index)} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/40" key={index}><span className={`block h-full rounded-full bg-gradient-to-r from-[#C9A227] to-[#e5c65a] transition-all duration-500 ${index === current ? "w-full" : "w-0"}`} /></button>)}</div>
      <div className="flex border border-white/50"><button aria-label="Imagen anterior" onClick={() => go(-1)} className="p-3 hover:bg-white/15"><ArrowLeft size={18} /></button><button aria-label="Imagen siguiente" onClick={() => go(1)} className="border-l border-white/50 p-3 hover:bg-white/15"><ArrowRight size={18} /></button></div>
    </div>
  </section>;
}
