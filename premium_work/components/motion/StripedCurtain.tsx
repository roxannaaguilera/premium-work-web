"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { signalCurtainsOpening } from "./curtainSignal";

const OPEN = 0.62;
const CLOSE = 0.38;
const STRIPES =
  "repeating-linear-gradient(90deg, #131834 0px, #131834 22px, #1b2148 22px, #1b2148 44px)";

function easeInOut(u: number) {
  const t = Math.min(1, Math.max(0, u));
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export type CurtainHandle = {
  open: () => void;
  close: () => Promise<void>;
};

/**
 * El único telón rayado del sitio. Empieza cerrado. Se abre hacia los
 * lados (misma familia que el preloader) y, al volver a cerrarse, tapa
 * el cambio de ruta. No sube desde abajo.
 */
export const StripedCurtain = forwardRef<CurtainHandle>(function StripedCurtain(_, ref) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panels = useRef<Array<HTMLDivElement | null>>([null, null]);
  const x = useRef(0);
  const raf = useRef(0);
  const mode = useRef<"idle" | "open" | "close">("idle");
  const resolveClose = useRef<(() => void) | null>(null);

  const apply = (u: number) => {
    const next = Math.min(1, Math.max(0, u));
    x.current = next;
    const left = panels.current[0];
    const right = panels.current[1];
    if (left) left.style.transform = `translateX(${-102 * next}%)`;
    if (right) right.style.transform = `translateX(${102 * next}%)`;
    const root = rootRef.current;
    if (root) root.style.visibility = next > 0.995 ? "hidden" : "visible";
  };

  useImperativeHandle(ref, () => ({
    open() {
      if (mode.current === "open") return;
      mode.current = "open";
      cancelAnimationFrame(raf.current);
      if (resolveClose.current) {
        const pending = resolveClose.current;
        resolveClose.current = null;
        pending();
      }
      let signaled = false;
      let last = performance.now();
      const from = x.current;
      let elapsed = 0;
      const tick = (now: number) => {
        const dt = Math.min(0.032, (now - last) / 1000);
        last = now;
        elapsed += dt;
        if (!signaled) {
          signaled = true;
          signalCurtainsOpening();
        }
        const u = easeInOut(Math.min(1, elapsed / OPEN));
        apply(from + (1 - from) * u);
        if (elapsed < OPEN) raf.current = requestAnimationFrame(tick);
        else {
          apply(1);
          mode.current = "idle";
        }
      };
      raf.current = requestAnimationFrame(tick);
    },
    close() {
      return new Promise((resolve) => {
        if (x.current <= 0.001) {
          apply(0);
          resolve();
          return;
        }
        mode.current = "close";
        if (resolveClose.current) resolveClose.current();
        resolveClose.current = resolve;
        cancelAnimationFrame(raf.current);
        const root = rootRef.current;
        if (root) root.style.visibility = "visible";
        let last = performance.now();
        const from = x.current;
        let elapsed = 0;
        const tick = (now: number) => {
          const dt = Math.min(0.032, (now - last) / 1000);
          last = now;
          elapsed += dt;
          const u = easeInOut(Math.min(1, elapsed / CLOSE));
          apply(from * (1 - u));
          if (elapsed < CLOSE) raf.current = requestAnimationFrame(tick);
          else {
            apply(0);
            mode.current = "idle";
            const done = resolveClose.current;
            resolveClose.current = null;
            done?.();
          }
        };
        raf.current = requestAnimationFrame(tick);
      });
    },
  }));

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[90]"
      aria-hidden="true"
      data-shell-curtain
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          ref={(el) => {
            panels.current[i] = el;
          }}
          className={`absolute top-0 bottom-0 w-1/2 ${i === 0 ? "left-0" : "right-0"}`}
          style={{ background: STRIPES, transform: "translateX(0%)" }}
        >
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#eab308]" />
        </div>
      ))}
    </div>
  );
});
