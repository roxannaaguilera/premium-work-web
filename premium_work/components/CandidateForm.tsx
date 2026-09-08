"use client";

import { useState, type FormEvent } from "react";

const field = "mt-2 w-full border-b border-white/35 bg-transparent py-3 font-normal outline-none focus:border-[#C9A227]";
export function CandidateForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const cv = data.get("cv");
    if (!(cv instanceof File) || cv.size > 5 * 1024 * 1024) { setStatus("Adjunta un PDF de hasta 5 MB."); return; }
    setBusy(true); setStatus(""); setSuccess(false);
    try {
      const response = await fetch("/api/candidatos", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se ha podido guardar. Inténtalo de nuevo.");
      setSuccess(true);
      setStatus("Hemos recibido tus datos y tu currículum. Gracias por presentar tu candidatura.");
      form.reset();
    } catch (error) { setStatus(error instanceof Error ? error.message : "No se ha podido conectar. Inténtalo de nuevo."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="integrated-form" aria-busy={busy}>
    <fieldset disabled={busy} className="grid gap-6 sm:grid-cols-2">
      <label className="text-sm font-bold">Nombre y apellidos<input required maxLength={200} autoComplete="name" name="name" className={field} /></label>
      <label className="text-sm font-bold">Email<input required maxLength={200} type="email" autoComplete="email" name="email" className={field} /></label>
      <label className="text-sm font-bold">Teléfono<input required maxLength={200} type="tel" autoComplete="tel" name="phone" className={field} /></label>
      <label className="text-sm font-bold">Ciudad<input required maxLength={200} autoComplete="address-level2" name="city" className={field} /></label>
      <label className="text-sm font-bold">Años de experiencia<input required type="number" min="0" max="80" step="0.5" name="years" className={field} /></label>
      <label className="text-sm font-bold">Sector en el que trabajas<select required name="sector" defaultValue="" className={field}><option value="">Selecciona un sector</option>{["Hoteles", "Restaurantes", "Catering", "Eventos", "Limpieza y housekeeping", "Otro", "Sin experiencia previa"].map((sector) => <option key={sector}>{sector}</option>)}</select></label>
      <label className="text-sm font-bold sm:col-span-2">Empresas en las que has trabajado<textarea required maxLength={3000} name="companies" rows={2} placeholder="Una empresa por línea. Si es tu primer empleo, indica «Sin experiencia»." className={field} /></label>
      <label className="text-sm font-bold sm:col-span-2">Puesto de interés, experiencia y disponibilidad<textarea required maxLength={3000} name="availability" rows={4} className={field} /></label>
      <label className="text-sm font-bold sm:col-span-2">Adjunta tu currículum<input required type="file" accept=".pdf,application/pdf" name="cv" className="mt-3 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[#C9A227] file:px-4 file:py-2 file:text-[#0B1F3A]" /><span className="mt-2 block text-xs font-normal text-white/80">Formato PDF. Máximo 5 MB.</span></label>
      <label className="flex gap-3 text-sm leading-5 sm:col-span-2"><input required type="checkbox" name="consent" className="mt-1 accent-[#C9A227]" />Autorizo a Premium Work a guardar mis datos y mi CV para gestionar mi candidatura y contactar conmigo por oportunidades laborales.</label>
      <button type="submit" className="rounded-full bg-[#C9A227] px-6 py-4 text-sm font-bold text-[#0B1F3A] transition hover:bg-[#e2be3d] disabled:opacity-60 sm:col-span-2">{busy ? "GUARDANDO CANDIDATURA…" : "ENVIAR CANDIDATURA"}</button>
    </fieldset>
    <p role={success ? "status" : "alert"} className="mt-4 text-sm text-white">{status}</p>
  </form>;
}
