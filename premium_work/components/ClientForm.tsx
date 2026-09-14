"use client";

import { CityField } from "@/components/CityField";
import { FormConsent } from "@/components/FormConsent";
import { PhoneField, usePhoneValue } from "@/components/PhoneField";
import { useFormValidation } from "@/components/useFormValidation";
import { useState, type FormEvent } from "react";
import { sectorLabels, serviceLabels } from "@/lib/service-options";

const field = "mt-2 w-full border-b border-white/35 bg-transparent py-3 font-normal outline-none focus:border-[#C9A227]";
export function ClientForm({ sector = "", service = "" }: { sector?: string; service?: string }) {
  const phone = usePhoneValue();
  const validation = useFormValidation("client");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (busy) return;
    setSuccess(false); setStatus("");
    if (!validation.validate(form)) { setStatus("Revisa los campos señalados antes de enviar."); return; }
    const data = Object.fromEntries(new FormData(form));
    setBusy(true); setSuccess(false); setStatus("");
    try {
      const response = await fetch("/api/clientes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (result.errors) validation.setErrors(result.errors);
      if (!response.ok) throw new Error(result.error || "No se ha podido guardar tu solicitud.");
      setSuccess(true); setStatus("Hemos recibido tu solicitud. Nos pondremos en contacto contigo para preparar tu propuesta.");
      form.reset();
      phone.clear();
      validation.setErrors({});
    } catch (error) { setStatus(error instanceof Error ? error.message : "No se ha podido conectar. Inténtalo de nuevo."); }
    finally { setBusy(false); }
  }
  return <form noValidate onBlur={validation.onBlur} onChange={validation.onChange} onSubmit={submit} className="integrated-form" aria-busy={busy}>
    <p className="mb-6 text-sm text-white/80">* Campos obligatorios.</p>
    <fieldset disabled={busy} className="grid gap-6 sm:grid-cols-2">
      <label className="text-sm font-bold">Nombre y apellidos *<input required name="name" {...validation.props("name")} autoComplete="name" maxLength={200} className={field} />{validation.error("name")}</label>
      <label className="text-sm font-bold">Empresa *<input required name="company" {...validation.props("company")} autoComplete="organization" maxLength={200} className={field} />{validation.error("company")}</label>
      <label className="text-sm font-bold">Email *<input required type="email" name="email" {...validation.props("email")} autoComplete="email" maxLength={200} className={field} />{validation.error("email")}</label>
      <PhoneField value={phone} disabled={busy} field={field} validation={validation.props("phone")} error={validation.error("phone")} />
      <label className="text-sm font-bold">Sector *<select required name="sector" {...validation.props("sector")} defaultValue={sector} className={field}><option value="">Selecciona un sector</option>{Object.entries(sectorLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{validation.error("sector")}</label>
      <label className="text-sm font-bold">Servicio *<select required name="service" {...validation.props("service")} defaultValue={service} className={field}><option value="">Selecciona un servicio</option>{Object.entries(serviceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{validation.error("service")}</label>
      <CityField label="Ciudad del servicio" field={field} validation={validation.props("city")} error={validation.error("city")} />
      <label className="text-sm font-bold">Fecha del evento (opcional)<input type="date" name="event_date" {...validation.props("event_date")} className={field} />{validation.error("event_date")}</label>
      <label className="text-sm font-bold">Profesionales necesarios (opcional)<input type="number" min="1" max="10000" step="1" name="staff_count" {...validation.props("staff_count")} className={field} />{validation.error("staff_count")}</label>
      <label className="text-sm font-bold">Presupuesto estimado en € (opcional)<input type="number" min="0" max="100000000" step="0.01" name="budget" {...validation.props("budget")} className={field} />{validation.error("budget")}</label>
      <label className="text-sm font-bold sm:col-span-2">¿En qué podemos ayudarte? *<textarea required name="message" {...validation.props("message")} rows={5} maxLength={5000} className={field} />{validation.error("message")}</label>
      <FormConsent validation={validation} />
      <button type="submit" className="rounded-full bg-[#C9A227] px-6 py-4 text-sm font-bold text-[#0B1F3A] transition hover:bg-[#e2be3d] disabled:opacity-60 sm:col-span-2">{busy ? "GUARDANDO SOLICITUD…" : "ENVIAR SOLICITUD"}</button>
    </fieldset>
    <p role={success ? "status" : "alert"} className="mt-4 text-sm text-white">{status}</p>
  </form>;
}
