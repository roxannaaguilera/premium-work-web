/** Se dispara en el instante en que las cortinas empiezan a abrirse. */
export const CURTAINS_OPENING = "pw-curtains-open";

export function signalCurtainsOpening() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CURTAINS_OPENING));
}

/** El preloader sigue en pantalla: su apertura es la que debe disparar la caída. */
export function preloaderCurtainIsUp() {
  return typeof document !== "undefined" && !!document.querySelector("[data-pl-curtain]");
}
