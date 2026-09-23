"use client";

import { motion, useReducedMotion } from "framer-motion";

const headlineLines = [
  { text: "¿Servicio perfecto?", accent: false },
  { text: "Equipo correcto.", accent: true },
];

export function Hero() {
  const reducedMotion = useReducedMotion();

  return <section id="inicio" className="relative isolate overflow-hidden bg-white pb-20 pt-28 text-[#131313] md:pb-28 md:pt-36">
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
  </section>;
}
