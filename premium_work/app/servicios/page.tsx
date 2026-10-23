"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FixedHeader from "@/components/chrome/FixedHeader";
import { ServiceFooter } from "@/components/ServiceFooter";
import { useLang } from "@/components/i18n/lang";

gsap.registerPlugin(ScrollTrigger);

/**
 * Vista «Servicios»: mismo formato que «Nosotros»: la palabra
 * SERVICIOS en grande y una descripción pequeña centrada; luego, una
 * tarjeta grande por servicio, apiladas con pin de GSAP y scrub en
 * escritorio (cada tarjeta entra desde abajo tapando a la anterior,
 * que se encoge, se inclina y se oscurece); al soltar el pin aparece
 * el footer. En pantallas bajas o con movimiento reducido, las tarjetas
 * van una debajo de otra en flujo normal.
 */
export default function ServiciosPage() {
  const { dict } = useLang();
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stacked, setStacked] = useState(false);

  const cards = dict.serviceDetail.items.map((item, i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: dict.sectors.items[i].title,
    copy: dict.sectors.items[i].copy,
    slug: item.slug,
  }));
  const n = cards.length;

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setStacked(!mq.matches && window.innerHeight >= 600);
    update();
    window.addEventListener("resize", update);
    mq.addEventListener("change", update);
    return () => {
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", update);
    };
  }, []);

  useLayoutEffect(() => {
    if (!stacked) return;
    const outer = outerRef.current;
    const stage = stageRef.current;
    if (!outer || !stage) return;
    const ctx = gsap.context(() => {
      // Un tramo de scroll por transición: la tarjeta j entra en el
      // segmento [(j-1)/(n-1), j/(n-1)] y la anterior se va atrás.
      const seg = 1 / (n - 1);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          // Ojo: ScrollTrigger no entiende "vh" en start/end (lo leería
          // como px); el recorrido son (n-1) pantallas y se calcula aquí.
          end: () => `+=${window.innerHeight * (n - 1)}`,
          scrub: true,
          pin: stage,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      for (let j = 1; j < n; j++) {
        const at = (j - 1) * seg;
        const card = cardRefs.current[j];
        const prev = cardRefs.current[j - 1];
        const shade = shadeRefs.current[j - 1];
        if (card)
          tl.fromTo(
            card,
            { yPercent: 140 },
            { yPercent: 0, ease: "none", duration: seg },
            at,
          );
        if (prev)
          tl.to(
            prev,
            { scale: 0.85, rotationZ: -3.8, rotationX: 8, ease: "none", duration: seg },
            at,
          );
        if (shade)
          tl.fromTo(
            shade,
            { opacity: 0 },
            { opacity: 0.26, ease: "none", duration: seg },
            at,
          );
      }
    }, outer);
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    return () => ctx.revert();
  }, [stacked, n]);

  return (
    <>
      <FixedHeader hideUntilTop />
      <main className="bg-[#fbe5d4] text-[#131834]">
        {/* Encabezado: palabra en grande + descripción centrada */}
        <section className="px-5 pt-56 pb-12 text-center md:px-16 md:pt-72">
          <h1 className="font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.95] font-semibold tracking-[-0.01em] uppercase">
            {dict.header.nav[1]}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#131834]/70">
            {dict.sectors.indexCopy}
          </p>
        </section>
        <div
          ref={outerRef}
          className="relative"
          style={{ minHeight: stacked ? `${n * 100}vh` : undefined }}
        >
          <div
            ref={stageRef}
            className={
              stacked
                ? "relative h-[100vh] overflow-hidden"
                : "relative px-5 py-24 md:px-10"
            }
            style={{ perspective: stacked ? "1400px" : undefined }}
          >
            {cards.map((card, i) => (
              <div
                key={card.slug}
                className={
                  stacked
                    ? "pointer-events-none absolute inset-0 flex items-center justify-center"
                    : "pointer-events-none relative mb-6 last:mb-0"
                }
              >
                <article
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={`pointer-events-auto relative rounded-[2rem] bg-[#faf6ee] ${
                    stacked ? "w-[min(92vw,80rem)] h-[92vh]" : "w-full"
                  }`}
                  style={{ zIndex: 10 + i * 10 }}
                >
                  <div className="flex h-full flex-col justify-center px-6 pt-36 pb-10 md:px-12 md:pt-44">
                    <p className="font-mono text-sm text-[#131834]/40">{card.num}</p>
                    <h2 className="font-serif mt-4 text-[clamp(2rem,4.5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.01em]">
                      {card.title}
                    </h2>
                    <p className="mt-5 max-w-2xl text-lg leading-8 text-[#131834]/70">
                      {card.copy}
                    </p>
                    <Link
                      href={`/servicios/${card.slug}`}
                      className="mt-8 inline-flex w-fit items-center gap-2 text-lg font-semibold transition-colors hover:text-[#eab308]"
                    >
                      {dict.serviceDetail.cardTooltip}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                  {i < n - 1 && (
                    <div
                      ref={(el) => {
                        shadeRefs.current[i] = el;
                      }}
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-[2rem] bg-black opacity-0"
                    />
                  )}
                </article>
              </div>
            ))}
          </div>
        </div>
      </main>
      <ServiceFooter />
    </>
  );
}
