"use client";

import { motion } from "framer-motion";
import ElementsCarousel from "@/components/three/ElementsCarousel";
import CurtainIntro from "./CurtainIntro";

/**
 * Hero: carrusel 360° con los 8 elementos reales de Premium Work.
 * Cortinas de presentación de arriba hacia abajo; los elementos
 * aparecen detrás. Arrastra o desplaza para girar entre sectores.
 */
export default function AgrumeaHero() {
  return (
    <section
      id="inicio"
      aria-label="Premium Work — inicio"
      className="relative h-screen overflow-hidden bg-[#fdf3eb]"
    >
      <h1 className="sr-only">
        Premium Work — Profesionales de hospitality para eventos en Madrid
      </h1>

      {/* Cortinas de presentación */}
      <CurtainIntro />

      {/* Carrusel 3D de los 8 sectores: aparece tras las cortinas */}
      <motion.div
        className="h-full"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.9, ease: "easeOut" }}
      >
        <ElementsCarousel />
      </motion.div>

      {/* Privacidad y cookies */}
      <a
        href="/privacidad"
        className="absolute bottom-6 left-6 z-[2] text-xs text-[#131834]/70 underline underline-offset-4 hover:text-[#131834]"
      >
        Privacidad y Cookies
      </a>
    </section>
  );
}
