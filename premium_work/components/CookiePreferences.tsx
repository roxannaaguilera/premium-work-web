"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createPreference, parsePreference, STORAGE_KEY, type PreferenceChoice } from "@/lib/cookie-preferences";

export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("pw:cookie-settings"))}>Configurar cookies</button>;
}

export function CookiePreferences() {
  const pathname = usePathname();
  // Include the notice in the initial HTML instead of waiting for hydration.
  const [banner, setBanner] = useState(true);
  const showBanner = pathname === "/" && banner;
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  function openSettings() {
    trigger.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
  }
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const saved = parsePreference(raw);
        if (raw && !saved) localStorage.removeItem(STORAGE_KEY);
        // Restoring a previous choice must not dismiss a notice already shown.
        // Only an explicit action in this view closes it.
      } catch { /* The notice remains usable when storage is unavailable. */ }
    };
    read();
    const onStorage = (event: StorageEvent) => { if (event.key === STORAGE_KEY || event.key === null) read(); };
    const onOpen = () => openSettings();
    window.addEventListener("storage", onStorage);
    window.addEventListener("pw:cookie-settings", onOpen);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener("pw:cookie-settings", onOpen); };
  }, []);
  function save(choice: PreferenceChoice) {
    try {
      if (remember) localStorage.setItem(STORAGE_KEY, JSON.stringify(createPreference(choice)));
      else localStorage.removeItem(STORAGE_KEY);
      setStatus(remember ? "Preferencia guardada durante 180 días. Solo se utiliza almacenamiento necesario." : "Preferencia aplicada sin guardarla para futuras visitas.");
    } catch { setStatus("Preferencia aplicada. Tu navegador no permite guardarla para futuras visitas."); }
    setBanner(false); dialog.current?.close();
  }
  const action = "rounded-full border border-[#131313] bg-[#131313] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6e7a10]";
  return <>
    {showBanner && <section aria-label="Aviso de cookies y almacenamiento" className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-h-[75svh] max-w-5xl overflow-y-auto rounded-2xl border border-[#e5e7eb] bg-white p-5 text-[#131313] shadow-2xl md:p-7">
      <h2 className="display text-2xl">Tu privacidad, tu elección.</h2>
      <p className="mt-3 text-sm leading-6">Premium Work solo utiliza almacenamiento necesario para recordar tu elección durante 180 días. No hay cookies de analítica ni publicidad instaladas. Aceptar o rechazar mantiene únicamente lo necesario y no autoriza usos futuros.</p>
      <div className="mt-3 flex flex-wrap gap-4 text-sm underline"><a href="/politica-de-cookies">Política de cookies</a><a href="/politica-de-privacidad">Privacidad</a></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3"><button type="button" className={action} onClick={() => save("accept")}>Aceptar</button><button type="button" className={action} onClick={() => save("reject")}>Rechazar</button><button type="button" className={action} onClick={openSettings}>Configurar</button></div>
    </section>}
    {!showBanner && <button type="button" onClick={openSettings} className="fixed bottom-3 left-3 z-[60] rounded-full border border-[#e5e7eb] bg-[#131313] px-4 py-2 text-xs text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6e7a10]">Preferencias de cookies</button>}
    <dialog ref={dialog} aria-labelledby="cookie-dialog-title" onClose={() => trigger.current?.focus()} className="m-auto max-h-[90svh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl bg-white p-6 text-[#131313] shadow-2xl backdrop:bg-[#061529]/70">
      <h2 id="cookie-dialog-title" className="display text-3xl">Preferencias de cookies</h2>
      <p className="mt-4 text-sm leading-6">En esta versión solo hay almacenamiento técnico. No activamos analítica, publicidad ni contenido incrustado de redes sociales.</p>
      <dl className="mt-5 space-y-4 text-sm"><div><dt className="font-bold">Necesarias · siempre disponibles</dt><dd>Funcionamiento del sitio y recuerdo de la elección solicitada. No se usan para seguimiento.</dd></div><div><dt className="font-bold">Analítica y publicidad · no se utilizan</dt><dd>No existen servicios opcionales que activar. Si se incorporan, se informará de sus proveedores y finalidades antes de solicitar una nueva elección.</dd></div></dl>
      <label className="mt-6 flex items-start gap-3 text-sm"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="mt-1 accent-[#131313]" />Guardar mi elección en este navegador durante 180 días. El aviso se muestra al abrir o recargar la página de inicio para que puedas confirmarla o cambiarla.</label>
      <div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" className={action} onClick={() => save("accept")}>Aceptar</button><button type="button" className={action} onClick={() => save("reject")}>Rechazar</button></div>
      <button type="button" className={`${action} mt-3 w-full`} onClick={() => save("custom")}>Guardar preferencias</button>
      <div className="mt-5 flex flex-wrap justify-between gap-4 text-sm underline"><a href="/politica-de-cookies">Leer la política</a><button type="button" onClick={() => dialog.current?.close()}>Volver sin guardar</button></div>
    </dialog>
    <p role="status" className="sr-only">{status}</p>
  </>;
}
