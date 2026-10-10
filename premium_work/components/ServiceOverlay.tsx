"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ServiceDetail from "@/components/ServiceDetail";
import { getLenis } from "@/lib/lenis-instance";

type Flight = {
  src: string;
  slug: string;
  fromY: number;
  fromH: number;
  rotate: number;
};

/**
 * Overlay SPA para el detalle de servicio. La home (y su canvas) no se
 * desmonta: pushState cambia la URL y el mesh que ya estaba en pantalla
 * se mueve hasta la pose del detalle.
 *
 * La ruta /servicios/[slug] sigue existiendo para visitas directas y SEO.
 */
export default function ServiceOverlay() {
  const [flight, setFlight] = useState<Flight | null>(null);
  const closingRef = useRef(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const finishClose = useCallback(() => {
    closingRef.current = false;
    setFlight(null);
    if (window.location.pathname !== "/") {
      window.history.pushState({}, "", "/");
    }
  }, []);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    // El carrusel anima el mesh de vuelta y avisa con pw-detail-home.
    window.dispatchEvent(new Event("pw-close-service"));
    window.setTimeout(() => {
      if (closingRef.current) finishClose();
    }, 900);
  }, [finishClose]);

  // Bloquear/desbloquear scroll ligado al estado del overlay.
  useEffect(() => {
    if (!flight) return;
    try {
      getLenis()?.stop();
    } catch {
      /* Lenis no disponible */
    }
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      try {
        getLenis()?.start();
      } catch {
        /* Lenis no disponible */
      }
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [flight]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const f = (e as CustomEvent<Flight>).detail;
      if (!f || !f.slug) return;
      setFlight(f);
      window.history.pushState({ pwService: f.slug }, "", `/servicios/${f.slug}`);
    };
    const onPop = () => {
      if (closingRef.current) return;
      closingRef.current = true;
      window.dispatchEvent(new Event("pw-close-service"));
      window.setTimeout(() => {
        if (closingRef.current) finishClose();
      }, 900);
    };
    const onHome = () => {
      if (!closingRef.current) return;
      finishClose();
    };
    window.addEventListener("pw-open-service", onOpen);
    window.addEventListener("popstate", onPop);
    window.addEventListener("pw-detail-home", onHome);
    return () => {
      window.removeEventListener("pw-open-service", onOpen);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("pw-detail-home", onHome);
    };
  }, [finishClose]);

  // Tecla Escape cierra.
  useEffect(() => {
    if (!flight) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flight, close]);

  if (!flight) return null;

  return (
    <div
      ref={scrollerRef}
      className="fixed inset-0 z-[200] overflow-y-auto bg-[#131834]"
      role="dialog"
      aria-modal="true"
      aria-label={flight.slug}
    >
      <ServiceDetail
        slug={flight.slug}
        initialFlight={flight}
        onClose={close}
        scrollContainer={scrollerRef}
      />
    </div>
  );
}
