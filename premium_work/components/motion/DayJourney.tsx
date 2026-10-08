"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "@/components/i18n/lang";

gsap.registerPlugin(ScrollTrigger);

const CHAPTER_STYLE = [
  { bg: "#f7e8d3", ink: "#131313", sub: "#4a5264" },
  { bg: "#e9f1fb", ink: "#131313", sub: "#4a5264" },
  { bg: "#f3cf8e", ink: "#131313", sub: "#5a4a2a" },
  { bg: "#0a1428", ink: "#ffffff", sub: "#c6d4f5" },
];

/**
 * DayJourney — «El día del evento»: sección fijada (pin) donde el scroll
 * avanza el reloj de la jornada. El fondo pasa de amanecer a gala nocturna
 * ligado al scroll (scrub) y un dial marca el progreso.
 */
export function DayJourney() {
  const { t, dict } = useLang();
  const root = useRef<HTMLElement>(null);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const CHAPTERS = dict.journey.chapters.map((c, i) => ({ ...c, ...CHAPTER_STYLE[i] }));

  useLayoutEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      const bg = root.current!.querySelector("[data-journey-bg]") as HTMLElement;
      const slides = gsap.utils.toArray<HTMLElement>("[data-journey-slide]");
      const hand = root.current!.querySelector("[data-journey-hand]") as HTMLElement;
      const clock = root.current!.querySelector("[data-journey-clock]") as HTMLElement;

      const bgMix = CHAPTERS.map((c) => c.bg);
      const inkMix = CHAPTERS.map((c) => c.ink);
      const subMix = CHAPTERS.map((c) => c.sub);
      const interpBg = gsap.utils.interpolate(bgMix);
      const interpInk = gsap.utils.interpolate(inkMix);
      const interpSub = gsap.utils.interpolate(subMix);

      const proxy = { p: 0 };
      gsap.to(proxy, {
        p: CHAPTERS.length - 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress * (CHAPTERS.length - 1);
            bg.style.backgroundColor = interpBg(self.progress);
            const ink = interpInk(self.progress);
            const sub = interpSub(self.progress);
            slides.forEach((slide, i) => {
              const dist = Math.abs(p - i);
              const vis = Math.max(0, 1 - dist * 1.4);
              slide.style.opacity = String(vis);
              slide.style.transform = `translateY(${(1 - vis) * 60}px)`;
              slide.style.visibility = vis > 0.02 ? "visible" : "hidden";
              (slide.querySelector("[data-j-title]") as HTMLElement).style.color = ink;
              (slide.querySelector("[data-j-text]") as HTMLElement).style.color = sub;
              (slide.querySelector("[data-j-label]") as HTMLElement).style.color = sub;
            });
            hand.style.transform = `rotate(${self.progress * 270 - 135}deg)`;
            const idx = Math.min(CHAPTERS.length - 1, Math.round(p));
            clock.textContent = CHAPTERS[idx].time;
            (root.current!.querySelector("[data-journey-dial]") as HTMLElement).style.color = ink;
            (root.current!.querySelector("[data-journey-hint]") as HTMLElement).style.color = sub;
          },
        },
      });

      // Entrada del dial
      gsap.fromTo(
        "[data-journey-dial]",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} className="relative" style={{ height: reduced ? "auto" : "420vh" }} aria-label={t("journey.aria")}>
      <div className={reduced ? "relative" : "sticky top-0 flex h-screen items-center overflow-hidden"}>
        <div data-journey-bg className="absolute inset-0" style={{ backgroundColor: CHAPTERS[0].bg }} aria-hidden="true" />
        {/* Dial sol/reloj */}
        <div
          data-journey-dial
          aria-hidden="true"
          className="absolute right-6 top-24 z-20 flex flex-col items-center gap-2 md:right-12"
          style={{ color: CHAPTERS[0].ink }}
        >
          <div className="relative h-20 w-20 rounded-full border-2 border-current opacity-70">
            <span className="absolute left-1/2 top-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-current" />
            <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-current" />
            <span className="absolute left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-current" />
            <span className="absolute right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-current" />
            <div data-journey-hand className="absolute inset-0" style={{ transform: "rotate(-135deg)" }}>
              <span className="absolute left-1/2 top-[8%] h-[42%] w-0.5 -translate-x-1/2 bg-[#eab308]" />
            </div>
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2451e6]" />
          </div>
          <span data-journey-clock className="display text-xl tabular-nums">06:00</span>
        </div>

        {/* Capítulos */}
        <div className={reduced ? "relative mx-auto w-full max-w-[1100px] px-5 md:px-8 py-16 space-y-16" : "absolute inset-0 z-10"}>
          {CHAPTERS.map((c, i) => (
            <article
              key={c.time}
              data-journey-slide
              className={reduced ? "relative" : "absolute inset-0 flex items-center"}
              style={reduced ? { opacity: 1 } : { opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
            >
              <div className="mx-auto w-full max-w-[1100px] px-5 md:px-8">
                <p data-j-label className="eyebrow" style={{ color: c.sub }}>
                  {c.time} · {c.label}
                </p>
                <h2
                  data-j-title
                  className="display mt-5 text-[clamp(2.8rem,9vw,6.5rem)]"
                  style={{ color: c.ink }}
                >
                  {c.title}
                </h2>
                <p data-j-text className="mt-6 max-w-[34rem] text-[15px] leading-7 sm:text-lg sm:leading-8" style={{ color: c.sub }}>
                  {c.text}
                </p>
                <p data-j-label className="eyebrow mt-8" style={{ color: c.sub }}>
                  <span aria-hidden="true" className="text-[#eab308]">◆</span> {c.sectors}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p data-journey-hint aria-hidden="true" className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 eyebrow" style={{ color: CHAPTERS[0].sub }}>
          {t("journey.hint")}
        </p>
      </div>
    </section>
  );
}
