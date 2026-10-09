"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FixedHeader from "@/components/chrome/FixedHeader";
import { Footer } from "@/components/Footer";
import { useLang } from "@/components/i18n/lang";

/** Divide un título en dos líneas equilibradas (p. ej. EVENTOS / PRIVADOS). */
function splitTitle(title: string): string[] {
  const words = title.split(" ");
  if (words.length === 1) return [title];
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    const b = words.slice(i).join(" ").length;
    const d = Math.abs(a - b);
    if (d < bestDiff) {
      bestDiff = d;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

type FromPos = { dx: number; dy: number } | null;

export type Flight = { src: string; slug: string; fromY: number; fromH: number; rotate: number };

export default function ServiceDetail({
  slug,
  initialFlight,
  onClose,
  scrollContainer,
}: {
  slug: string;
  initialFlight?: Flight | null;
  onClose?: () => void;
  scrollContainer?: RefObject<HTMLDivElement | null>;
}) {
  const { dict } = useLang();
  const items = dict.serviceDetail.items;
  const idx = items.findIndex((i) => i.slug === slug);
  const item = items[idx];
  const sector = dict.sectors.items[idx];
  const lines = splitTitle(sector.title.toUpperCase());

  // El elemento entra desde la posición que tenía en el hero (inclinado)
  // y se incorpora a su nueva posición; después el scroll lo sube.
  const [from, setFrom] = useState<FromPos>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Centro del elemento al inicio del scroll: abajo del sticky.
    const endX = vw / 2;
    const endY = vh * 0.74;
    let dx = 0;
    let dy = vh * 0.45;
    try {
      const raw = sessionStorage.getItem("pw-element-from");
      if (raw) {
        const p = JSON.parse(raw) as { x: number; y: number; slug: string };
        sessionStorage.removeItem("pw-element-from");
        if (p.slug === slug) {
          dx = p.x - endX;
          dy = p.y - endY;
        }
      }
    } catch {
      /* visita directa: entra desde abajo */
    }
    setFrom({ dx, dy });
    setReady(true);
  }, [slug]);

  // Vuelo del clon (técnica Agrumea, sin panel): si hay datos de vuelo en
  // sessionStorage, un clon fixed vuela desde el rect del héroe hasta el reposo,
  // con la coreografía (avanza agrandándose → cae con rebote). Al aterrizar,
  // cede al objeto real por crossfade. Sin vuelo: entrada directa.
  // Se lee en useEffect (no en el inicializador) para evitar mismatch de
  // hidratación: el servidor renderiza sin vuelo y el cliente lo añade tras hidratar.
  // Si viene initialFlight (overlay SPA), se usa directamente sin sessionStorage.
  const [flight, setFlight] = useState<Flight | null>(initialFlight ?? null);
  // Overlay del héroe: el mesh de WebGL sigue montado y ocupa este hueco.
  // No se pinta una segunda foto.
  const liveMesh = Boolean(initialFlight);
  useEffect(() => {
    if (initialFlight) return; // el overlay ya lo pasó
    try {
      const raw = sessionStorage.getItem("pw-flight");
      if (raw) {
        const f = JSON.parse(raw) as Flight;
        sessionStorage.removeItem("pw-flight");
        if (f.slug === slug) setFlight(f);
      }
    } catch {
      /* sin vuelo: entrada directa */
    }
  }, [slug]);
  const [landed, setLanded] = useState(false);

  // El scroll sube el elemento y lo encoge hasta centrarlo en las letras,
  // a un tamaño proporcionado con la tipografía.
  const secRef = useRef<HTMLElement>(null);
  const meshSlotRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!liveMesh) return;
    const slot = meshSlotRef.current;
    if (!slot) return;
    window.dispatchEvent(new CustomEvent("pw-mesh-slot", { detail: slot }));
    return () => {
      window.dispatchEvent(new CustomEvent("pw-mesh-slot", { detail: null }));
    };
  }, [liveMesh]);
  // En modo overlay (SPA), el objeto cierra el overlay en vez de navegar.
  // Se define fuera del JSX para evitar remontajes.
  const backProps = {
    "aria-label": dict.header.logoLabel,
    title: dict.header.logoLabel,
    className: "block cursor-pointer",
  } as const;

  const { scrollYProgress } = useScroll({
    container: scrollContainer,
    target: secRef,
    offset: ["start start", "end end"],
  });
  const riseY = useTransform(scrollYProgress, [0, 0.6], ["0vh", "-50vh"]);
  const riseS = useTransform(scrollYProgress, [0, 0.6], [1, 0.35]);

  return (
    <>
      <FixedHeader />
      {/* Visita directa: un clon vuela desde el rect guardado. El overlay no lo usa. */}
      {!liveMesh && flight && !landed && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 z-[100] flex justify-center"
          style={{ top: flight.fromY }}
        >
          <motion.div
            initial={{ height: flight.fromH, rotate: flight.rotate, y: 0 }}
            animate={{
              height: [flight.fromH, flight.fromH * 1.35, window.innerHeight * 0.62 * 1.02, window.innerHeight * 0.62],
              y: [0, -70, window.innerHeight * 0.7 - flight.fromY + 22, window.innerHeight * 0.7 - flight.fromY],
              rotate: [flight.rotate, flight.rotate, -3, 0],
            }}
            transition={{ duration: 1.65, times: [0, 0.35, 0.8, 1], ease: ["easeOut", "easeIn", "easeOut"] }}
            onAnimationComplete={() => setLanded(true)}
          >
            <img src={flight.src} alt="" draggable={false} className="h-full w-auto select-none" />
          </motion.div>
        </div>
      )}
      <main className="bg-[#fdf3eb] text-[#131834]">
        {/* Nombre centrado + elemento que sube con el scroll */}
        <section ref={secRef} aria-label={sector.title} className="relative h-[240vh]">
          <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: -96 }}
              animate={
                liveMesh
                  ? { opacity: 1, y: 0 }
                  : flight
                    ? landed
                      ? { opacity: 1, y: 0 }
                      : {}
                    : { opacity: 1, y: 0 }
              }
              transition={
                liveMesh
                  ? { duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }
                  : flight
                    ? { duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }
                    : { duration: 0.9, delay: 1.7, ease: [0.22, 1, 0.36, 1] }
              }
              className="z-10 px-4 text-center font-serif font-semibold uppercase leading-[0.9] tracking-tight text-[#131834] text-[clamp(3.5rem,13vw,12rem)]"
            >
              {lines.map((l, i) => (
                <span key={i} className="block">
                  {l}
                </span>
              ))}
            </motion.h1>
            {/* Entrada desde el hero (fuera) + subida con scroll (dentro).
                En reposo asoma la mitad del objeto sin tapar el nombre.
                La entrada es una coreografía lenta: el objeto avanza hacia la
                pantalla agrandándose (manteniendo la inclinación del hover) y
                luego cae con rebote hasta su posición final. */}
            <div className="pointer-events-none absolute inset-x-0 -bottom-[32vh] z-20 flex justify-center">
              {liveMesh ? (
                <motion.div style={{ y: riseY, scale: riseS }} className="pointer-events-auto relative">
                  <div ref={meshSlotRef} data-pw-mesh-slot />
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label={dict.header.logoLabel}
                    className="absolute inset-0 z-[1] cursor-pointer appearance-none border-0 bg-transparent shadow-none outline-none"
                    style={{ border: "none", outline: "none", boxShadow: "none", background: "transparent" }}
                  />
                </motion.div>
              ) : flight ? (
                // Relevo del clon volador: aparece al aterrizar (crossfade invisible).
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: landed ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <motion.div style={{ y: riseY, scale: riseS }} className="pointer-events-auto">
                    {onClose ? (
                      <button onClick={onClose} {...backProps}>
                        <img
                          src={item.img}
                          alt={sector.title}
                          className="h-[62vh] w-auto object-contain drop-shadow-[0_30px_40px_rgba(19,24,52,0.18)]"
                        />
                      </button>
                    ) : (
                      <Link href="/" {...backProps}>
                        <img
                          src={item.img}
                          alt={sector.title}
                          className="h-[62vh] w-auto object-contain drop-shadow-[0_30px_40px_rgba(19,24,52,0.18)]"
                        />
                      </Link>
                    )}
                  </motion.div>
                </motion.div>
              ) : (
                ready && (
                <motion.div
                  initial={{ x: from?.dx ?? 0, y: from?.dy ?? 0, scale: 1.14, rotate: -22 }}
                  animate={{
                    x: [(from?.dx ?? 0), (from?.dx ?? 0) * 0.4, 0, 0],
                    y: [(from?.dy ?? 0), (from?.dy ?? 0) - 100, 26, 0],
                    scale: [1.14, 1.5, 0.94, 1],
                    rotate: [-22, -22, -4, 0],
                  }}
                  transition={{ duration: 2, times: [0, 0.38, 0.78, 1], ease: ["easeOut", "easeIn", "easeOut"] }}
                >
                  <motion.div style={{ y: riseY, scale: riseS }} className="pointer-events-auto">
                    {onClose ? (
                      <button onClick={onClose} {...backProps}>
                        <img
                          src={item.img}
                          alt={sector.title}
                          className="h-[62vh] w-auto object-contain drop-shadow-[0_30px_40px_rgba(19,24,52,0.18)]"
                        />
                      </button>
                    ) : (
                      <Link href="/" {...backProps}>
                        <img
                          src={item.img}
                          alt={sector.title}
                          className="h-[62vh] w-auto object-contain drop-shadow-[0_30px_40px_rgba(19,24,52,0.18)]"
                        />
                      </Link>
                    )}
                  </motion.div>
                </motion.div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Descripción y qué incluye */}
        <section className="px-5 md:px-10 py-14 md:py-20">
          <p className="max-w-2xl font-serif text-2xl md:text-3xl italic text-[#131834]/85">
            {item.tagline}
          </p>
          <p className="mt-6 max-w-3xl text-lg md:text-xl leading-relaxed text-[#131834]/85">
            {sector.copy}
          </p>
          <h2 className="mt-12 text-xs font-bold uppercase tracking-[0.35em] text-[#131834]/60">
            {dict.serviceDetail.includesTitle}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 max-w-4xl">
            {item.includes.map((inc) => (
              <li key={inc} className="flex items-start gap-3 text-base md:text-lg">
                <span aria-hidden="true" className="mt-2 inline-block h-2.5 w-2.5 shrink-0 rotate-45 bg-[#d9a83f]" />
                <span>{inc}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/solicitar-servicio?sector=${slug}`}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#131834] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#faf6ee] transition-colors hover:bg-[#1e2450]"
          >
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rotate-45 bg-[#eab308]" />
            {dict.serviceDetail.cta}
          </Link>
        </section>

        {/* Los otros servicios */}
        <section className="border-t border-[#131834]/10 px-5 md:px-10 py-14 md:py-20">
          <h2 className="text-xs font-bold uppercase tracking-[0.35em] text-[#131834]/60">
            {dict.serviceDetail.otherTitle}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items
              .filter((o) => o.slug !== slug)
              .map((o) => {
                const oi = items.indexOf(o);
                return (
                  <Link
                    key={o.slug}
                    href={`/servicios/${o.slug}`}
                    className="group rounded-2xl bg-[#faf6ee] p-5 transition-transform hover:-translate-y-1"
                  >
                    <img src={o.img} alt="" className="mx-auto h-28 w-auto object-contain transition-transform group-hover:scale-105" />
                    <p className="mt-4 text-center text-sm font-bold uppercase tracking-wider text-[#131834]">
                      {dict.sectors.items[oi].title}
                    </p>
                  </Link>
                );
              })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
