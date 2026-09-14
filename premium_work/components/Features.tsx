"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Camareros/as",
    copy: "Cada servicio de sala es ejecutado por profesionales propios, cuidadosamente seleccionados, formados en nuestros estándares y supervisados durante toda la prestación, garantizando agilidad y coherencia con la atmósfera del evento.",
    slug: "camareros",
    src: "/images/serv-1-display.webp",
    position: "object-[50%_50%]",
  },
  {
    title: "Maîtres",
    copy: "Disponemos de maîtres seleccionados y entrenados según los criterios y estándares de cada empresa cliente, aportando el criterio, la presencia y la serenidad necesarios en los momentos de mayor exigencia.",
    slug: "maitres",
    src: "/images/serv-2-display.webp",
    position: "object-[50%_center]",
  },
  {
    title: "Office y Housekeeping",
    copy: "Contamos con personal seleccionado y preparado según los estándares de cada empresa cliente, garantizando el orden, la precisión y el cuidado necesarios para que cada espacio refleje el nivel de excelencia que exige cada evento.",
    slug: "office-y-housekeeping",
    src: "/images/serv-3-display.webp",
    position: "object-[50%_87%]",
  },
  {
    title: "Hostess",
    copy: "Disponemos de personal de recepción seleccionado y formado según nuestros estándares y las necesidades de cada empresa cliente, garantizando una bienvenida cuidada, una atención impecable y una presencia acorde con la imagen y el nivel de cada evento.",
    slug: "hostess",
    src: "/images/serv-4-display.webp",
    position: "object-[50%_9%]",
  },
  {
    title: "Personal de cocina",
    copy: "Contamos con personal de cocina seleccionado y preparado para integrarse con agilidad en cada equipo, aportando orden, precisión y capacidad de respuesta para garantizar el correcto desarrollo del servicio incluso en los momentos de mayor exigencia.",
    slug: "personal-de-cocina",
    src: "/images/serv-5-display.webp",
    position: "object-[50%_center]",
  },
  {
    title: "Supervisores",
    copy: "Nuestros supervisores coordinan y acompañan al equipo durante toda la prestación, asegurando el cumplimiento de los estándares acordados, anticipándose a las necesidades del servicio y garantizando que cada detalle se ejecute con precisión y coherencia.",
    slug: "supervisores",
    src: "/images/serv-6-display.webp",
    position: "object-[50%_center]",
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

export function Features() {
  const reducedMotion = useReducedMotion();
  return (
    <section
      id="servicios"
      className="brand-surface-soft w-full scroll-mt-[calc(5rem+1px)] overflow-hidden"
    >
      {/* MOBILE */}
      <div className="relative overflow-hidden py-20 lg:hidden">
        <h2 id="que-necesitas" className="display scroll-mt-20 px-5 text-[2.6rem] leading-none text-[#0B1F3A]">
          ¿Qué necesitas?
        </h2>

        <div className="hide-scrollbar mt-9 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[12vw] pb-3">
          {mobileActions.map((action) => (
            <a
              key={action.title}
              href={action.href}
              className="group relative aspect-[1.08] w-[76vw] shrink-0 snap-center overflow-hidden rounded-xl bg-[#0B1F3A] text-white shadow-md"
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

                <span className="mt-4 inline-flex size-10 items-center justify-center rounded-full border border-white/50 transition group-hover:bg-white group-hover:text-[#0B1F3A]">
                  <ArrowRight size={25} aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-4 px-5 text-xs font-semibold uppercase tracking-[.14em] text-[#0B1F3A]/55">
          Desliza para ver las opciones
        </p>
      </div>

      {/* DESKTOP - ANCHO COMPLETO SIN MÁRGENES LATERALES */}
      <div className="w-full">
        {services.map((service, index) => {
          const imageFirst = index % 2 === 1;

          return (
            <article
              id={service.slug}
              key={service.title}
              className="grid w-full scroll-mt-[calc(5rem+1px)] grid-cols-1 lg:min-h-[100svh] lg:grid-cols-2"
            >
              {/* TEXTO */}
              <div
                className={`feature-soft-panel relative isolate flex items-center overflow-hidden px-5 py-10 sm:px-8 lg:px-[clamp(3rem,8vw,9rem)] lg:py-16 ${
                  imageFirst ? "order-1 lg:order-2" : "order-1"
                }`}
              >
                <motion.div initial={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : imageFirst ? 120 : -120 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, amount: 0.25 }} transition={{ duration: 0.9, ease: "easeOut" }} className="relative max-w-md">
                  <p className="eyebrow text-[#94751D]">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="display mt-5 text-[clamp(2.5rem,10vw,3.5rem)] leading-[1.05] text-[#0B1F3A] lg:text-7xl">
                    {service.title}
                  </h3>

                  <p className="mt-6 text-base leading-7 text-[#0B1F3A]/75">
                    {service.copy}
                  </p>
                  <a href={`/solicitar-servicio?servicio=${service.slug}`} className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-full bg-[#C9A227] px-5 py-3 text-sm font-bold text-[#0B1F3A] transition hover:bg-[#e2be3d]">Solicitar este servicio <ArrowRight size={18} aria-hidden="true" /></a>
                </motion.div>
              </div>

              {/* FOTO SIN MÁRGENES */}
              <div
                className={`relative mx-auto mb-8 aspect-[4/5] w-[calc(100%-2.5rem)] overflow-hidden rounded-xl sm:w-[calc(100%-4rem)] lg:mb-0 lg:aspect-auto lg:min-h-[100svh] lg:w-full lg:rounded-none ${
                  imageFirst ? "order-2 lg:order-1" : "order-2"
                }`}
              >
                <img
                  src={service.src}
                  alt={service.title}
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 block h-full w-full object-cover ${service.position}`}
                />

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(11,31,58,.15),transparent_55%,rgba(11,31,58,.28))]" />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
