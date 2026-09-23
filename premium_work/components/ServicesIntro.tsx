"use client";

import { motion, useReducedMotion } from "framer-motion";

const services = [
  { title: "Camareros/as", slug: "camareros" },
  { title: "Maîtres", slug: "maitres" },
  { title: "Office y Housekeeping", slug: "office-y-housekeeping" },
  { title: "Hostess", slug: "hostess" },
  { title: "Personal de cocina", slug: "personal-de-cocina" },
  { title: "Supervisores", slug: "supervisores" },
];

export function ServicesIntro() {
  const reducedMotion = useReducedMotion();
  const loop = [...services, ...services];

  return (
    <section className="relative flex justify-center overflow-hidden bg-white px-5 pb-20 pt-32 text-center md:px-8 md:pt-36">
      <div className="lime-marquee group absolute inset-x-0 top-0 overflow-hidden border-y border-[#131313]/10">
        <div className="marquee-track flex w-max group-hover:[animation-play-state:paused]">
          {loop.map((service, index) => (
            <div key={`${service.slug}-${index}`} className="shrink-0">
              <a href={`/#${service.slug}`} className="flex h-12 w-max items-center justify-center gap-3 whitespace-nowrap border-r border-[#131313]/15 px-7 text-center text-xs font-bold uppercase tracking-[.12em] text-[#131313] transition-colors hover:bg-[#131313] hover:text-white md:text-sm lg:hidden">
                <span aria-hidden="true">◆</span> {service.title}
              </a>
              <a href={`/#${service.slug}`} className="hidden h-12 w-max items-center justify-center gap-3 whitespace-nowrap border-r border-[#131313]/15 px-7 text-center text-xs font-bold uppercase tracking-[.12em] text-[#131313] transition-colors hover:bg-[#131313] hover:text-white md:text-sm lg:flex">
                <span aria-hidden="true">◆</span> {service.title}
              </a>
            </div>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: reducedMotion ? 1 : 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeInOut" }}
        className="relative mx-auto max-w-5xl"
      >
        <p className="eyebrow mt-6 text-[#4a5264]">Cuidamos cada detalle</p>
        <h2 className="display mx-auto mt-7 max-w-5xl text-[clamp(2.8rem,9vw,5.6rem)] text-[#131313]">Mucho más que personal: <em className="box-decoration-clone bg-[#d2d943] px-2 not-italic">un servicio completo.</em></h2>
      </motion.div>
    </section>
  );
}
