"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import FixedHeader from "@/components/chrome/FixedHeader";
import Preloader from "@/components/chrome/Preloader";
import ElementsCarousel from "@/components/three/ElementsCarousel";
import { getLenis } from "@/lib/lenis-instance";
import { SmoothScroll } from "./SmoothScroll";
import { StageProvider, type StagePose } from "./stageContext";
import { StripedCurtain, type CurtainHandle } from "./StripedCurtain";

/**
 * Una sola cáscara para el inicio y los servicios: el lienzo WebGL, el
 * logo, el menú y el telón rayado no se desmontan al cambiar de ruta.
 * El telón tapa la pantalla, se cambia el HTML y, al abrirse, los objetos
 * caen. No hay un segundo telón desde abajo.
 */
export default function StageShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtainRef = useRef<CurtainHandle>(null);
  const pending = useRef<string | null>(null);
  const navRef = useRef<HTMLAnchorElement>(null);
  const [pose, setPose] = useState<StagePose>("home");

  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem("pw-booted") === "1") curtainRef.current?.open();
    } catch {
      /* sin almacenamiento: abre el preloader */
    }
  }, []);

  useEffect(() => {
    if (!pending.current || pathname !== pending.current) return;
    pending.current = null;
    curtainRef.current?.open();
  }, [pathname]);

  const commitNav = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = pending.current;
    if (!href) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    router.push(href);
  };

  const go = useCallback(
    (href: string) => {
      if (pending.current || href === pathname) return;
      pending.current = href;
      setPose(href.startsWith("/servicios/") ? "service" : "home");
      const closed = curtainRef.current?.close() ?? Promise.resolve();
      closed.then(() => navRef.current?.click());
    },
    [pathname]
  );

  return (
    <StageProvider value={{ go, pose }}>
      <SmoothScroll />
      <div className="fixed inset-0 z-0 bg-[#fdf3eb]" data-stage-canvas>
        <ElementsCarousel />
      </div>
      <FixedHeader />
      <div className="pointer-events-none relative z-10">{children}</div>
      <StripedCurtain ref={curtainRef} />
      <Preloader onDone={() => curtainRef.current?.open()} />
      <a ref={navRef} href="#cambio" onClick={commitNav} className="hidden" aria-hidden="true" tabIndex={-1} />
    </StageProvider>
  );
}
