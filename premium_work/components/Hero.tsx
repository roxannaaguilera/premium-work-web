"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const headlineLines = [
  { text: "¿Servicio perfecto?", accent: false },
  { text: "Equipo correcto.", accent: true },
];

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="inicio"
      aria-label="El Portal — fachada del edificio Premium Work en Madrid"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#0a1428] pb-20 pt-28 text-white md:pt-36"
    >
      <img
        src="/images/edificio-fachada.jpg"
        alt="Fachada de un edificio madrileño al atardecer"
        loading="eager"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#0a1428]/75 via-[#0a1428]/45 to-[#0a1428]/85"
      />

      <div className="relative mx-auto w-full max-w-[1100px] px-5 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="pill-badge pill-badge--lime">
            <span aria-hidden="true" className="text-[#eab308]">◆</span> Estancia I · El Portal — Madrid
          </span>
        </motion.div>
        <h1 className="display mx-auto mt-6 max-w-[14ch] text-[clamp(2.6rem,9vw,4.6rem)]">
          {headlineLines.map((line, index) => (
            <span key={line.text} className="block overflow-hidden pb-1">
              <motion.span
                className={`block ${index > 0 ? "mt-1" : ""}`}
                initial={reducedMotion ? { opacity: 0 } : { y: "110%" }}
                animate={reducedMotion ? { opacity: 1 } : { y: "0%" }}
                transition={{ duration: reducedMotion ? 0.5 : 0.9, delay: reducedMotion ? 0.1 * index : 0.2 + index * 0.14, ease: [0.22, 1, 0.36, 1] }}
              >
                {line.accent ? (
                  <span className="box-decoration-clone bg-[#2451e6] px-3 text-white">{line.text}</span>
                ) : (
                  line.text
                )}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: reducedMotion ? 0.2 : 0.65 }}
          className="mx-auto mt-6 max-w-[34rem] text-[15px] leading-7 text-white/80 sm:text-base"
        >
          Profesionales de hospitality seleccionados, formados y supervisados a la medida de su marca.
          Esta es nuestra casa en Madrid: entre y descubra cada estancia.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: reducedMotion ? 0.3 : 0.8 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a href="#vestibulo" className="btn btn-lime">
            Entrar al edificio <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a href="/solicitar-servicio" className="btn btn-outline-on-dark">Solicitar servicio</a>
          <a href="/registro" className="btn btn-outline-on-dark">Soy profesional</a>
        </motion.div>
      </div>

      <motion.a
        href="#vestibulo"
        aria-label="Entrar al edificio"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70 transition hover:text-white"
      >
        <span className="scroll-cue-label !text-white/60">Entrar</span>
        <span className="scroll-cue-line !bg-white/25" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
