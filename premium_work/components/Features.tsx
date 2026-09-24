"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, TouchEvent, TransitionEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

type Service = {
  title: string;
  blurb: string;
  copy: string;
  slug: string;
  src: string;
  position: string;
  badgeTitle: string;
  badgeSub: string;
  skills: [string, string, string, string];
  // Nombres ficticios de muestra autorizados por la clienta (2026-09-24);
  // sustituir por perfiles reales cuando existan.
  name: string;
  role: string;
};

const services: Service[] = [
  {
    title: "Camareros/as",
    blurb:
      "Profesionales propios de sala, seleccionados y formados en nuestros estándares para que cada servicio fluya con agilidad.",
    copy: "Cada servicio de sala es ejecutado por profesionales propios, cuidadosamente seleccionados, formados en nuestros estándares y supervisados durante toda la prestación, garantizando agilidad y coherencia con la atmósfera del evento.",
    badgeTitle: "Equipos propios",
    badgeSub: "Seleccionados, formados y supervisados",
    slug: "camareros",
    src: "/images/serv-1-display.webp",
    position: "object-[50%_50%]",
    skills: ["Eventos", "5 años", "Inglés", "Hoteles"],
    name: "Lucía Fernández",
    role: "Camarera",
  },
  {
    title: "Maîtres",
    blurb:
      "Criterio, presencia y serenidad en los momentos de mayor exigencia, a la medida de cada marca.",
    copy: "Disponemos de maîtres seleccionados y entrenados según los criterios y estándares de cada empresa cliente, aportando el criterio, la presencia y la serenidad necesarios en los momentos de mayor exigencia.",
    badgeTitle: "Criterio y presencia",
    badgeSub: "A la medida de tu marca",
    slug: "maitres",
    src: "/images/serv-2-display.webp",
    position: "object-[50%_center]",
    skills: ["Protocolo", "7 años", "Inglés", "Sala"],
    name: "Javier Morales",
    role: "Maître",
  },
  {
    title: "Office y Housekeeping",
    blurb:
      "Orden, precisión y cuidado para que cada espacio refleje la excelencia de tu evento.",
    copy: "Contamos con personal seleccionado y preparado según los estándares de cada empresa cliente, garantizando el orden, la precisión y el cuidado necesarios para que cada espacio refleje el nivel de excelencia que exige cada evento.",
    badgeTitle: "Orden y precisión",
    badgeSub: "En cada detalle del espacio",
    slug: "office-y-housekeeping",
    src: "/images/serv-3-display.webp",
    position: "object-[50%_87%]",
    skills: ["Hoteles", "4 años", "Orden", "Detalle"],
    name: "Carmen Ruiz",
    role: "Office y Housekeeping",
  },
  {
    title: "Hostess",
    blurb:
      "Una bienvenida cuidada y una presencia acorde con la imagen y el nivel de cada evento.",
    copy: "Disponemos de personal de recepción seleccionado y formado según nuestros estándares y las necesidades de cada empresa cliente, garantizando una bienvenida cuidada, una atención impecable y una presencia acorde con la imagen y el nivel de cada evento.",
    badgeTitle: "Bienvenida impecable",
    badgeSub: "Acorde a tu imagen",
    slug: "hostess",
    src: "/images/serv-4-display.webp",
    position: "object-[50%_9%]",
    skills: ["Recepción", "3 años", "Inglés", "Eventos"],
    name: "Sofía Navarro",
    role: "Hostess",
  },
  {
    title: "Personal de cocina",
    blurb:
      "Se integran con agilidad en tu equipo, aportando orden y capacidad de respuesta.",
    copy: "Contamos con personal de cocina seleccionado y preparado para integrarse con agilidad en cada equipo, aportando orden, precisión y capacidad de respuesta para garantizar el correcto desarrollo del servicio incluso en los momentos de mayor exigencia.",
    badgeTitle: "Integración ágil",
    badgeSub: "En tu equipo desde el día uno",
    slug: "personal-de-cocina",
    src: "/images/serv-5-display.webp",
    position: "object-[50%_center]",
    skills: ["Cocina", "6 años", "Eventos", "Ritmo"],
    name: "Diego Torres",
    role: "Personal de cocina",
  },
  {
    title: "Supervisores",
    blurb:
      "Coordinan al equipo durante todo el servicio para que cada detalle se ejecute con precisión.",
    copy: "Nuestros supervisores coordinan y acompañan al equipo durante toda la prestación, asegurando el cumplimiento de los estándares acordados, anticipándose a las necesidades del servicio y garantizando que cada detalle se ejecute con precisión y coherencia.",
    badgeTitle: "Supervisión incluida",
    badgeSub: "Durante todo el servicio",
    slug: "supervisores",
    src: "/images/serv-6-display.webp",
    position: "object-[50%_center]",
    skills: ["Equipos", "9 años", "Eventos", "Control"],
    name: "Elena Vidal",
    role: "Supervisora",
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

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Mini tarjeta flotante, en la esquina superior izquierda de la tarjeta como una notificación. */
function MiniBadge() {
  return (
    <div
      aria-hidden="true"
      className="card-float absolute -left-6 -top-8 z-20 sm:-left-10 sm:-top-10"
      style={{ animationDelay: "-2.5s" }}
    >
      <div className="rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-[0_20px_45px_-12px_rgba(0,0,0,.25)]">
        <p className="flex items-center gap-1.5 text-[13px] font-extrabold leading-5 text-[#131313]">
          <span className="text-[#9db31c]">◆</span>
          <span>
            Personal seleccionado
            <br />
            y entrenado
          </span>
        </p>
      </div>
    </div>
  );
}

/** Tarjeta de profesional: flota sobre el fondo, sin panel detrás. */
function ProfileCard({ service, clone, eager }: { service: Service; clone?: boolean; eager?: boolean }) {
  return (
    <article
      id={clone ? undefined : service.slug}
      aria-hidden={clone || undefined}
      className="w-full shrink-0 scroll-mt-24 px-6 pb-16 pt-20"
    >
      <div className="card-float relative mx-auto flex min-h-[440px] w-full max-w-[380px] flex-col justify-center rounded-[24px] bg-white px-6 pb-10 text-center shadow-[0_30px_70px_rgba(0,0,0,0.12)]">
        <MiniBadge />
        <div className="-mt-[68px] mb-7 flex justify-center">
          <div className="relative">
            <span aria-hidden="true" className="absolute -inset-2 rounded-full bg-[#d2d943]/25 blur-lg" />
            <img
              src={service.src}
              alt={clone ? "" : `Fotografía de ${service.name}`}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              className={`relative size-[136px] rounded-full object-cover ring-4 ring-white ${service.position}`}
            />
          </div>
        </div>

        <h3 className="display mt-4 text-[clamp(1.7rem,2.4vw,2.1rem)] text-[#131313]">{service.name}</h3>
        <p className="mt-2 text-sm font-semibold text-[#4a5264]">{service.role}</p>

        <p aria-label="Valoración: 5 de 5 estrellas" className="mt-3 text-lg leading-none tracking-[.2em] text-[#D2D943]">
          <span aria-hidden="true">★★★★★</span>
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          {service.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-xl border border-[#e2e2e8] bg-white px-3 py-2.5 text-[12px] font-bold text-[#4a5264]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function ServiceShowcase() {
  const reducedMotion = useReducedMotion();
  const total = services.length;
  // Posición en el track extendido [clon último, ...reales, clon primero].
  // Las posiciones 1..total son las tarjetas reales.
  const [current, setCurrent] = useState(1);
  const [animated, setAnimated] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const realIndex = current === 0 ? total - 1 : current === total + 1 ? 0 : current - 1;
  const service = services[realIndex];
  const number = pad2(realIndex + 1);

  const goTo = useCallback(
    (index: number) => {
      setAnimated(!reducedMotion);
      setCurrent(index + 1);
    },
    [reducedMotion]
  );

  const next = useCallback(() => {
    if (reducedMotion) {
      setAnimated(false);
      setCurrent((c) => (c % total) + 1);
    } else {
      setAnimated(true);
      setCurrent((c) => c + 1);
    }
  }, [reducedMotion, total]);

  const prev = useCallback(() => {
    if (reducedMotion) {
      setAnimated(false);
      setCurrent((c) => ((c - 2 + total) % total) + 1);
    } else {
      setAnimated(true);
      setCurrent((c) => c - 1);
    }
  }, [reducedMotion, total]);

  // Salto invisible del clon a la tarjeta real para el bucle infinito.
  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== trackRef.current || event.propertyName !== "transform") return;
    if (current === total + 1) {
      setAnimated(false);
      setCurrent(1);
    } else if (current === 0) {
      setAnimated(false);
      setCurrent(total);
    }
  };

  // Los enlaces del navbar (/#slug) seleccionan el servicio correspondiente.
  useEffect(() => {
    const syncHash = () => {
      const index = services.findIndex((s) => `#${s.slug}` === window.location.hash);
      if (index >= 0) {
        setAnimated(false);
        setCurrent(index + 1);
      }
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchX.current = event.touches[0].clientX;
  };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchX.current === null) return;
    const dx = event.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 48) {
      if (dx < 0) next();
      else prev();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") next();
    else if (event.key === "ArrowLeft") prev();
  };

  const extended = [services[total - 1], ...services, services[0]];

  return (
    <div className="relative flex items-center overflow-hidden bg-white lg:h-[calc(100vh-5rem)] lg:max-h-[800px] lg:min-h-[650px]">
      {/* Formas abstractas suaves detrás */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/4 size-[380px] rounded-full bg-[#d2d943]/20 blur-[100px]" />
        {/* Detrás de la tarjeta: solo verde oliva muy sutil */}
        <div className="absolute right-[2%] top-1/2 size-[460px] -translate-y-1/2 rounded-full bg-[#6e7a10]/[.07] blur-[90px]" />
        <div className="absolute right-[9%] top-[14%] hidden size-40 rounded-full border-[20px] border-[#6e7a10]/10 lg:block" />
        <div className="absolute bottom-[8%] left-[4%] hidden size-36 rotate-12 rounded-[36px] bg-[#131313]/[.04] lg:block" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-12 px-5 py-16 md:px-10 lg:grid-cols-[45%_55%] lg:gap-8 lg:px-[clamp(2rem,4vw,4rem)] lg:py-0">
        {/* IZQUIERDA — información del servicio */}
        <div className="flex flex-col justify-center" aria-live="polite" aria-atomic="true">
          <motion.div
            key={service.slug}
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <p className="eyebrow flex items-center gap-2 text-[#6e7a10]">
              <span aria-hidden="true">◆</span> Servicio {number} · {service.badgeTitle}
            </p>
            <h2 className="display mt-4 text-[clamp(2.1rem,3.6vw,3.1rem)] text-[#131313]">
              {service.title}
            </h2>
            <p className="mt-5 max-w-md text-[clamp(.95rem,1.15vw,1.05rem)] leading-7 text-[#4a5264]">
              {service.blurb}
            </p>
            <a
              href={`/solicitar-servicio?servicio=${service.slug}`}
              className="btn btn-dark mt-8 !rounded-full"
            >
              Solicitar este servicio <ArrowRight size={18} aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        {/* DERECHA — carrusel de tarjetas */}
        <div className="relative">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[440px]"
          >
            <div
              role="region"
              aria-roledescription="carrusel"
              aria-label="Carrusel de servicios"
              tabIndex={0}
              onKeyDown={onKeyDown}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              className="overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6e7a10]"
            >
              <div
                ref={trackRef}
                onTransitionEnd={handleTransitionEnd}
                className="flex"
                style={{
                  transform: `translateX(-${current * 100}%)`,
                  transition: animated ? "transform .55s cubic-bezier(.22,.61,.36,1)" : "none",
                }}
              >
                {extended.map((s, i) => {
                  const isClone = i === 0 || i === total + 1;
                  return (
                    <ProfileCard
                      key={`${s.slug}-${isClone ? "clon" : "real"}`}
                      service={s}
                      clone={isClone}
                      eager={i === 1}
                    />
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={prev}
              aria-label="Servicio anterior"
              className="absolute -left-1 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-[#131313] shadow-[0_10px_25px_-8px_rgba(0,0,0,.25)] transition hover:bg-[#131313] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e7a10]"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Servicio siguiente"
              className="absolute -right-1 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-[#131313] shadow-[0_10px_25px_-8px_rgba(0,0,0,.25)] transition hover:bg-[#131313] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e7a10]"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </motion.div>

          <div className="mt-5 flex items-center justify-center gap-4">
            <span className="text-xs font-bold tracking-[.2em] text-[#131313]/60" aria-hidden="true">
              {number} / {pad2(total)}
            </span>
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Elegir servicio">
              {services.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === realIndex}
                  aria-label={`Ir a ${s.title}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === realIndex ? "w-5 bg-[#131313]" : "w-1.5 bg-[#131313]/20 hover:bg-[#131313]/40"
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="sr-only" aria-live="polite">
            Mostrando {service.title}, servicio {realIndex + 1} de {total}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Features() {
  const reducedMotion = useReducedMotion();
  return (
    <section id="servicios" className="w-full scroll-mt-[calc(5rem+1px)] overflow-hidden bg-white">
      {/* MOBILE — bloque de acciones (sin cambios) */}
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
                <motion.p
                  initial={{ opacity: reducedMotion ? 1 : 0, x: reducedMotion ? 0 : -80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="display max-w-[15ch] text-2xl font-semibold leading-tight"
                >
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

      {/* SERVICIOS — composición en una pantalla con carrusel */}
      <ServiceShowcase />
    </section>
  );
}
