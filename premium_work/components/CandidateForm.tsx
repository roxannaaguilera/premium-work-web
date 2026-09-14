"use client";

import { candidateSectors } from "@/lib/form-validation";
import { FormConsent } from "@/components/FormConsent";
import { resolveCity } from "@/lib/contact-options";
import { CityField } from "@/components/CityField";
import { PhoneField, usePhoneValue } from "@/components/PhoneField";
import { useFormValidation } from "@/components/useFormValidation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

const field = "mt-2 w-full border-b border-white/35 bg-transparent py-3 font-normal outline-none focus:border-[#C9A227]";
export function CandidateForm() {
  const phone = usePhoneValue();
  const validation = useFormValidation("candidate");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  const [reading, setReading] = useState(false);
  const [cvStatus, setCvStatus] = useState("");
  const imported = useRef<Record<string, string>>({});
  async function loadCv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    const form = event.currentTarget.form;
    if (!file || !form) return;
    setReading(true); setCvStatus("Leyendo tu CV…"); setStatus(""); setSuccess(false);
    validation.setErrors(previous => ({ ...previous, cv: "" }));
    const canImportPhone = !phone.number.trim() || imported.current.phone === phone.fingerprint;
    if (canImportPhone) phone.clear();
    // Remove suggestions from the previous CV, preserving manually edited values.
    for (const [key, previous] of Object.entries(imported.current)) {
      if (key === "phone") continue;
      const control = form.elements.namedItem(key);
      if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement) {
        if (control.value === previous) control.value = "";
      }
    }
    imported.current = {};
    try {
      const { readCv } = await import("@/lib/read-cv");
      const fields = await readCv(file);
      let count = 0;
      for (const [key, value] of Object.entries(fields)) {
        if (key === "phone") {
          if (canImportPhone) { imported.current.phone = phone.importValue(value); validation.setErrors(previous => ({ ...previous, phone: "" })); count++; }
          continue;
        }
        const control = form.elements.namedItem(key);
        if ((control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement) && !control.value.trim()) {
          const suggestion = key === "city" ? resolveCity(value) : value;
          if (!suggestion) continue;
          control.value = suggestion;
          imported.current[key] = suggestion;
          validation.setErrors(previous => ({ ...previous, [key]: "" }));
          count++;
        }
      }
      setCvStatus(count ? `Hemos completado ${count} campos con tu CV. Revisa los datos y completa los que falten.` : "No hemos encontrado datos para completar. Si tu PDF está escaneado, rellena los campos manualmente. Tu CV sigue adjunto.");
    } catch (error) {
      if (error instanceof Error && /Selecciona|no es un PDF válido/.test(error.message)) validation.setErrors(previous => ({ ...previous, cv: error.message }));
      setCvStatus(error instanceof Error && /Selecciona|válido|automática|tardando/.test(error.message) ? error.message : "No hemos podido leer este PDF. Puede estar protegido o dañado. Puedes completar los datos manualmente o elegir otro CV.");
    } finally { setReading(false); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (busy || reading) return;
    setSuccess(false); setStatus("");
    if (!validation.validate(form)) { setStatus("Revisa los campos señalados antes de enviar."); return; }
    const data = new FormData(form);
    const cv = data.get("cv");
    if (!(cv instanceof File) || cv.size > 5 * 1024 * 1024) { setStatus("Adjunta un PDF de hasta 5 MB."); return; }
    setBusy(true); setStatus(""); setSuccess(false);
    try {
      if (new TextDecoder().decode(await cv.slice(0, 5).arrayBuffer()) !== "%PDF-") {
        validation.setErrors({ cv: "El archivo no es un PDF válido." });
        throw new Error("Adjunta un archivo PDF válido.");
      }
      const response = await fetch("/api/candidatos", { method: "POST", body: data });
      const result = await response.json();
      if (result.errors) validation.setErrors(result.errors);
      if (!response.ok) throw new Error(result.error || "No se ha podido guardar. Inténtalo de nuevo.");
      setSuccess(true);
      setStatus("Hemos recibido tus datos y tu currículum. Gracias por presentar tu candidatura.");
      form.reset();
      phone.clear();
      setCvStatus(""); imported.current = {};
      validation.setErrors({});
    } catch (error) { setStatus(error instanceof Error ? error.message : "No se ha podido conectar. Inténtalo de nuevo."); }
    finally { setBusy(false); }
  }
  return <form noValidate onBlur={validation.onBlur} onChange={validation.onChange} onSubmit={submit} className="integrated-form" aria-busy={busy || reading}>
    <p className="mb-6 text-sm text-white/80">* Campos obligatorios.</p>
    <fieldset disabled={busy || reading} className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-2xl border border-[#C9A227]/60 bg-white/5 p-5 sm:col-span-2">
        <label className="block text-base font-bold">1. Carga tu CV para completar tus datos *
          <input required type="file" accept=".pdf,application/pdf" name="cv" onChange={loadCv} {...validation.props("cv")} className="mt-4 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[#C9A227] file:px-4 file:py-3 file:text-[#0B1F3A]" />
          <span className="mt-3 block text-sm font-normal text-white/80">PDF de hasta 5 MB. La lectura se realiza en tu dispositivo; el CV se envía al presentar tu candidatura.</span>
          {validation.error("cv")}
        </label>
        <p role="status" aria-live="polite" className="mt-3 text-sm text-[#f1d986]">{cvStatus}</p>
      </div>
      <p className="text-base font-bold sm:col-span-2">2. Revisa y completa tus datos</p>
      <label className="text-sm font-bold">Nombre y apellidos *<input required maxLength={200} autoComplete="name" name="name" {...validation.props("name")} className={field} />{validation.error("name")}</label>
      <label className="text-sm font-bold">Email *<input required maxLength={200} type="email" autoComplete="email" name="email" {...validation.props("email")} className={field} />{validation.error("email")}</label>
      <PhoneField value={phone} required disabled={busy || reading} field={field} validation={validation.props("phone")} error={validation.error("phone")} />
      <CityField label="Ciudad" field={field} validation={validation.props("city")} error={validation.error("city")} />
      <label className="text-sm font-bold">Indica cuántos años tienes de experiencia *<input required type="text" inputMode="decimal" maxLength={5} name="years" {...validation.props("years")} className={field} />{validation.error("years")}</label>
      <label className="text-sm font-bold">Sector en el que trabajas *<select required name="sector" {...validation.props("sector")} defaultValue="" className={field}><option value="">Selecciona un sector</option>{candidateSectors.map((sector) => <option key={sector}>{sector}</option>)}</select>{validation.error("sector")}</label>
      <label className="text-sm font-bold sm:col-span-2">Empresas en las que has trabajado *<textarea required maxLength={3000} name="companies" {...validation.props("companies")} rows={2} placeholder="Una empresa por línea. Si es tu primer empleo, indica «Sin experiencia»." className={field} />{validation.error("companies")}</label>
      <label className="text-sm font-bold sm:col-span-2">Puesto de interés, experiencia y disponibilidad *<textarea required maxLength={3000} name="availability" {...validation.props("availability")} rows={4} className={field} />{validation.error("availability")}</label>
      <FormConsent candidate validation={validation} />
      <button type="submit" className="rounded-full bg-[#C9A227] px-6 py-4 text-sm font-bold text-[#0B1F3A] transition hover:bg-[#e2be3d] disabled:opacity-60 sm:col-span-2">{reading ? "LEYENDO CV…" : busy ? "GUARDANDO CANDIDATURA…" : "ENVIAR CANDIDATURA"}</button>
    </fieldset>
    <p role={success ? "status" : "alert"} className="mt-4 text-sm text-white">{status}</p>
  </form>;
}
