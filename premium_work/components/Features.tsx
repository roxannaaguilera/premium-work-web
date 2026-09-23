"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type Layout = "cinematic" | "split" | "editorial";

const services: Array<{
  title: string;
  copy: string;
  slug: string;
  src: string;
  position: string;
  layout: Layout;
  flip?: boolean;
}> = [
  {
    title: "Camareros/as",
    copy: "Cada servicio de sala es ejecutado por profesionales propios, cuidadosamente seleccionados, formados en nuestros estándares y supervisados durante toda la prestación, garantizando agilidad y coherencia con la atmósfera del evento.",
    slug: "camareros",
    src: "/images/serv-1-display.webp",
    position: "object-[50%_50%]",
    layout: "cinematic",
  },
  {
    title: "Maîtres",
    copy: "Disponemos de maîtres seleccionados y entrenados según los criterios y estándares de cada empresa cliente, aportando el criterio, la presencia y la serenidad necesarios en los momentos de mayor exigencia.",
    slug: "maitres",
    src: "/images/serv-2-display.webp",
    position: "object-[50%_center]",
    layout: "split",
  },
  {
    title: "Office y Housekeeping",
    copy: "Contamos con personal seleccionado y preparado según los estándares de cada empresa cliente, garantizando el orden, la precisión y el cuidado necesarios para que cada espacio refleje el nivel de excelencia que exige cada evento.",
    slug: "office-y-housekeeping",
    src: "/images/serv-3-display.webp",
    position: "object-[50%_87%]",
    layout: "editorial",
  },
  {
    title: "Hostess",
    copy: "Disponemos de personal de recepción seleccionado y formado según nuestros estándares y las necesidades de cada empresa cliente, garantizando una bienvenida cuidada, una atención impecable y una presencia acorde con la imagen y el nivel de cada evento.",
    slug: "hostess",
    src: "/images/serv-4-display.webp",
    position: "object-[50%_9%]",
    layout: "cinematic",
  },
  {
    title: "Personal de cocina",
    copy: "Contamos con personal de cocina seleccionado y preparado para integrarse con agilidad en cada equipo, aportando orden, precisión y capacidad de respuesta para garantizar el correcto desarrollo del servicio incluso en los momentos de mayor exigencia.",
    slug: "personal-de-cocina",
    src: "/images/serv-5-display.webp",
    position: "object-[50%_center]",
    layout: "split",
    flip: true,
  },
  {
    title: "Supervisores",
    copy: "Nuestros supervisores coordinan y acompañan al equipo durante toda la prestación, asegurando el cumplimiento de los estándares acordados, anticipándose a las necesidades del servicio y garantizando que cada detalle se ejecute con precisión y coherencia.",
    slug: "supervisores",
    src: "/images/serv-6-display.webp",
    position: "object-[50%_center]",
    layout: "editorial",
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

function CinematicArticle({ service, index, reducedMotion }: { service: (typeof services)[number]; index: number; reducedMotion: boolean | null }) {
  const number = String(index + 1).padStart(2, "0");
  return (
    <article id={service.slug} className="group relative flex min-h-[92svh] scroll-mt-[calc(5rem+1px)] items-center overflow-hidden bg-[#0B1F3A]">
      <div className="absolute inset-0">
        <img
          src={service.src}
          alt={service.title}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover ${service.position} transition-transform duration-[1400ms] ease-out group-hover:scale-105`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(11,31,58,.88)_0%,rgba(11,31,58,.45)_52%,rgba(11,31,58,.06)_88%)]" />
        <div className="absolute inset-0 bg-[#C9A227]/10 mix-blend-overlay" aria-hidden="true" />
      </div>
      <span aria-hidden="true" className="display pointer-events-none absolute -right-4 top-8 select-none text-[24vw] leading-none text-white/[.05] lg:text-[18vw]">{number}</span>
      <div className="relative mx-auto w-full max-w-[1600px] px-5 py-24 md:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-xl"
        >
          <p className="eyebrow text-[#e5c65a]">{number}</p>
          <h3 className="display mt-5 text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.02] text-white">{service.title}</h3>
          <p className="mt-6 max-w-md text-base leading-7 text-white/85">{service.copy}</p>
          <a href={`/solicitar-servicio?servicio=${service.slug}`} className="btn btn-outline-light mt-8">Solicitar este servicio <ArrowRight size={18} aria-hidden="true" /></a>
        </motion.div>
      </div>
    </article>
  );
}

function SplitArticle({ service, index, reducedMotion }: { service: (typeof services)[number]; index: number; reducedMotion: boolean | null }) {
  const number = String(index + 1).padStart(2, "0");
  const flip = service.flip;
  return (
    <article id={service.slug} className="brand-surface-soft scroll-mt-[calc(5rem+1px)]">
      <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-20 md:px-8 lg:grid-cols-12 lg:gap-6 lg:px-10 lg:py-28">
        <motion.div
          initial={{ opacity: reducedMotion ? 1 : 0, scale: reducedMotion ? 1 : 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className={`group relative overflow-hidden rounded-2xl shadow-[0_30px_70px_-30px_rgba(11,31,58,.35)] lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
        >
          <img
            src={service.src}
            alt={service.title}
            loading="lazy"
            decoding="async"
            className={`aspect-[16/10] w-full object-cover ${service.position} transition-transform duration-[1200ms] ease-out group-hover:scale-105`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/30 via-transparent to-transparent transition-opacity duration-700 group-hover:opacity-40" aria-hidden="true" />
          <div className="absolute inset-0 bg-[#C9A227]/0 mix-blend-color transition-colors duration-700 group-hover:bg-[#C9A227]/15" aria-hidden="true" />
        </motion.div>
        <motion.div
          initial={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : flip ? 60 : -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className={`lg:col-span-5 ${flip ? "lg:order-1 lg:pr-10" : "lg:pl-10"}`}
        >
          <p className="eyebrow text-[#94751D]">{number}</p>
          <h3 className="display mt-5 text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.05] text-[#0B1F3A]">{service.title}</h3>
          <p className="mt-5 max-w-md text-base leading-7 text-[#0B1F3A]/75">{service.copy}</p>
          <a href={`/solicitar-servicio?servicio=${service.slug}`} className="btn btn-navy mt-7">Solicitar este servicio <ArrowRight size={18} aria-hidden="true" /></a>
        </motion.div>
      </div>
    </article>
  );
}

function EditorialArticle({ service, index, reducedMotion }: { service: (typeof services)[number]; index: number; reducedMotion: boolean | null }) {
  const number = String(index + 1).padStart(2, "0");
  return (
    <article id={service.slug} className="scroll-mt-[calc(5rem+1px)] bg-[#F8F7F4]">
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-8 lg:px-10 lg:py-28">
        <div className="divider-gold mb-12 lg:mb-16" aria-hidden="true" />
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <motion.p
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            aria-hidden="true"
            className="display text-[clamp(4rem,9vw,7rem)] leading-none text-[#C9A227] lg:col-span-2"
          >
            {number}
          </motion.p>
          <motion.div
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.08, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <h3 className="display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-[#0B1F3A]">{service.title}</h3>
            <p className="mt-4 max-w-md text-base leading-7 text-[#0B1F3A]/75">{service.copy}</p>
            <a href={`/solicitar-servicio?servicio=${service.slug}`} className="btn-link mt-6">Solicitar este servicio <ArrowRight size={18} aria-hidden="true" /></a>
          </motion.div>
          <motion.div
            initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.16, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-2xl shadow-[0_30px_70px_-30px_rgba(11,31,58,.35)] lg:col-span-5"
          >
            <img
              src={service.src}
              alt={service.title}
              loading="lazy"
              decoding="async"
              className={`aspect-[4/3] w-full object-cover ${service.position} transition-transform duration-[1200ms] ease-out group-hover:scale-105`}
            />
            <div className="absolute inset-0 bg-[#0B1F3A]/10 transition-colors duration-700 group-hover:bg-transparent" aria-hidden="true" />
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
      className="w-full scroll-mt-[calc(5rem+1px)] overflow-hidden bg-[#F8F7F4]"
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

      {/* DESKTOP - RITMO EDITORIAL ALTERNADO */}
      <div className="w-full">
        {services.map((service, index) => {
          if (service.layout === "cinematic") return <CinematicArticle key={service.slug} service={service} index={index} reducedMotion={reducedMotion} />;
          if (service.layout === "split") return <SplitArticle key={service.slug} service={service} index={index} reducedMotion={reducedMotion} />;
          return <EditorialArticle key={service.slug} service={service} index={index} reducedMotion={reducedMotion} />;
        })}
      </div>
    </section>
  );
}
