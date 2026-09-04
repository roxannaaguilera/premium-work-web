"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const benefits = [
  { title: "Selección con criterio", copy: "El perfil que su marca merece." },
  { title: "Equipos que encajan", copy: "Preparados para su forma de trabajar." },
  { title: "Supervisión que responde", copy: "Control cuando más importa." },
  { title: "Una gestión sin fricción", copy: "Un responsable. Una dirección clara." },
  { title: "Respuesta sin demoras", copy: "Sustitución ágil ante imprevistos." },
];

export function WhyUs() {
  const scroller = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const scroll = (direction: number) => scroller.current?.scrollBy({ left: direction * (scroller.current?.clientWidth ?? 360), behavior: "smooth" });

  const handleScroll = () => {
    const element = scroller.current;
    if (!element) return;
    const max = element.scrollWidth - element.clientWidth;
    setProgress(max > 0 ? element.scrollLeft / max : 0);
  };

  return (
    <section id="nosotros" className="flex h-[calc(100svh-5rem)] flex-col overflow-hidden bg-[#F8F7F4]">
      <motion.header initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5 }} className="mx-auto grid w-full max-w-[1600px] shrink-0 gap-4 px-5 py-8 md:grid-cols-[.65fr_1.35fr] md:items-end md:gap-12 md:px-8 md:py-10 lg:px-10">
        <p className="eyebrow flex items-center gap-2 text-[#0B1F3A]/65"><span className="text-[#C9A227]" aria-hidden="true">◆</span> La diferencia Premium Work</p>
        <h2 className="display max-w-4xl text-[clamp(2.5rem,5.4vw,5.4rem)] leading-[.9] tracking-[-.035em] text-[#0B1F3A]">La diferencia está en <em className="font-normal text-[#C9A227]">cómo lo hacemos.</em></h2>
      </motion.header>

      <div className="min-h-0 flex-1 overflow-hidden bg-[#e9e3d6]">
        <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col px-5 py-7 md:px-8 md:py-9 lg:px-10">
          <motion.div ref={scroller} onScroll={handleScroll} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5, delay: 0.08 }} className="hide-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto border-y border-[#0B1F3A]/15">
            {benefits.map((benefit, index) => (
              <article key={benefit.title} className="group flex h-full min-w-[84vw] snap-start flex-col border-r border-[#0B1F3A]/15 p-5 last:border-r-0 text-right sm:min-w-[48vw] md:p-7 lg:min-w-0 lg:flex-1">
                <div className="flex items-center justify-between">
                  <p className="display text-3xl text-[#C9A227]">/{String(index + 1).padStart(2, "0")}</p>
                  <span className="size-2 rounded-full bg-[#C9A227] transition-transform duration-300 group-hover:scale-[2]" aria-hidden="true" />
                </div>
                <div className="flex flex-1 flex-col items-end justify-center pt-6">
                  <h3 className="max-w-[14ch] text-xl font-bold leading-[1.05] tracking-[-.02em] text-[#0B1F3A] md:text-2xl">{benefit.title}</h3>
                  <p className="mt-3 max-w-[20ch] text-sm leading-5 text-[#0B1F3A]/65">{benefit.copy}</p>
                </div>
              </article>
            ))}
          </motion.div>

          <div className="mt-4 flex shrink-0 items-center justify-between gap-5">
            <div className="h-px flex-1 bg-[#0B1F3A]/15"><div className="h-full bg-[#C9A227] transition-[width] duration-300" style={{ width: `${Math.max(8, progress * 100)}%` }} /></div>
            <div className="flex border border-[#0B1F3A]/30 lg:hidden">
              <button type="button" aria-label="Ventaja anterior" onClick={() => scroll(-1)} className="p-3 text-[#0B1F3A] transition hover:bg-[#0B1F3A] hover:text-white"><ArrowLeft size={18} /></button>
              <button type="button" aria-label="Siguiente ventaja" onClick={() => scroll(1)} className="border-l border-[#0B1F3A]/30 p-3 text-[#0B1F3A] transition hover:bg-[#0B1F3A] hover:text-white"><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
