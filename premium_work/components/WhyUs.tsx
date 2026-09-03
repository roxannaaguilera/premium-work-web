"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

const benefits = [["Servicio gestionado", "Un único equipo responsable, desde la propuesta hasta el cierre."], ["Criterio de selección", "Perfiles elegidos por su oficio, actitud y adecuación a su ocasión."], ["Respuesta ágil", "Atención cercana para resolver con precisión cuando el ritmo importa."], ["Coordinación", "Seguimiento operativo para cuidar el estándar en cada punto de contacto."], ["Flexibilidad", "Soluciones a medida para eventos, hotelería, catering y experiencias privadas."]];

export function WhyUs() {
  const scroller = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => scroller.current?.scrollBy({ left: direction * (scroller.current?.clientWidth ?? 360), behavior: "smooth" });

  return <section id="nosotros" className="section-pad bg-[#e9e3d6]"><div className="mx-auto max-w-[1600px]">
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="grid gap-8 lg:grid-cols-2">
      <div><p className="eyebrow">◆ Nuestros beneficios</p><a href="#contacto" className="mt-8 hidden rounded-sm border border-[#0B1F3A] px-5 py-3 text-sm font-bold transition hover:scale-[1.03] active:scale-[.98] md:mt-10 md:inline-flex">Contactar <ArrowRight className="ml-2" size={16} /></a></div>
      <h2 className="display max-w-3xl text-[clamp(2.8rem,13vw,4.25rem)] leading-[.93] md:text-7xl">La tranquilidad de un servicio a la altura de su marca.</h2>
    </motion.div>
    <motion.div ref={scroller} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ visible: { transition: { staggerChildren: .08 } } }} className="hide-scrollbar mt-12 flex snap-x snap-mandatory overflow-x-auto border-y border-[#0B1F3A]/15 md:mt-16">
      {benefits.map(([title, copy], index) => <motion.article variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }} className="min-h-[22rem] w-full flex-none snap-start border-r border-[#0B1F3A]/15 p-6 last:border-0 md:min-h-72 md:w-[320px] lg:flex-1" key={title}><p className="display text-4xl">/{String(index + 1).padStart(2, "0")}</p><h3 className="mt-12 text-xl font-bold leading-tight">{title}</h3><p className="mt-4 max-w-xs text-sm leading-6 text-[#0B1F3A]/70">{copy}</p></motion.article>)}
    </motion.div>
    <div className="mt-0 flex"><button aria-label="Beneficio anterior" onClick={() => scroll(-1)} className="border border-t-0 border-[#0B1F3A]/30 p-4"><ArrowLeft size={18} /></button><button aria-label="Siguiente beneficio" onClick={() => scroll(1)} className="border border-l-0 border-t-0 border-[#0B1F3A]/30 p-4"><ArrowRight size={18} /></button></div>
  </div></section>;
}
