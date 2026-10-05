"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type RoomFrameProps = {
  /** Número romano de la estancia, p. ej. "III" */
  numeral: string;
  /** Nombre elegante de la estancia, p. ej. "La Sala de Servicios" */
  name: string;
  /** Frase breve que presenta la estancia */
  tagline: string;
  /** Imagen de cabecera de la estancia */
  image: string;
  imageAlt: string;
  children: ReactNode;
};

/**
 * Enmarca una sección de la home como una estancia del edificio:
 * cabecera fotográfica con parallax suave al hacer scroll y placa
 * con el nombre de la sala; el contenido original va debajo intacto.
 */
export function RoomFrame({ numeral, name, tagline, image, imageAlt, children }: RoomFrameProps) {
  const reducedMotion = useReducedMotion();
  const bannerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: bannerRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <div>
      <section
        ref={bannerRef}
        aria-label={name}
        className="relative flex h-[44vh] min-h-[320px] items-end overflow-hidden bg-[#0a1428] text-white md:h-[54vh]"
      >
        <motion.img
          src={image}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={reducedMotion ? undefined : { scale, y }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0a1428] via-[#0a1428]/55 to-[#0a1428]/10"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1100px] px-5 pb-10 md:px-8 md:pb-14">
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow flex items-center gap-2 text-[#9db8ff]">
              <span aria-hidden="true" className="text-[#eab308]">◆</span> Estancia {numeral}
            </p>
            <h2 className="display mt-3 text-[clamp(2rem,6vw,3.6rem)]">{name}</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/75">{tagline}</p>
          </motion.div>
        </div>
      </section>
      {children}
    </div>
  );
}
