"use client";

import { motion } from "framer-motion";
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
    href: "#contacto",
    src: "/images/serv-6-display.webp",
    position: "object-[50%_center]",
  },
];

export function Features() {
  return (
    <section
      id="servicios"
      className="w-full overflow-hidden bg-[#F8F7F4]"
    >
      {/* MOBILE */}
      <div className="py-20 lg:hidden">
        <h2 id="que-necesitas" className="display scroll-mt-20 px-5 text-[2.6rem] leading-none text-[#0B1F3A]">
          ¿Qué necesitas?
        </h2>

        <div className="hide-scrollbar mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
          {mobileActions.map((action) => (
            <a
              key={action.title}
              href={action.href}
              className="group relative h-[31rem] min-w-[85vw] snap-start overflow-hidden bg-[#0B1F3A] text-white"
            >
              <img
                src={action.src}
                alt=""
                aria-hidden="true"
                className={`absolute inset-0 h-full w-full object-cover ${action.position} transition duration-500 group-hover:scale-105`}
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,31,58,.02)_25%,rgba(11,31,58,.9)_100%)]" />

              <div className="absolute inset-x-0 bottom-0 p-7">
                <p className="max-w-[11ch] text-[2.2rem] leading-[1.02] tracking-[-.045em]">
                  {action.title}
                </p>

                <span className="mt-7 inline-flex size-12 items-center justify-center rounded-full border border-white/50 transition group-hover:bg-white group-hover:text-[#0B1F3A]">
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
      <div className="hidden w-full lg:block">
        {services.map((service, index) => {
          const imageFirst = index % 2 === 1;

          return (
            <motion.article
              id={service.slug}
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="grid min-h-[100svh] w-full grid-cols-2"
            >
              {/* TEXTO */}
              <div
                className={`flex items-center bg-[#F8F7F4] px-[clamp(3rem,8vw,9rem)] py-16 ${
                  imageFirst ? "order-2" : "order-1"
                }`}
              >
                <div className="max-w-md">
                  <p className="eyebrow text-[#C9A227]">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="display mt-6 text-6xl leading-[.95] text-[#0B1F3A] lg:text-7xl">
                    {service.title}
                  </h3>

                  <p className="mt-8 text-base leading-7 text-[#0B1F3A]/75">
                    {service.copy}
                  </p>
                </div>
              </div>

              {/* FOTO SIN MÁRGENES */}
              <div
                className={`relative min-h-[100svh] w-full overflow-hidden ${
                  imageFirst ? "order-1" : "order-2"
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
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
