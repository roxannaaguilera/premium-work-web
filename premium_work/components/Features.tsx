"use client";

import { motion } from "framer-motion";

const services = [
  { title: "Camareros/as", copy: "Cada servicio de sala es ejecutado por profesionales propios, cuidadosamente seleccionados, formados en nuestros estándares y supervisados durante toda la prestación, garantizando agilidad y coherencia con la atmósfera del evento.", slug: "camareros", src: "/images/serv-1-display.webp", mobileSrc: "/images/serv-1-display.webp", desktopPosition: "md:object-[50%_center]", mobilePosition: "object-[50%_center]" },
  { title: "Maîtres", copy: "Disponemos de maîtres seleccionados y entrenados según los criterios y estándares de cada empresa cliente, aportando el criterio, la presencia y la serenidad necesarios en los momentos de mayor exigencia.", slug: "maitres", src: "/images/serv-2-display.webp", mobileSrc: "/images/serv-2-display.webp", desktopPosition: "md:object-[50%_center]", mobilePosition: "object-[50%_center]" },
  { title: "Office y Housekeeping", copy: "Orden, precisión y cuidado en cada detalle, asegurando que cada espacio funcione con armonía y excelencia durante todo el evento.", slug: "office-y-housekeeping", src: "/images/serv-3-display.webp", mobileSrc: "/images/serv-3-display.webp", desktopPosition: "md:object-[50%_72%]", mobilePosition: "object-[50%_70%]" },
  { title: "Hostess", copy: "Una bienvenida cuidada y una atención impecable para invitados, asistentes y equipos.", slug: "hostess", src: "/images/serv-4-display.webp", mobileSrc: "/images/serv-4-display.webp", desktopPosition: "md:object-[50%_24%]", mobilePosition: "object-[50%_20%]" },
  { title: "Personal de cocina", copy: "Apoyo especializado para que la operación fluya con orden, precisión y excelencia.", slug: "personal-de-cocina", src: "/images/serv-5-display.webp", mobileSrc: "/images/serv-5-display.webp", desktopPosition: "md:object-[50%_center]", mobilePosition: "object-[50%_center]" },
  { title: "Supervisores", copy: "Coordinación en terreno para que cada detalle esté donde debe estar, en el momento adecuado.", slug: "supervisores", src: "/images/serv-6-display.webp", mobileSrc: "/images/serv-6-display.webp", desktopPosition: "md:object-[50%_center]", mobilePosition: "object-[50%_center]" },
];

export function Features() {
  return <section id="servicios" className="section-pad bg-[#F8F7F4]"><div className="mx-auto max-w-[1280px] space-y-8">
    {services.map((service, index) => <motion.article id={service.slug} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: .5 }} style={{ top: `${88 + index * 14}px`, zIndex: index + 1 }} className="sticky grid min-h-[570px] overflow-hidden border border-[#0B1F3A]/25 bg-[#F8F7F4] shadow-[0_-1px_0_rgba(11,31,58,.05)] md:grid-cols-[1fr_.92fr]}" key={service.title}>
      <div className="flex flex-col p-7 md:p-11"><p className="text-sm font-bold">{String(index + 1).padStart(2, "0")}</p><div className="my-auto max-w-md py-10"><h3 className="display text-5xl leading-none md:text-6xl">{service.title}</h3><p className="mt-7 text-base leading-7 text-[#0B1F3A]/75">{service.copy}</p></div></div>
      <div className="relative min-h-[300px] overflow-hidden bg-[#0B1F3A] md:min-h-0">
        <picture className="absolute -inset-6 scale-110 opacity-55 blur-xl">
          <source media="(max-width: 767px)" srcSet={service.mobileSrc} type="image/webp" />
          <img src={service.src} alt="" aria-hidden="true" loading="lazy" decoding="async" className={`h-full w-full object-cover ${service.mobilePosition} ${service.desktopPosition}`} />
        </picture>
        <picture className="absolute inset-3 overflow-hidden md:inset-4">
          <source media="(max-width: 767px)" srcSet={service.mobileSrc} type="image/webp" />
          <img src={service.src} alt={service.title} loading="lazy" decoding="async" className={`h-full w-full object-cover ${service.mobilePosition} ${service.desktopPosition}`} />
        </picture>
        <div className="pointer-events-none absolute inset-3 border border-white/55 md:inset-4" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(11,31,58,.18),transparent_48%,rgba(201,162,39,.16))]" />
      </div>
    </motion.article>)}
  </div></section>;
}
