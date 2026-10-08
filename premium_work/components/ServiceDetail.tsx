"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

export default function ServiceDetail({ slug }: { slug: string }) {
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

  // El scroll sube el elemento y lo encoge hasta centrarlo en las letras,
  // a un tamaño proporcionado con la tipografía.
  const secRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: secRef, offset: ["start start", "end end"] });
  const riseY = useTransform(scrollYProgress, [0, 0.6], ["0vh", "-50vh"]);
  const riseS = useTransform(scrollYProgress, [0, 0.6], [1, 0.35]);

  return (
    <>
      <FixedHeader />
      <main className="bg-[#fdf3eb] text-[#131834]">
        {/* Nombre centrado + elemento que sube con el scroll */}
        <section ref={secRef} aria-label={sector.title} className="relative h-[240vh]">
          <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="z-10 px-4 text-center font-serif font-semibold uppercase leading-[0.9] tracking-tight text-[#131834] text-[clamp(3.5rem,13vw,12rem)]"
            >
              {lines.map((l, i) => (
                <span key={i} className="block">
                  {l}
                </span>
              ))}
            </motion.h1>
            {/* Entrada desde el hero (fuera) + subida con scroll (dentro).
                En reposo asoma la mitad del objeto sin tapar el nombre. */}
            <div className="pointer-events-none absolute inset-x-0 -bottom-[32vh] z-20 flex justify-center">
              {ready && (
                <motion.div
                  initial={{ x: from?.dx ?? 0, y: from?.dy ?? 0, scale: 1.14, rotate: -22 }}
                  animate={{ x: 0, y: 0, scale: 1, rotate: [-22, -22, 0] }}
                  transition={{
                    duration: 1.1,
                    ease: [0.22, 1, 0.36, 1],
                    rotate: { duration: 1.1, times: [0, 0.7, 1], ease: "easeOut" },
                  }}
                >
                  <motion.div style={{ y: riseY, scale: riseS }} className="pointer-events-auto">
                    <Link
                      href="/"
                      aria-label={dict.header.logoLabel}
                      title={dict.header.logoLabel}
                      className="block cursor-pointer"
                    >
                      <img
                        src={item.img}
                        alt={sector.title}
                        className="h-[62vh] w-auto object-contain drop-shadow-[0_30px_40px_rgba(19,24,52,0.18)]"
                      />
                    </Link>
                  </motion.div>
                </motion.div>
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
