import { sectorLabels, serviceLabels, candidateSectors, validDate } from "./service-options";
import { normalizedPhone, resolveCity } from "./contact-options";
import { dicts, type Lang } from "~~/i18n/dict";

export type FormKind = "candidate" | "client";
export type FieldErrors = Record<string, string>;

export function validateForm(kind: FormKind, data: Record<string, unknown>, lang: Lang = "es"): FieldErrors {
  const v = dicts[lang].validation;
  const errors: FieldErrors = {};
  const required = kind === "candidate"
    ? ["name", "email", "phone", "city", "sector", "companies", "availability"]
    : ["name", "company", "email", "city", "sector", "service", "message"];
  for (const key of required) {
    const max = key === "message" ? 5000 : ["companies", "availability"].includes(key) ? 3000 : 200;
    const value = data[key];
    if (typeof value !== "string" || !value.trim()) errors[key] = v.required;
    else if (value.length > max) errors[key] = v.maxChars.replace("{max}", String(max));
  }
  if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email).trim())) errors.email = v.email;
  if (!errors.name) {
    const parts = String(data.name).trim().split(/\s+/);
    if (parts.length < 2 || parts.some(part => !/^[\p{L}\p{M}'’.-]+$/u.test(part) || (part.match(/\p{L}/gu)?.length || 0) < 2)) errors.name = v.name;
  }
  if (!errors.city && !resolveCity(String(data.city))) errors.city = v.city;
  const phone = data.phone ?? "";
  if (!errors.phone && (typeof phone !== "string" || normalizedPhone(phone, data.phone_country ?? "ES") === null)) errors.phone = v.phone;
  if (!errors.sector && !(kind === "candidate" ? candidateSectors(lang).includes(String(data.sector).trim()) : Object.hasOwn(sectorLabels(lang), String(data.sector).trim()))) errors.sector = v.sector;
  if (data.consent !== "on") errors.consent = v.consent;
  if (kind === "candidate") {
    const years = Number(String(data.years).replace(",", "."));
    if (typeof data.years !== "string" || !/^\d+(?:[.,]\d{1,2})?$/.test(data.years.trim()) || !Number.isFinite(years) || years < 0 || years > 80) errors.years = v.years;
    const cv = data.cv;
    if (!(cv instanceof File) || !cv.size || cv.size > 4 * 1024 * 1024 || !cv.name.toLowerCase().endsWith(".pdf")) errors.cv = v.cv;
  } else {
    if (!errors.service && !Object.hasOwn(serviceLabels(lang), String(data.service).trim())) errors.service = v.service;
    const date = data.event_date ?? "";
    if (typeof date !== "string" || (date && !validDate(date))) errors.event_date = v.date;
    for (const key of ["staff_count", "budget"]) {
      const raw = data[key];
      if (raw === "" || raw === undefined || raw === null) continue;
      const value = Number(raw);
      const valid = (typeof raw === "number" || (typeof raw === "string" && !!raw.trim())) && Number.isFinite(value);
      if (key === "staff_count" && (!valid || !Number.isInteger(value) || value < 1 || value > 10000)) errors[key] = v.staffCount;
      if (key === "budget" && (!valid || value < 0 || value > 100000000 || Math.abs(value * 100 - Math.round(value * 100)) > 0.00001)) errors[key] = v.budget;
    }
  }
  return errors;
}
