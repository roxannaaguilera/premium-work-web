"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const services: Array<{
  title: string;
  copy: string;
  slug: string;
  src: string;
  position: string;
  badgeTitle: string;
  badgeSub: string;
  tags: [string, string, string];
}> = [
  {
    title: "Camareros/as",
    copy: "Cada servicio de sala es ejecutado por profesionales propios, cuidadosamente seleccionados, formados en nuestros estándares y supervisados durante toda la prestación, garantizando agilidad y coherencia con la atmósfera del evento.",
    badgeTitle: "Equipos propios",
    badgeSub: "Seleccionados, formados y supervisados",
    slug: "camareros",
    src: "/images/serv-1-display.webp",
    position: "object-[50%_50%]",
    tags: ["Sala", "Eventos", "Hoteles"],
  },
  {
    title: "Maîtres",
    copy: "Disponemos de maîtres seleccionados y entrenados según los criterios y estándares de cada empresa cliente, aportando el criterio, la presencia y la serenidad necesarios en los momentos de mayor exigencia.",
    badgeTitle: "Criterio y presencia",
    badgeSub: "A la medida de tu marca",
    slug: "maitres",
    src: "/images/serv-2-display.webp",
    position: "object-[50%_center]",
    tags: ["Sala", "Eventos", "Alta hostelería"],
  },
  {
    title: "Office y Housekeeping",
    copy: "Contamos con personal seleccionado y preparado según los estándares de cada empresa cliente, garantizando el orden, la precisión y el cuidado necesarios para que cada espacio refleje el nivel de excelencia que exige cada evento.",
    badgeTitle: "Orden y precisión",
    badgeSub: "En cada detalle del espacio",
    slug: "office-y-housekeeping",
    src: "/images/serv-3-display.webp",
    position: "object-[50%_87%]",
    tags: ["Hoteles", "Eventos", "Espacios"],
  },
  {
    title: "Hostess",
    copy: "Disponemos de personal de recepción seleccionado y formado según nuestros estándares y las necesidades de cada empresa cliente, garantizando una bienvenida cuidada, una atención impecable y una presencia acorde con la imagen y el nivel de cada evento.",
    badgeTitle: "Bienvenida impecable",
    badgeSub: "Acorde a tu imagen",
    slug: "hostess",
    src: "/images/serv-4-display.webp",
    position: "object-[50%_9%]",
    tags: ["Recepción", "Eventos", "Imagen de marca"],
  },
  {
    title: "Personal de cocina",
    copy: "Contamos con personal de cocina seleccionado y preparado para integrarse con agilidad en cada equipo, aportando orden, precisión y capacidad de respuesta para garantizar el correcto desarrollo del servicio incluso en los momentos de mayor exigencia.",
    badgeTitle: "Integración ágil",
    badgeSub: "En tu equipo desde el día uno",
    slug: "personal-de-cocina",
    src: "/images/serv-5-display.webp",
    position: "object-[50%_center]",
    tags: ["Cocina", "Eventos", "Equipos"],
  },
  {
    title: "Supervisores",
    copy: "Nuestros supervisores coordinan y acompañan al equipo durante toda la prestación, asegurando el cumplimiento de los estándares acordados, anticipándose a las necesidades del servicio y garantizando que cada detalle se ejecute con precisión y coherencia.",
    badgeTitle: "Supervisión incluida",
    badgeSub: "Durante todo el servicio",
    slug: "supervisores",
    src: "/images/serv-6-display.webp",
    position: "object-[50%_center]",
    tags: ["Coordinación", "Eventos", "Control de calidad"],
  },
];

const mobileActions = [
  {
    title: "Regístrate como candidato",
    href: "/registro",
    src: "/images/serv-1-display.webp",
    position: "object-[52%_center]",
  },
  {
    title: "Soluciones para empresas",
    href: "/solicitar-servicio",
    src: "/images/serv-6-display.webp",
    position: "object-[50%_center]",
  },
];

function PopCard({ title, sub, ribbon = "Premium Work", className, rotateClass, reducedMotion, delay = 0.45 }: {
  title: string; sub: string; ribbon?: string; className?: string; rotateClass?: string; reducedMotion: boolean | null; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay }}
      aria-hidden="true"
      className={`absolute z-20 ${className ?? ""}`}
    >
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className={`relative w-52 rounded-2xl border border-black/5 bg-white p-4 shadow-[0_24px_60px_-12px_rgba(0,0,0,.28)] md:w-60 md:p-5 ${rotateClass ?? "-rotate-2"}`}
      >
        <span className="absolute -top-3.5 -left-3 -rotate-6 rounded-full bg-[#131313] px-3.5 py-1.5 text-[11px] font-extrabold tracking-wide text-white shadow-lg">
          <span className="text-[#d2d943]" aria-hidden="true">◆</span> {ribbon}
        </span>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm font-extrabold text-[#131313] md:text-[15px]">
          <span className="text-[#9db31c]" aria-hidden="true">◆</span> {title}
        </p>
        <p className="mt-1 text-xs leading-5 text-[#4a5264] md:text-[13px]">{sub}</p>
      </motion.div>
    </motion.div>
  );
}

function ServiceShowcase({ service, index, reducedMotion }: { service: (typeof services)[number]; index: number; reducedMotion: boolean | null }) {
  const number = String(index + 1).padStart(2, "0");
  const flip = index % 2 === 1;

  return (
    <article
      id={service.slug}
      className={`relative scroll-mt-[calc(5rem+1px)] overflow-hidden ${index % 2 === 1 ? "bg-[#fafaf8]" : "bg-white"}`}
    >
      {/* Formas abstractas detrás de la tarjeta */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`absolute -left-40 top-16 size-[480px] rounded-full bg-[#d2d943]/25 blur-[110px] ${flip ? "md:left-auto md:-right-40" : ""}`} />
        <div className={`absolute bottom-10 size-[560px] rounded-full bg-[#e9ebee] blur-[90px] ${flip ? "-left-48" : "-right-48"}`} />
        <div className={`absolute top-[14%] size-60 rounded-full border-[26px] border-[#6e7a10]/15 ${flip ? "left-[7%]" : "right-[7%]"}`} />
        <div className={`absolute bottom-[12%] size-52 rounded-[44px] bg-[#131313]/[.05] ${flip ? "right-[9%] -rotate-12" : "left-[9%] rotate-12"}`} />
        <span className={`display absolute top-10 select-none text-[22vw] leading-none text-[#131313]/[.04] lg:text-[13vw] ${flip ? "left-6" : "right-6"}`}>{number}</span>
      </div>

      <div className="section-pad relative mx-auto max-w-[1200px]">
        <motion.p
          initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="eyebrow flex items-center justify-center gap-2 text-[#6e7a10]"
        >
          <span aria-hidden="true">◆</span> Servicio {number}
        </motion.p>

        <div className="relative mx-auto mt-12 max-w-3xl md:mt-16">
          {/* Hoja blanca desplazada: profundidad */}
          <div aria-hidden="true" className={`absolute inset-0 rounded-[44px] bg-white shadow-[0_32px_80px_-32px_rgba(19,19,19,.18)] ${flip ? "-rotate-2 -translate-x-3 translate-y-4" : "rotate-2 translate-x-3 translate-y-4"}`} />

          <PopCard
            title="Personal seleccionado y entrenado"
            sub={service.badgeSub}
            reducedMotion={reducedMotion}
            rotateClass={flip ? "rotate-2" : "-rotate-2"}
            className={flip ? "-top-10 right-2 md:-right-8" : "-top-10 left-2 md:-left-8"}
          />

          {/* Tarjeta principal */}
          <motion.div
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 56, scale: reducedMotion ? 1 : 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative rounded-[40px] border border-black/5 bg-white px-6 py-12 text-center shadow-[0_56px_110px_-36px_rgba(19,19,19,.3)] md:px-14 md:py-16"
          >
            <motion.div
              initial={{ opacity: reducedMotion ? 1 : 0, scale: reducedMotion ? 1 : 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.15 }}
              className="relative mx-auto size-36 md:size-44"
            >
              <span aria-hidden="true" className="absolute -inset-3 rounded-full bg-[#d2d943]/30 blur-xl" />
              <img
                src={service.src}
                alt={service.title}
                loading="lazy"
                decoding="async"
                className={`relative size-36 rounded-full object-cover shadow-[0_24px_48px_-16px_rgba(19,19,19,.35)] ring-4 ring-white md:size-44 ${service.position}`}
              />
            </motion.div>

            <p className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-[#f2f6d8] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#5c6b0e]">
              <span aria-hidden="true">◆</span> {service.badgeTitle}
            </p>

            <h3 className="display mt-4 text-[clamp(2.6rem,6vw,4.5rem)] text-[#131313]">{service.title}</h3>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {service.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#e2e2e8] bg-white px-4 py-1.5 text-xs font-bold text-[#4a5264]">
                  {tag}
                </span>
              ))}
            </div>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#4a5264]">{service.copy}</p>

            <a href={`/solicitar-servicio?servicio=${service.slug}`} className="btn btn-dark mt-8 !rounded-full">
              Solicitar este servicio <ArrowRight size={18} aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </div>
    </article>
  );
}

export function Features() {
  const reducedMotion = useReducedMotion();
  return (
    <section
      id="servicios"
      className="w-full scroll-mt-[calc(5rem+1px)] overflow-hidden bg-white"
    >
      {/* MOBILE */}
      <div className="relative overflow-hidden py-20 lg:hidden">
        <h2 id="que-necesitas" className="display scroll-mt-20 px-5 text-[2.6rem] text-[#131313]">
          ¿Qué necesitas?
        </h2>

        <div className="hide-scrollbar mt-9 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[12vw] pb-3">
          {mobileActions.map((action) => (
            <a
              key={action.title}
              href={action.href}
              className="group relative aspect-[1.08] w-[76vw] shrink-0 snap-center overflow-hidden rounded-[20px] border border-[#e5e7eb] bg-[#131313] text-white shadow-md"
            >
              <img
                src={action.src}
                alt=""
                aria-hidden="true"
                className={`absolute inset-0 h-full w-full object-cover ${action.position} transition duration-500 group-hover:scale-105`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <motion.p initial={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -80 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ duration: 0.8, ease: "easeOut" }} className="display max-w-[15ch] text-2xl font-semibold leading-tight">
                  {action.title}
                </motion.p>

                <span className="mt-4 inline-flex size-10 items-center justify-center rounded-full border border-white/50 transition group-hover:border-[#d2d943] group-hover:bg-[#d2d943] group-hover:text-[#131313]">
                  <ArrowRight size={22} aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-4 px-5 text-xs font-semibold uppercase tracking-[.14em] text-[#131313]/55">
          Desliza para ver las opciones
        </p>
      </div>

      {/* SERVICIOS — TARJETAS FLOTANTES */}
      <div className="w-full">
        {services.map((service, index) => (
          <ServiceShowcase key={service.slug} service={service} index={index} reducedMotion={reducedMotion} />
        ))}
      </div>
    </section>
  );
}
