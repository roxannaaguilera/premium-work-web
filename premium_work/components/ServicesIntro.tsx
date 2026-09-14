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
    <section className="brand-surface-light relative flex min-h-[50svh] justify-center overflow-hidden px-5 pb-20 pt-32 text-center md:px-8 md:pt-36">
      <div className="gold-marquee group absolute inset-x-0 top-0 overflow-hidden border-y border-[#0B1F3A]/15">
        <div className="marquee-track flex w-max group-hover:[animation-play-state:paused]">
          {loop.map((service, index) => (
            <div key={`${service.slug}-${index}`} className="shrink-0">
              <a href={`/#${service.slug}`} className="flex h-11 w-max items-center justify-center border-r border-[#0B1F3A]/25 whitespace-nowrap px-7 text-center text-xs font-bold uppercase tracking-[.12em] md:text-sm text-[#0B1F3A] lg:hidden">
                {service.title}
              </a>
              <a href={`/#${service.slug}`} className="hidden h-11 w-max items-center justify-center border-r border-[#0B1F3A]/25 whitespace-nowrap px-7 text-center text-xs font-bold uppercase tracking-[.12em] md:text-sm text-[#0B1F3A] transition-colors hover:bg-[#0B1F3A] hover:text-white lg:flex">
                {service.title}
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
        <div className="flex items-center justify-center gap-3 text-[#C9A227]" aria-hidden="true">
          <span className="h-px w-12 bg-current/60 md:w-20" />
          <span className="text-base">◆</span>
          <span className="h-px w-12 bg-current/60 md:w-20" />
        </div>
        <p className="eyebrow mt-6 text-[#0B1F3A]/70">Cuidamos cada detalle</p>
        <h2 className="display mx-auto mt-7 max-w-5xl text-[clamp(3.4rem,13vw,6.8rem)] leading-[.9] text-[#0B1F3A]">Mucho más que personal: <em className="font-normal text-[#C9A227]">un servicio completo.</em></h2>
      </motion.div>
    </section>
  );
}
