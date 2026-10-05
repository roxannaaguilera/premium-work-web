"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";

/**
 * El Vestíbulo — transición inmersiva entre la fachada (Hero)
 * y la Sala de Servicios. Estancia II del recorrido.
 */
export function Lobby() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="vestibulo"
      aria-label="El Vestíbulo"
      className="relative flex min-h-[100svh] scroll-mt-[calc(5rem+1px)] items-center overflow-hidden bg-[#0a1428] text-white"
    >
      <img
        src="/images/edificio-vestibulo.jpg"
        alt="Vestíbulo del edificio Premium Work"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#0a1428]/80 via-[#0a1428]/40 to-[#0a1428]/85"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-5 py-24 text-center md:px-8">
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow flex items-center justify-center gap-2 text-[#9db8ff]">
            <span aria-hidden="true" className="text-[#eab308]">◆</span> Estancia II · El Vestíbulo
          </p>
          <h2 className="display mx-auto mt-6 max-w-[16ch] text-[clamp(2.4rem,7vw,4.2rem)]">
            Cruce el umbral. <span className="box-decoration-clone bg-[#2451e6] px-3">Bienvenido al interior.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[36rem] text-[15px] leading-7 text-white/80 sm:text-base">
            Tras la fachada, un edificio pensado para que cada servicio encuentre su espacio.
            Acompáñenos: cada estancia de esta casa es una de nuestras especialidades.
          </p>
          <a href="#servicios" className="btn btn-lime mt-10">
            Visitar la Sala de Servicios <ArrowDown size={16} aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
