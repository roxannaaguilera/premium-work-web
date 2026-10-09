import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

export function setLenis(instance: Lenis | null): void {
  lenis = instance;
  if (typeof window !== "undefined") {
    (window as unknown as { __lenis?: Lenis | null }).__lenis = instance;
  }
}
