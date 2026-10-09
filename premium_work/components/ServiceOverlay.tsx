"use client";

import { useCallback, useEffect, useState } from "react";
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
 * Overlay SPA para el detalle de servicio: se abre sin recarga cuando el
 * usuario clica un objeto del héroe. El objeto (clon) vuela dentro del mismo
 * documento, sin flash de cambio de página.
 *
 * La ruta /servicios/[slug] sigue existiendo para visitas directas y SEO.
 */
export default function ServiceOverlay() {
  const [flight, setFlight] = useState<Flight | null>(null);

  const close = useCallback(() => {
    setFlight(null);
    // Restaurar la URL de la home sin recargar.
    if (window.location.pathname !== "/") {
      window.history.pushState({}, "", "/");
    }
    // Desbloquear scroll y reanudar Lenis.
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    getLenis()?.start();
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const f = (e as CustomEvent<Flight>).detail;
      if (!f || !f.slug) return;
      setFlight(f);
      window.history.pushState({ pwService: f.slug }, "", `/servicios/${f.slug}`);
      // Bloquear scroll del fondo mientras el overlay está abierto:
      // detener Lenis y ocultar el overflow del body y html.
      getLenis()?.stop();
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    };
    const onPop = () => {
      // Botón atrás del navegador: cerrar el overlay.
      setFlight(null);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      getLenis()?.start();
    };
    window.addEventListener("pw-open-service", onOpen);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("pw-open-service", onOpen);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

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
      className="fixed inset-0 z-[200] overflow-y-auto bg-[#fdf3eb]"
      role="dialog"
      aria-modal="true"
      aria-label={flight.slug}
    >
      <ServiceDetail slug={flight.slug} initialFlight={flight} onClose={close} />
    </div>
  );
}
