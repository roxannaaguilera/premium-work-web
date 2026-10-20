"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
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

/** Iconos de trazo para las características del layout `split`. */
function FeatureIcon({ icon }: { icon: string }) {
  const p = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (icon) {
    case "barra":
      return (
        <svg {...p}>
          <path d="M4 5h16l-8 9-8-9z" />
          <path d="M12 14v5" />
          <path d="M8 21h8" />
        </svg>
      );
    case "accesos":
      return (
        <svg {...p}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M14 6v12" strokeDasharray="2 3" />
        </svg>
      );
    case "restauracion":
      return (
        <svg {...p}>
          <path d="M7 3v6M4.8 3v3.2a2.2 2.2 0 0 0 4.4 0V3M7 11v10" />
          <path d="M17.5 3c-1.8 2.2-2.6 4.8-2.6 7.2 0 1.2.8 1.8 2.6 1.8v9" />
        </svg>
      );
    case "supervisor":
      return (
        <svg {...p}>
          <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "coordinador":
      return (
        <svg {...p}>
          <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
          <rect x="3" y="13.5" width="4" height="6" rx="1.6" />
          <rect x="17" y="13.5" width="4" height="6" rx="1.6" />
          <path d="M19.5 19.5c0 1.4-1.1 2-3 2h-2.5" />
        </svg>
      );
    case "reemplazo":
      return (
        <svg {...p}>
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      );
    case "cloche":
      return (
        <svg {...p}>
          <path d="M4 18.5h16" />
          <path d="M5.5 18.5a6.5 6.5 0 0 1 13 0" />
          <path d="M12 12V10.6" />
          <circle cx="12" cy="9.4" r="1.1" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...p}>
          <path d="M11 4l1.3 4.2 4.2 1.3-4.2 1.3L11 15l-1.3-4.2L5.5 9.5l4.2-1.3L11 4z" />
          <path d="M18.2 14.8l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" />
        </svg>
      );
    case "bell":
      return (
        <svg {...p}>
          <path d="M6.5 16.2a5.5 5 0 0 1 11 0" />
          <circle cx="12" cy="10" r="1" />
          <path d="M12 11V9.8" />
          <path d="M4 16.4h16" />
          <path d="M3.4 19.8h17.2" />
        </svg>
      );
    case "users":
      return (
        <svg {...p}>
          <circle cx="9" cy="8.5" r="3.2" />
          <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
          <path d="M15.8 5.7a3.2 3.2 0 0 1 0 5.9" />
          <path d="M17.6 14.4a5.5 5.5 0 0 1 2.9 5.1" />
        </svg>
      );
    case "pan":
      return (
        <svg {...p}>
          <circle cx="10" cy="14" r="6.2" />
          <path d="M14.6 9.4L20.8 3.4" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...p}>
          <rect x="3.5" y="5" width="17" height="16" rx="2" />
          <path d="M3.5 9.8h17" />
          <path d="M8 3v4M16 3v4" />
        </svg>
      );
    case "shield":
      return (
        <svg {...p}>
          <path d="M12 3l7 2.6v5.2c0 4.8-3.4 7.9-7 9.7-3.6-1.8-7-4.9-7-9.7V5.6L12 3z" />
          <path d="M9 11.6l2.1 2.1 3.9-4" />
        </svg>
      );
    case "boxes":
      return (
        <svg {...p}>
          <path d="M12 3.2L4 7.4v9.2l8 4.2 8-4.2V7.4L12 3.2z" />
          <path d="M4 7.4l8 4.2 8-4.2" />
          <path d="M12 11.6v9.2" />
        </svg>
      );
    case "truck":
      return (
        <svg {...p}>
          <path d="M2.5 6.5H14V16H2.5z" />
          <path d="M14 10h4l3 3.2V16h-7" />
          <circle cx="6.8" cy="17.8" r="1.7" />
          <circle cx="17.2" cy="17.8" r="1.7" />
          <path d="M8.5 17.8h6.9" />
        </svg>
      );
    case "mic":
      return (
        <svg {...p}>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
          <path d="M12 18v3" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...p}>
          <rect x="5.5" y="4.5" width="13" height="17" rx="2" />
          <path d="M9.2 4.6a2.9 2.9 0 0 1 5.6 0" />
          <path d="M9 11h6M9 14.8h6" />
        </svg>
      );
    case "tie":
      return (
        <svg {...p}>
          <path d="M10 3.5h4l-1.1 3L14.5 18 12 20.8 9.5 18l1.6-11.5L10 3.5z" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...p}>
          <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
          <path d="M7 5.6H4.2a2.8 2.8 0 0 0 3 4.3" />
          <path d="M17 5.6h2.8a2.8 2.8 0 0 1-3 4.3" />
          <path d="M12 14v3.2" />
          <path d="M8.6 20.4a3.4 3.4 0 0 1 6.8 0" />
        </svg>
      );
    case "zap":
      return (
        <svg {...p}>
          <path d="M13 2.8L4.8 13.8h5.4l-.8 7.4 8.2-11h-5.4l.8-7.4z" />
        </svg>
      );
    case "sliders":
      return (
        <svg {...p}>
          <path d="M4 7h9.2M17.8 7H20" />
          <circle cx="15.4" cy="7" r="2.1" />
          <path d="M4 17h3.6M12.2 17H20" />
          <circle cx="9.8" cy="17" r="2.1" />
        </svg>
      );
    case "lock":
      return (
        <svg {...p}>
          <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
          <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
          <circle cx="12" cy="15.2" r="1.3" />
        </svg>
      );
    case "id":
      return (
        <svg {...p}>
          <rect x="3.5" y="5" width="17" height="14" rx="2" />
          <circle cx="8.8" cy="11" r="2" />
          <path d="M5.8 16.6a3.2 3.2 0 0 1 6 0" />
          <path d="M15.5 10h4M15.5 13.4h4" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <rect x="7.5" y="7.5" width="9" height="9" transform="rotate(45 12 12)" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

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
      const h = viewH * 0.64;
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
            <div className="relative overflow-hidden rounded-[2rem] bg-[#faf6ee] md:rounded-[2.5rem]">
              {/* Guías verticales tenues dentro del panel */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <span className="absolute top-0 bottom-0 left-1/4 w-px bg-[#131834]/[0.06]" />
                <span className="absolute top-0 bottom-0 left-2/4 w-px bg-[#131834]/[0.06]" />
                <span className="absolute top-0 bottom-0 left-3/4 w-px bg-[#131834]/[0.06]" />
              </div>
              <div className="relative mx-auto grid max-w-6xl gap-14 px-5 py-16 md:grid-cols-2 md:gap-24 md:px-10 md:py-24">
                {/* Columna fija: la descripción del servicio */}
                <div className="self-start md:sticky md:top-36">
                  <p className="font-mono text-xs tracking-[0.3em] text-[#131834]/50 uppercase">
                    {sector.title}
                  </p>
                  <p className="mt-7 text-[2.55rem] leading-[1.04] font-bold tracking-[-0.03em] text-[#131834] md:text-[4.15rem]">
                    {item.tagline.split(/(?<=[.;,])\s+/).map((part, pi) => (
                      <span key={pi} className={pi > 0 ? "block md:ml-[14%]" : "block"}>
                        {part}
                      </span>
                    ))}
                  </p>
                  <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#131834]/70 md:text-[1.3rem] md:leading-[1.55]">
                    {sector.copy}
                  </p>
                  <div className="mt-10">
                    <Link
                      href={`/solicitar-servicio?sector=${slug}`}
                      className="inline-flex min-h-[64px] items-center gap-3 rounded-full bg-[#e8b13a] px-9 text-lg font-semibold text-[#131834] transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      {item.cta ?? dict.serviceDetail.cta}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </div>
                {/* Características: bloques altos que suben con el scroll y le
                    dan a la columna fija su recorrido, como en el mockup */}
                <ul>
                  {(item.features ?? []).map((f, i) => (
                    <li
                      key={f.icon}
                      className="flex flex-col justify-center gap-6 py-12 md:min-h-[480px] md:py-0"
                    >
                      <div className="flex items-center gap-5">
                        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#131834] text-[#e8b13a]">
                          <FeatureIcon icon={f.icon} />
                        </span>
                        <h3 className="text-[1.65rem] font-medium tracking-[-0.01em] text-[#131834] md:text-[2rem]">
                          {item.includes[i]}
                          <span aria-hidden="true" className="ml-2 text-[#131834]/35">↗</span>
                        </h3>
                      </div>
                      <p className="max-w-md text-lg leading-relaxed text-[#131834]/65 md:pl-[84px] md:text-xl">
                        {f.text}
                      </p>
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
      <ServiceFooter />
    </>
  );
}
