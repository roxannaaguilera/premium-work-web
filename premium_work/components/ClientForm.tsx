"use client";

import { CityField } from "@/components/CityField";
import { submitForm } from "@/lib/submit-form";
import { FormConsent } from "@/components/FormConsent";
import { PhoneField, usePhoneValue } from "@/components/PhoneField";
import { useFormValidation } from "@/components/useFormValidation";
import { useState, type FormEvent } from "react";
import { sectorLabels, serviceLabels } from "@/lib/service-options";
import { useLang } from "@/components/i18n/lang";

const field = "mt-2 w-full border-b border-[#131313]/30 bg-transparent py-3 font-normal outline-none focus:border-[#173aab]";
export function ClientForm({ sector = "", service = "" }: { sector?: string; service?: string }) {
  const { t, lang } = useLang();
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
    if (!validation.validate(form)) { setStatus(t("clientForm.reviewFields")); return; }
    const data = Object.fromEntries(new FormData(form));
    setBusy(true); setSuccess(false); setStatus("");
    try {
      const result = await submitForm("/api/clientes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (result.errors) validation.setErrors(result.errors);
      if (result.error) throw new Error(result.error);
      setSuccess(true); setStatus(t("clientForm.received"));
      form.reset();
      phone.clear();
      validation.setErrors({});
    } catch (error) { setStatus(error instanceof Error ? error.message : t("clientForm.connectError")); }
    finally { setBusy(false); }
  }
  return <form noValidate onBlur={validation.onBlur} onChange={validation.onChange} onSubmit={submit} className="integrated-form" aria-busy={busy}>
    <p className="mb-4 text-sm text-[#4a5264]">{t("clientForm.requiredNote")}</p>
    <fieldset disabled={busy} className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      <label className="text-sm font-bold">{t("clientForm.name")} *<input required name="name" {...validation.props("name")} autoComplete="name" maxLength={200} className={field} />{validation.error("name")}</label>
      <label className="text-sm font-bold">{t("clientForm.company")} *<input required name="company" {...validation.props("company")} autoComplete="organization" maxLength={200} className={field} />{validation.error("company")}</label>
      <label className="text-sm font-bold">{t("clientForm.email")} *<input required type="email" name="email" {...validation.props("email")} autoComplete="email" maxLength={200} className={field} />{validation.error("email")}</label>
      <PhoneField value={phone} disabled={busy} field={field} validation={validation.props("phone")} error={validation.error("phone")} />
      <label className="text-sm font-bold">{t("clientForm.sector")} *<select required name="sector" {...validation.props("sector")} defaultValue={sector} className={field}><option value="">{t("clientForm.selectSector")}</option>{Object.entries(sectorLabels(lang)).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{validation.error("sector")}</label>
      <label className="text-sm font-bold">{t("clientForm.service")} *<select required name="service" {...validation.props("service")} defaultValue={service} className={field}><option value="">{t("clientForm.selectService")}</option>{Object.entries(serviceLabels(lang)).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{validation.error("service")}</label>
      <CityField label={t("clientForm.city")} selectLabel={t("clientForm.selectCity")} field={field} validation={validation.props("city")} error={validation.error("city")} />
      <label className="text-sm font-bold">{t("clientForm.eventDate")} {t("clientForm.optional")}<input type="date" name="event_date" {...validation.props("event_date")} className={field} />{validation.error("event_date")}</label>
      <label className="text-sm font-bold">{t("clientForm.staffCount")} {t("clientForm.optional")}<input type="number" min="1" max="10000" step="1" name="staff_count" {...validation.props("staff_count")} className={field} />{validation.error("staff_count")}</label>
      <label className="text-sm font-bold">{t("clientForm.budget")} {t("clientForm.optional")}<input type="number" min="0" max="100000000" step="0.01" name="budget" {...validation.props("budget")} className={field} />{validation.error("budget")}</label>
      <label className="text-sm font-bold sm:col-span-2">{t("clientForm.message")} *<textarea required name="message" {...validation.props("message")} rows={3} maxLength={5000} className={field} />{validation.error("message")}</label>
      <FormConsent validation={validation} />
      <button type="submit" className="rounded-full bg-[#131313] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#2b2b2b] disabled:opacity-60 sm:col-span-2">{busy ? t("clientForm.saving") : t("clientForm.submit")}</button>
    </fieldset>
    <p role={success ? "status" : "alert"} className="mt-4 text-sm text-[#131313]">{status}</p>
  </form>;
}
