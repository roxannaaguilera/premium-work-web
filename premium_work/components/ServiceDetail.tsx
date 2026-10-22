"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import FixedHeader from "@/components/chrome/FixedHeader";
import { ServiceFooter } from "@/components/ServiceFooter";
import { useLang } from "@/components/i18n/lang";

type InkBox = { frac: number; center: number };
const inkCache = new Map<string, InkBox>();

/** Altura opaca de la foto, para que el objeto (no el margen transparente) iguale al título. */
function imageInk(img: HTMLImageElement): InkBox {
  const key = img.currentSrc || img.src;
  const cached = inkCache.get(key);
  if (cached) return cached;
  const fallback: InkBox = { frac: 1, center: 0.5 };
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) return fallback;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return fallback;
  ctx.drawImage(img, 0, 0);
  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, w, h).data;
  } catch {
    return fallback;
  }
  let minY = h;
  let maxY = 0;
  const step = Math.max(1, Math.floor(w / 480));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 16) {
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        break;
      }
    }
  }
  if (maxY <= minY) return fallback;
  const box = { frac: (maxY - minY + 1) / h, center: (minY + maxY) / 2 / h };
  inkCache.set(key, box);
  return box;
}

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
  const reduceMotion = useReducedMotion();
  const items = dict.serviceDetail.items;
  const idx = items.findIndex((i) => i.slug === slug);
  const item = items[idx];
  const sector = dict.sectors.items[idx];
  const lines = splitTitle(sector.title.toUpperCase());
  const titleRef = useRef<HTMLHeadingElement>(null);
  const longest = Math.max(1, ...lines.map((l) => l.length));
  // Large hero type, near the old 10rem cap. Long lines scale down only
  // enough to stay inside the viewport; fit() keeps a short gap under the logo.
  const titleSize = `clamp(1.6rem, ${Math.min(14, 92 / (longest * 0.82)).toFixed(2)}vw, 10rem)`;
  useLayoutEffect(() => {
    const fit = () => {
      const el = titleRef.current;
      if (!el) return;
      el.style.fontSize = titleSize;
      const available = el.clientWidth;
      const needed = Math.max(0, ...[...el.querySelectorAll("span")].map((s) => s.scrollWidth));
      if (needed > available && available > 0) {
        const current = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = `${Math.max(28, (current * available) / needed * 0.98)}px`;
      }
      const header = document.querySelector("header");
      const minTop = (header?.getBoundingClientRect().bottom ?? 0) + 36;
      let guard = 0;
      while (el.getBoundingClientRect().top < minTop && guard < 12) {
        const current = parseFloat(getComputedStyle(el).fontSize);
        if (current <= 48) break;
        el.style.fontSize = `${Math.max(48, current * 0.97)}px`;
        guard++;
      }
    };
    fit();
    document.fonts?.ready.then(fit).catch(() => {});
    window.addEventListener("resize", fit);
    const prev = document.documentElement.style.overflowX;
    document.documentElement.style.overflowX = "clip";
    return () => {
      document.documentElement.style.overflowX = prev;
      window.removeEventListener("resize", fit);
    };
  }, [titleSize]);

  // En reposo el objeto es grande: la mitad asoma bajo el título y el viewport
  // recorta el resto. Al hacer scroll sube al centro y se encoge hasta la
  // altura del bloque entero del título (una línea, o las dos si las hay).
  const objectRef = useRef<HTMLDivElement>(null);
  const riseTarget = useMotionValue(0);
  const riseScale = useMotionValue(1);
  useLayoutEffect(() => {
    const place = () => {
      const title = titleRef.current;
      const wrap = objectRef.current;
      const sticky = title?.parentElement;
      if (!title || !sticky) return;
      const img = wrap?.querySelector("img");
      const gap = 32;
      const viewH = sticky.clientHeight || window.innerHeight;
      const h = viewH * 0.5;
      const top = viewH - h / 2;
      sticky.style.paddingBottom = `${h / 2 + gap}px`;
      sticky.style.justifyContent = "flex-end";
      if (wrap) {
        wrap.style.top = `${top}px`;
        wrap.style.bottom = "auto";
      }
      if (img) img.style.height = `${h}px`;
      const titleH = title.offsetHeight;
      const titleMid = title.offsetTop + titleH / 2;
      const objectMid = top + h / 2;
      const ink = img && img.complete && img.naturalWidth ? imageInk(img) : { frac: 1, center: 0.5 };
      const frac = ink.frac || 1;
      const s = Math.min(1, titleH / (h * frac));
      const shift = (ink.center - 0.5) * h * s;
      riseTarget.set(titleMid - objectMid - shift);
      riseScale.set(s);
      const half = viewH / 2;
      const endMid = titleMid - shift;
      (window as Window & { __pwDetailPose?: { drop: number; end: number; fill: number; fillEnd: number } }).__pwDetailPose = {
        drop: (objectMid - half) / half,
        end: (endMid - half) / half,
        fill: h / viewH,
        fillEnd: titleH / (viewH * frac),
      };
    };
    place();
    const ro = new ResizeObserver(place);
    if (titleRef.current) ro.observe(titleRef.current);
    const imgEl = objectRef.current?.querySelector("img");
    imgEl?.addEventListener("load", place);
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place).catch(() => {});
    return () => {
      ro.disconnect();
      imgEl?.removeEventListener("load", place);
      window.removeEventListener("resize", place);
      delete (window as Window & { __pwDetailPose?: { drop: number; end: number; fill: number; fillEnd: number } }).__pwDetailPose;
    };
  }, [titleSize, riseTarget, riseScale, slug]);

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
  // El header se oculta en cuanto el detalle deja el reposo. Se deriva del
  // mismo progreso de scroll que sube el objeto (framer, con el contenedor
  // del overlay o la ventana según el modo): es el canal que siempre
  // funciona, también al abrir un segundo servicio tras volver a la principal.
  const [pastTop, setPastTop] = useState(false);

  // El scroll sube el elemento y lo encoge hasta centrarlo en las letras,
  // a un tamaño proporcionado con la tipografía.
  const secRef = useRef<HTMLElement>(null);
  const meshSlotRef = useRef<HTMLDivElement>(null);
  const splitHeadRef = useRef<HTMLParagraphElement>(null);
  const splitCtaRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!liveMesh) return;
    const slot = meshSlotRef.current;
    if (!slot) return;
    window.dispatchEvent(new CustomEvent("pw-mesh-slot", { detail: slot }));
    return () => {
      (window as Window & { __pwDetailT?: number }).__pwDetailT = 0;
      window.dispatchEvent(new CustomEvent("pw-mesh-slot", { detail: null }));
    };
  }, [liveMesh]);
  // El botón de la sección dividida se centra entre el principio y el
  // final reales del titular: se mide el texto renderizado (la columna es
  // más ancha que las líneas del titular) y el contenedor del botón se
  // ajusta a ese tramo.
  useEffect(() => {
    const head = splitHeadRef.current;
    const cta = splitCtaRef.current;
    if (!head || !cta) return;
    const col = head.parentElement;
    if (!col) return;
    const align = () => {
      const colR = col.getBoundingClientRect();
      let minL = Infinity;
      let maxR = -Infinity;
      head.querySelectorAll("span").forEach((sp) => {
        const range = document.createRange();
        range.selectNodeContents(sp);
        const rects = range.getClientRects();
        for (let i = 0; i < rects.length; i++) {
          minL = Math.min(minL, rects[i].left);
          maxR = Math.max(maxR, rects[i].right);
        }
      });
      if (!isFinite(minL) || maxR <= minL) return;
      cta.style.marginLeft = `${Math.max(0, Math.round(minL - colR.left))}px`;
      cta.style.width = `${Math.round(maxR - minL)}px`;
    };
    align();
    const t = setTimeout(align, 350);
    window.addEventListener("resize", align);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", align);
    };
  }, [item.tagline, slug]);

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
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    (window as Window & { __pwDetailT?: number }).__pwDetailT = value;
    setPastTop(value > 0.01);
  });
  const riseY = useTransform([scrollYProgress, riseTarget], ([progress, target]: number[]) => {
    const t = Math.min(1, Math.max(0, progress / 0.55));
    return target * t;
  });
  const riseS = useTransform([scrollYProgress, riseScale], ([progress, scale]: number[]) => {
    const t = Math.min(1, Math.max(0, progress / 0.55));
    return 1 + (scale - 1) * t;
  });

  return (
    <>
      <FixedHeader hideUntilTop scrolledAway={pastTop} />
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
              height: [flight.fromH, flight.fromH * 1.35, window.innerHeight * 0.64 * 1.02, window.innerHeight * 0.64],
              y: [
                0,
                -70,
                window.innerHeight * 0.68 - flight.fromY + 18,
                window.innerHeight * 0.68 - flight.fromY,
              ],
              rotate: [flight.rotate, flight.rotate, -3, 0],
            }}
            transition={{ duration: 1.65, times: [0, 0.35, 0.8, 1], ease: ["easeOut", "easeIn", "easeOut"] }}
            onAnimationComplete={() => setLanded(true)}
          >
            <img src={flight.src} alt="" draggable={false} className="h-full w-auto select-none" />
          </motion.div>
        </div>
      )}
      <main className="overflow-x-clip bg-[#fbe5d4] text-[#131834]">
        {/* Nombre centrado + elemento que sube con el scroll */}
        <section ref={secRef} aria-label={sector.title} className="relative h-[240vh]">
          <div className="sticky top-0 flex h-screen flex-col items-center justify-end overflow-visible pb-[calc(32vh+32px)]">
            {liveMesh && (
              <div
                ref={meshSlotRef}
                data-pw-mesh-slot
                className="pointer-events-none absolute inset-0 z-20"
                style={{ background: "transparent", border: "none", outline: "none", boxShadow: "none", overflow: "visible" }}
              />
            )}
            <motion.h1
              ref={titleRef}
              style={{ fontSize: titleSize }}
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
                    : { duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }
              }
              className="z-10 box-border w-full max-w-[100vw] px-5 text-center font-serif font-semibold uppercase leading-[0.9] tracking-tight text-[#131834]"
            >
              {lines.map((l, i) => (
                <span key={i} className="block whitespace-nowrap">
                  {l}
                </span>
              ))}
            </motion.h1>
            {/* Visita directa: cae desde arriba y aterriza bajo el nombre.
                El scroll lo sube hasta el centro de las letras. */}
            {!liveMesh && (
            <div ref={objectRef} className="pointer-events-none absolute inset-x-0 z-20 flex justify-center">
              {flight ? (
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
                          className="w-auto object-contain"
                        />
                      </button>
                    ) : (
                      <Link href="/" {...backProps}>
                        <img
                          src={item.img}
                          alt={sector.title}
                          className="w-auto object-contain"
                        />
                      </Link>
                    )}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ y: "-35vh" }}
                  animate={{ y: ["-35vh", "2.4vh", "-1.1vh", "0vh"] }}
                  transition={{ duration: 1, times: [0, 0.62, 0.84, 1], ease: ["easeOut", "easeOut", "easeOut"] }}
                >
                  <motion.div style={{ y: riseY, scale: riseS }} className="pointer-events-auto">
                    {onClose ? (
                      <button onClick={onClose} {...backProps}>
                        <img
                          src={item.img}
                          alt={sector.title}
                          className="w-auto object-contain"
                        />
                      </button>
                    ) : (
                      <Link href="/" {...backProps}>
                        <img
                          src={item.img}
                          alt={sector.title}
                          className="w-auto object-contain"
                        />
                      </Link>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </div>
            )}
          </div>
        </section>

        {/* Descripción y qué incluye. Con `split` (piloto: Festivales), la
            descripción queda FIJA a la izquierda (sticky) y las
            características suben a la derecha con el scroll, como en la
            referencia de Roxanna; sin `split`, la sección clásica. */}
        {item.split ? (
          <section className="px-3 pt-2 pb-6 md:px-5 md:pb-8">
            {/* La sección va encerrada en un rectángulo de puntas redondeadas,
                como en Yellowball, sobre el fondo melocotón de la página */}
            <div className="relative rounded-[2rem] bg-[#faf6ee] md:rounded-[2.5rem]">
              {/* Guías verticales tenues dentro del panel */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <span className="absolute top-0 bottom-0 left-1/4 w-px bg-[#131834]/[0.06]" />
                <span className="absolute top-0 bottom-0 left-2/4 w-px bg-[#131834]/[0.06]" />
                <span className="absolute top-0 bottom-0 left-3/4 w-px bg-[#131834]/[0.06]" />
              </div>
              <div className="relative mx-auto grid max-w-6xl gap-14 px-5 pt-16 pb-10 md:grid-cols-[0.85fr_1.15fr] md:gap-24 md:px-10 md:pt-24 md:pb-6">
                {/* Columna fija: la descripción del servicio */}
                <div className="self-start md:sticky md:top-1/2 md:-translate-y-1/2">
                  <p className="font-mono text-xs tracking-[0.3em] text-[#131834]/50 uppercase">
                    {sector.title.split(/\s+(?:y|and|&)\s+/)[0]}
                  </p>
                  <p ref={splitHeadRef} className="mt-7 text-[2.55rem] leading-[1.04] font-bold tracking-[-0.03em] text-[#131834] md:text-[4.15rem]">
                    {item.tagline.split(/(?<=[.;,])\s+/).map((part, pi) => (
                      <span key={pi} className={pi > 0 ? "block md:ml-[50%]" : "block"}>
                        {part.replace(/[,;]/g, "")}
                      </span>
                    ))}
                  </p>
                  <div ref={splitCtaRef} className="mt-10 text-center">
                    <Link
                      href={`/solicitar-servicio?sector=${slug}`}
                      className="inline-flex min-h-[64px] items-center gap-3 rounded-full bg-[#e8b13a] px-9 text-lg font-semibold text-[#131834] transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      {item.cta ?? dict.serviceDetail.cta}
                    </Link>
                  </div>
                </div>
                {/* Características: bloques altos que suben con el scroll y le
                    dan a la columna fija su recorrido, como en el mockup */}
                <ul className="[&>li:last-child]:md:min-h-[240px]">
                  {(item.features ?? []).map((f, i) => (
                    <li
                      key={f.icon}
                      className="flex items-center gap-6 py-12 md:min-h-[430px] md:gap-9 md:py-0"
                    >
                      <img
                        src={`/images/iconos3d/${f.icon}.png`}
                        alt=""
                        loading="lazy"
                        className="pw-float w-32 shrink-0 mix-blend-multiply md:w-44"
                        style={{ animationDelay: `${(i % 6) * 0.7}s` }}
                      />
                      <h3 className="text-[1.65rem] font-medium tracking-[-0.01em] text-[#131834] md:text-[2rem]">
                        {item.includes[i]}
                      </h3>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ) : (
          <section className="px-5 py-14 md:px-10 md:py-20">
            <p className="max-w-2xl font-serif text-2xl italic text-[#131834]/85 md:text-3xl">
              {item.tagline}
            </p>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#131834]/85 md:text-xl">
              {sector.copy}
            </p>
            <h2 className="mt-12 text-xs font-bold uppercase tracking-[0.35em] text-[#131834]/60">
              {dict.serviceDetail.includesTitle}
            </h2>
            <ul className="mt-6 grid max-w-4xl gap-4 sm:grid-cols-2">
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
        )}

        {/* Los otros servicios, estilo Agrumea: fila horizontal de tarjetas
            claras con el objeto visible. Al pasar el cursor, el mismo telón
            rayado del inicio se cierra POR DETRÁS del objeto (el objeto queda
            por delante). En táctil y con movimiento reducido no hay telón. */}
        <section className="py-16 md:py-24">
          <h2 className="px-5 text-center font-serif text-[3.25rem] font-semibold uppercase leading-[0.95] tracking-[-0.01em] text-[#131834] md:text-[3.75rem] md:leading-[1.02]">
            <motion.span
              initial={reduceMotion ? false : { y: -48, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="inline-block"
            >
              {dict.serviceDetail.otherTitle.split(" ")[0]}
            </motion.span>
            <br className="md:hidden" />{" "}
            <motion.span
              initial={reduceMotion ? false : { y: -48, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
              className="inline-block"
            >
              {dict.serviceDetail.otherTitle.split(" ").slice(1).join(" ")}
            </motion.span>
          </h2>
          <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:mt-14 md:gap-6 md:px-10 [&::-webkit-scrollbar]:hidden">
            {items
              .filter((o) => o.slug !== slug)
              .map((o) => {
                const oi = items.indexOf(o);
                return (
                  <Link
                    key={o.slug}
                    href={`/servicios/${o.slug}`}
                    className="group w-[78vw] shrink-0 snap-start overflow-hidden rounded-[1.5rem] bg-[#faf6ee] md:w-[360px]"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 motion-reduce:hidden [@media(hover:none)]:hidden"
                      >
                        <div
                          className="absolute inset-y-0 left-0 w-1/2 -translate-x-[101%] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0"
                          style={{ background: "repeating-linear-gradient(90deg, #131834 0px, #131834 22px, #1b2148 22px, #1b2148 44px)" }}
                        >
                          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#eab308]" />
                        </div>
                        <div
                          className="absolute inset-y-0 right-0 w-1/2 translate-x-[101%] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0"
                          style={{ background: "repeating-linear-gradient(90deg, #131834 0px, #131834 22px, #1b2148 22px, #1b2148 44px)" }}
                        >
                          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#eab308]" />
                        </div>
                      </div>
                      <img
                        src={o.img}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 m-auto max-h-[78%] w-auto max-w-[86%] object-contain transition-transform duration-500 ease-out group-hover:rotate-2"
                      />
                      <span className="absolute left-1/2 top-4 z-20 -translate-x-1/2 -translate-y-2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#131834] opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:hidden [@media(hover:none)]:hidden">
                        <span aria-hidden="true" className="mr-2 text-[#e8b13a]">◆</span>
                        {dict.serviceDetail.discover}
                      </span>
                    </div>
                    <p className="px-4 pb-6 text-center text-sm font-bold uppercase tracking-wider text-[#131834] md:text-base">
                      {dict.sectors.items[oi].title}
                    </p>
                  </Link>
                );
              })}
          </div>
        </section>
      </main>
      <ServiceFooter />
    </>
  );
}
