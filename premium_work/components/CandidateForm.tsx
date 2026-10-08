"use client";

import { candidateSectors } from "@/lib/service-options";
import { submitForm } from "@/lib/submit-form";
import { FormConsent } from "@/components/FormConsent";
import { resolveCity } from "@/lib/contact-options";
import { CityField } from "@/components/CityField";
import { PhoneField, usePhoneValue } from "@/components/PhoneField";
import { useFormValidation } from "@/components/useFormValidation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useLang } from "@/components/i18n/lang";

const field = "mt-2 w-full border-b border-[#131313]/30 bg-transparent py-3 font-normal outline-none focus:border-[#173aab]";
export function CandidateForm() {
  const { t, lang } = useLang();
  const phone = usePhoneValue();
  const validation = useFormValidation("candidate");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  const [reading, setReading] = useState(false);
  const [cvStatus, setCvStatus] = useState("");
  const [cvName, setCvName] = useState<string | null>(null);
  const imported = useRef<Record<string, string>>({});
  async function loadCv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    const form = event.currentTarget.form;
    if (!file || !form) return;
    setCvName(file.name);
    setReading(true); setCvStatus(t("candidateForm.reading")); setStatus(""); setSuccess(false);
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
      setCvStatus(count ? t("candidateForm.cvDone", { count }) : t("candidateForm.cvEmpty"));
    } catch (error) {
      if (error instanceof Error && /Selecciona|no es un PDF válido/.test(error.message)) validation.setErrors(previous => ({ ...previous, cv: error.message }));
      setCvStatus(error instanceof Error && /Selecciona|válido|automática|tardando/.test(error.message) ? error.message : t("candidateForm.cvError"));
    } finally { setReading(false); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (busy || reading) return;
    setSuccess(false); setStatus("");
    if (!validation.validate(form)) { setStatus(t("candidateForm.reviewFields")); return; }
    const data = new FormData(form);
    const cv = data.get("cv");
    if (!(cv instanceof File) || cv.size > 4 * 1024 * 1024) { setStatus(t("candidateForm.cvSize")); return; }
    setBusy(true); setStatus(""); setSuccess(false);
    try {
      if (new TextDecoder().decode(await cv.slice(0, 5).arrayBuffer()) !== "%PDF-") {
        validation.setErrors({ cv: t("candidateForm.cvInvalid") });
        throw new Error(t("candidateForm.cvInvalid"));
      }
      const result = await submitForm("/api/candidatos", { method: "POST", body: data });
      if (result.errors) validation.setErrors(result.errors);
      if (result.error) throw new Error(result.error);
      setSuccess(true);
      setStatus(t("candidateForm.received"));
      form.reset();
      phone.clear();
      setCvName(null);
      setCvStatus(""); imported.current = {};
      validation.setErrors({});
    } catch (error) { setStatus(error instanceof Error ? error.message : t("candidateForm.connectError")); }
    finally { setBusy(false); }
  }
  return <form noValidate onBlur={validation.onBlur} onChange={validation.onChange} onSubmit={submit} className="integrated-form" aria-busy={busy || reading}>
    <p className="mb-6 text-sm text-[#4a5264]">{t("candidateForm.requiredNote")}</p>
    <fieldset disabled={busy || reading} className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-2xl border border-[#173aab]/50 bg-[#e9eefd]/70 p-5 sm:col-span-2">
        <label className="block text-base font-bold">{t("candidateForm.uploadTitle")} *
          <input required type="file" accept=".pdf,application/pdf" name="cv" onChange={loadCv} {...validation.props("cv")} className="peer sr-only" />
          <span className="mt-4 flex w-full cursor-pointer items-center gap-3 text-sm font-normal peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#173aab]">
            <span className="shrink-0 rounded-full bg-[#131313] px-4 py-3 font-bold text-white">{t("candidateForm.selectFile")}</span>
            <span className="min-w-0 flex-1 truncate text-[#4a5264]">{cvName ?? t("candidateForm.noFile")}</span>
          </span>
          <span className="mt-3 block text-sm font-normal text-[#4a5264]">{t("candidateForm.pdfNote")}</span>
          {validation.error("cv")}
        </label>
        <p role="status" aria-live="polite" className="mt-3 text-sm text-[#173aab]">{cvStatus}</p>
      </div>
      <p className="text-base font-bold sm:col-span-2">{t("candidateForm.reviewTitle")}</p>
      <label className="text-sm font-bold">{t("candidateForm.name")} *<input required maxLength={200} autoComplete="name" name="name" {...validation.props("name")} className={field} />{validation.error("name")}</label>
      <label className="text-sm font-bold">{t("candidateForm.email")} *<input required maxLength={200} type="email" autoComplete="email" name="email" {...validation.props("email")} className={field} />{validation.error("email")}</label>
      <PhoneField value={phone} required disabled={busy || reading} field={field} validation={validation.props("phone")} error={validation.error("phone")} />
      <CityField label={t("candidateForm.city")} selectLabel={t("candidateForm.selectCity")} field={field} validation={validation.props("city")} error={validation.error("city")} />
      <label className="text-sm font-bold">{t("candidateForm.years")} *<input required type="text" inputMode="decimal" maxLength={5} name="years" {...validation.props("years")} className={field} />{validation.error("years")}</label>
      <label className="text-sm font-bold">{t("candidateForm.sector")} *<select required name="sector" {...validation.props("sector")} defaultValue="" className={field}><option value="">{t("candidateForm.selectSector")}</option>{candidateSectors(lang).map((sector) => <option key={sector}>{sector}</option>)}</select>{validation.error("sector")}</label>
      <label className="text-sm font-bold sm:col-span-2">{t("candidateForm.companies")} *<textarea required maxLength={3000} name="companies" {...validation.props("companies")} rows={2} placeholder={t("candidateForm.companiesPh")} className={field} />{validation.error("companies")}</label>
      <label className="text-sm font-bold sm:col-span-2">{t("candidateForm.availability")} *<textarea required maxLength={3000} name="availability" {...validation.props("availability")} rows={4} className={field} />{validation.error("availability")}</label>
      <FormConsent candidate validation={validation} />
      <button type="submit" className="rounded-full bg-[#131313] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#2b2b2b] disabled:opacity-60 sm:col-span-2">{reading ? t("candidateForm.readingBtn") : busy ? t("candidateForm.saving") : t("candidateForm.submit")}</button>
    </fieldset>
    <p role={success ? "status" : "alert"} className="mt-4 text-sm text-[#131313]">{status}</p>
  </form>;
}
