"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FixedHeader from "@/components/chrome/FixedHeader";
import { DirectContact } from "@/components/DirectContact";
import { ServiceFooter } from "@/components/ServiceFooter";
import { useLang } from "@/components/i18n/lang";

gsap.registerPlugin(ScrollTrigger);

/**
 * Vista «Nosotros»: solo tres tarjetas apiladas estilo Agrumea para
 * vender la experiencia: tarjetas grandes y centradas en el
 * escenario, con el melocotón visible alrededor. Encabezado: la
 * palabra NOSOTROS en grande y una descripción pequeña centrada;
 * luego, las tarjetas. En escritorio, GSAP fija el escenario (pin,
 * scrub) y cada tarjeta entra desde abajo tapando a la anterior, que
 * se encoge, se inclina y se oscurece; al soltar el pin aparece el
 * footer. En pantallas bajas o con movimiento reducido, las tarjetas
 * van una debajo de otra en flujo normal.
 */
export default function NosotrosPage() {
  const { dict } = useLang();
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stacked, setStacked] = useState(false);

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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          // Ojo: ScrollTrigger no entiende "vh" en start/end (lo leería
          // como px); el recorrido son 2 pantallas y se calcula aquí.
          end: () => `+=${window.innerHeight * 2}`,
          scrub: true,
          pin: stage,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      const [c1, c2, c3] = cardRefs.current;
      const [s1, s2] = shadeRefs.current;
      // Las tarjetas van centradas y miden menos que el escenario, así
      // que con yPercent 100 asomarían por abajo en reposo; 140 las
      // esconde del todo.
      if (c2) tl.fromTo(c2, { yPercent: 140 }, { yPercent: 0, ease: "none" }, 0);
      if (c1) tl.to(c1, { scale: 0.85, rotationZ: -3.8, rotationX: 8, ease: "none" }, 0);
      if (s1) tl.fromTo(s1, { opacity: 0 }, { opacity: 0.26, ease: "none" }, 0);
      if (c3) tl.fromTo(c3, { yPercent: 140 }, { yPercent: 0, ease: "none" }, 0.5);
      if (c2) tl.to(c2, { scale: 0.85, rotationZ: -3.8, rotationX: 8, ease: "none" }, 0.5);
      if (s2) tl.fromTo(s2, { opacity: 0 }, { opacity: 0.26, ease: "none" }, 0.5);
    }, outer);
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    return () => ctx.revert();
  }, [stacked]);

  const cards: {
    num: string;
    title: string;
    copy?: string;
    items?: string[];
    steps?: { title: string; copy: string }[];
    contact?: boolean;
  }[] = [
    {
      num: "01",
      title: dict.about.title,
      items: dict.sectors.items.map((s) => s.title),
    },
    {
      num: "02",
      title: dict.about.processTitle,
      steps: dict.about.steps,
    },
    {
      num: "03",
      title: dict.about.visionEyebrow,
      copy: dict.about.vision,
      contact: true,
    },
  ];

  return (
    <>
      <FixedHeader hideUntilTop />
      <main className="bg-[#fbe5d4] text-[#131834]">
        {/* Encabezado: palabra en grande + descripción centrada */}
        <section className="px-5 pt-56 pb-12 text-center md:px-16 md:pt-72">
          <h1 className="font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.95] font-semibold tracking-[-0.01em] uppercase">
            {dict.about.eyebrow}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#131834]/70">
            {dict.about.copy}
          </p>
        </section>
        <div
          ref={outerRef}
          className="relative"
          style={{ minHeight: stacked ? "300vh" : undefined }}
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
                key={card.num}
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
                <div data-lenis-prevent className="h-full overflow-y-auto rounded-[2rem]">
                <div className="flex min-h-full flex-col justify-center px-6 pt-36 pb-10 md:px-12 md:pt-44">
                  <p className="font-mono text-sm text-[#131834]/40">{card.num}</p>
                  <h2 className="font-serif mt-4 text-[clamp(2rem,4.5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.01em]">
                    {card.title}
                  </h2>
                  {card.copy && (
                    <p className="mt-5 max-w-2xl text-lg leading-8 text-[#131834]/70">
                      {card.copy}
                    </p>
                  )}
                  {card.items && (
                    <p className="mt-6 text-base leading-7 font-semibold">
                      {card.items.join(" · ")}
                    </p>
                  )}
                  {card.steps && (
                    <ol className="mt-6 space-y-5">
                      {card.steps.map((step, si) => (
                        <li key={step.title} className="flex gap-4">
                          <span className="font-mono text-sm text-[#eab308]">
                            {String(si + 1).padStart(2, "0")}
                          </span>
                          <span>
                            <span className="block text-lg font-semibold">
                              {step.title}
                            </span>
                            <span className="mt-1 block leading-7 text-[#131834]/70">
                              {step.copy}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                  {card.contact && (
                    <div className="mt-8">
                      <DirectContact kind="client" />
                    </div>
                  )}
                </div>
                </div>
                {i < 2 && (
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
