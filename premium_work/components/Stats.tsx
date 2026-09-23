"use client";

import { motion, useReducedMotion } from "framer-motion";

// TODO: reemplazar por cifras reales de Premium Work.
// Los valores de abajo son EJEMPLOS de marcador de posición: no publicar sin revisarlos con la empresa.
const STATS = [
  { value: "+120", label: "eventos cubiertos cada año" },
  { value: "+450", label: "profesionales en activo" },
  { value: "98 %", label: "de clientes que repiten" },
  { value: "24 h", label: "respuesta ante imprevistos" },
];

export function Stats() {
  const reducedMotion = useReducedMotion();

  return (
    <section aria-label="Premium Work en cifras" className="relative isolate overflow-hidden bg-[#0B1F3A] py-16 text-white md:py-20">
      <div className="hero-glow" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-[1600px] px-5 md:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow flex items-center gap-2 text-[#e5c65a]"><span aria-hidden="true">◆</span> Premium Work en cifras</p>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.08 }}
                className="flex flex-col border-l border-[#C9A227]/40 pl-5 md:pl-8"
              >
                <dt className="order-2 mt-3 text-sm leading-6 text-white/70">{stat.label}</dt>
                <dd className="display order-1 text-5xl leading-none text-white md:text-6xl">{stat.value}</dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
