"use client";

import { motion } from "framer-motion";

const sectors = [
  { title: "Hoteles", src: "/images/serv-1-display.webp", position: "object-[50%_center]" },
  { title: "Restaurantes", src: "/images/serv-2-display.webp", position: "object-[50%_center]" },
  { title: "Catering", src: "/images/serv-5-display.webp", position: "object-[50%_center]" },
  { title: "Eventos corporativos", src: "/images/serv-4-display.webp", position: "object-[50%_20%]" },
  { title: "Congresos", src: "/images/serv-6-display.webp", position: "object-[50%_center]" },
  { title: "Ferias", src: "/images/serv-3-display.webp", position: "object-[50%_70%]" },
  { title: "Eventos deportivos", src: "/images/hero-2.webp", position: "object-[60%_center]" },
  { title: "Festivales", src: "/images/hero-3.webp", position: "object-[55%_center]" },
  { title: "Bodas y celebraciones", src: "/images/hero-4.webp", position: "object-[50%_center]" },
  { title: "Espacios culturales", src: "/images/hero-5.webp", position: "object-[50%_center]" },
  { title: "Clubs y ocio", src: "/images/serv-4-display.webp", position: "object-[50%_35%]" },
  { title: "Experiencias privadas", src: "/images/serv-1-display.webp", position: "object-[50%_center]" },
];

export function ClientsCarousel() {
  const loop = [...sectors, ...sectors];

  return (
    <section className="flex min-h-[calc(100svh-5rem)] flex-col justify-center overflow-hidden bg-[#F8F7F4] py-10 md:py-12">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="mx-auto mb-8 flex w-full max-w-[1600px] items-center gap-3 px-5 text-[#C9A227] md:mb-10 md:px-8">
        <span className="h-px w-10 bg-current/60" />
        <span className="text-sm" aria-hidden="true">◆</span>
        <p className="eyebrow text-[#0B1F3A]/70">Sectores para los que diseñamos nuestros servicios</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="group overflow-hidden">
        <div className="marquee-track flex w-max gap-3 px-3 group-hover:[animation-play-state:paused] md:gap-5 md:px-5">
          {loop.map((sector, index) => (
            <article key={`${sector.title}-${index}`} className="group/card relative h-[clamp(20rem,54svh,32rem)] w-[min(72vw,22rem)] shrink-0 overflow-hidden bg-[#0B1F3A] md:w-[min(28vw,26rem)]">
              <img src={sector.src} alt={sector.title} loading={index < 4 ? "eager" : "lazy"} decoding="async" className={`h-full w-full object-cover ${sector.position} transition duration-700 group-hover/card:scale-105`} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,31,58,.02)_40%,rgba(11,31,58,.9)_100%)]" />
              <p className="absolute inset-x-0 bottom-0 p-5 text-base font-bold uppercase leading-tight tracking-[.1em] text-white md:p-6">{sector.title}</p>
            </article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
