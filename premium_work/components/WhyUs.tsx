"use client";

import { motion, useReducedMotion } from "framer-motion";

const benefits = [
  { title: "Selección con criterio", copy: "El perfil que su marca merece." },
  { title: "Equipos que encajan", copy: "Preparados para su forma de trabajar." },
  { title: "Supervisión que responde", copy: "Control cuando más importa." },
  { title: "Una gestión sin fricción", copy: "Un responsable. Una dirección clara." },
  { title: "Respuesta sin demoras", copy: "Sustitución ágil ante imprevistos." },
];

export function WhyUs() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="nosotros" className="panel-dark scroll-mt-[calc(5rem+1px)] py-20 md:py-28">
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 md:px-8 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="grid gap-4 md:grid-cols-[.65fr_1.35fr] md:items-end md:gap-12"
        >
          <p className="eyebrow flex items-center gap-2 text-white/60"><span className="text-[#d2d943]" aria-hidden="true">◆</span> La diferencia Premium Work</p>
          <h2 className="display max-w-4xl text-[clamp(2.5rem,5.4vw,5.4rem)] text-white">La diferencia está en <em className="box-decoration-clone bg-[#d2d943] px-2 not-italic text-[#131313]">cómo lo hacemos.</em></h2>
        </motion.header>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 xl:grid-cols-5">
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-60px" }}
              transition={{ duration: 0.55, delay: reducedMotion ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-[20px] border border-white/15 bg-white/[.05] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d2d943]/70 hover:bg-white/[.08] hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,.5)] md:p-7"
            >
              <p className="display text-5xl leading-none text-[#d2d943] transition-transform duration-300 group-hover:scale-105 md:text-6xl">/{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-7 text-lg font-bold leading-snug text-white">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/80">{benefit.copy}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
