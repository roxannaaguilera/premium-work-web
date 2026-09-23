"use client";

import { motion, useReducedMotion } from "framer-motion";

const COMMITMENTS = [
  {
    title: "Selección rigurosa",
    copy: "Cada profesional supera nuestro proceso de selección antes de representar a tu marca.",
  },
  {
    title: "Equipos supervisados",
    copy: "Supervisión en sala durante toda la prestación, con un responsable claro.",
  },
  {
    title: "Respuesta ágil",
    copy: "Sustituciones y refuerzos ante cualquier imprevisto, sin fricción.",
  },
  {
    title: "Un solo interlocutor",
    copy: "Una dirección clara de principio a fin para tu evento.",
  },
];

export function Stats() {
  const reducedMotion = useReducedMotion();

  return (
    <section aria-label="Nuestro compromiso" className="relative isolate overflow-hidden border-y border-[#e5e7eb] bg-white py-16 md:py-20">
      <div className="relative mx-auto w-full max-w-[1600px] px-5 md:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow flex items-center gap-2 text-[#6e7a10]"><span aria-hidden="true">◆</span> Nuestro compromiso</p>
          <dl className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {COMMITMENTS.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{ duration: 0.5, delay: reducedMotion ? 0 : index * 0.08 }}
                className="flex flex-col border-l-2 border-[#d2d943] pl-5 md:pl-8"
              >
                <dt className="display order-1 text-2xl leading-tight text-[#131313]">{item.title}</dt>
                <dd className="order-2 mt-3 text-sm leading-6 text-[#4a5264]">{item.copy}</dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
