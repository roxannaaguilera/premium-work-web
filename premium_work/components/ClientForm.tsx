"use client";

import { useState, type FormEvent } from "react";
import { sectorLabels, serviceLabels } from "@/lib/service-options";

const field = "mt-2 w-full border-b border-white/35 bg-transparent py-3 font-normal outline-none focus:border-[#C9A227]";
export function ClientForm({ sector = "", service = "" }: { sector?: string; service?: string }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setBusy(true); setSuccess(false); setStatus("");
    try {
      const response = await fetch("/api/clientes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se ha podido guardar tu solicitud.");
      setSuccess(true); setStatus("Hemos recibido tu solicitud. Nos pondremos en contacto contigo para preparar tu propuesta.");
      form.reset();
    } catch (error) { setStatus(error instanceof Error ? error.message : "No se ha podido conectar. Inténtalo de nuevo."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="integrated-form" aria-busy={busy}>
    <fieldset disabled={busy} className="grid gap-6 sm:grid-cols-2">
      <label className="text-sm font-bold">Nombre y apellidos<input required name="name" autoComplete="name" maxLength={200} className={field} /></label>
      <label className="text-sm font-bold">Empresa<input required name="company" autoComplete="organization" maxLength={200} className={field} /></label>
      <label className="text-sm font-bold">Email<input required type="email" name="email" autoComplete="email" maxLength={200} className={field} /></label>
      <label className="text-sm font-bold">Teléfono<input type="tel" name="phone" autoComplete="tel" maxLength={100} className={field} /></label>
      <label className="text-sm font-bold">Sector<select required name="sector" defaultValue={sector} className={field}><option value="">Selecciona un sector</option>{Object.entries(sectorLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="text-sm font-bold">Servicio<select required name="service" defaultValue={service} className={field}><option value="">Selecciona un servicio</option>{Object.entries(serviceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="text-sm font-bold">Ciudad del servicio<input required name="city" maxLength={200} className={field} /></label>
      <label className="text-sm font-bold">Fecha del evento (opcional)<input type="date" name="event_date" className={field} /></label>
      <label className="text-sm font-bold">Profesionales necesarios (opcional)<input type="number" min="1" max="10000" step="1" name="staff_count" className={field} /></label>
      <label className="text-sm font-bold">Presupuesto estimado en € (opcional)<input type="number" min="0" max="100000000" step="0.01" name="budget" className={field} /></label>
      <label className="text-sm font-bold sm:col-span-2">¿En qué podemos ayudarte?<textarea required name="message" rows={5} maxLength={5000} className={field} /></label>
      <label className="flex gap-3 text-sm leading-5 text-white/80 sm:col-span-2"><input required type="checkbox" name="consent" className="mt-1 accent-[#C9A227]" />Autorizo a Premium Work a guardar mis datos para atender esta solicitud y contactar conmigo.</label>
      <button type="submit" className="rounded-full bg-[#C9A227] px-6 py-4 text-sm font-bold text-[#0B1F3A] transition hover:bg-[#e2be3d] disabled:opacity-60 sm:col-span-2">{busy ? "GUARDANDO SOLICITUD…" : "ENVIAR SOLICITUD"}</button>
    </fieldset>
    <p role={success ? "status" : "alert"} className="mt-4 text-sm text-white">{status}</p>
  </form>;
}
