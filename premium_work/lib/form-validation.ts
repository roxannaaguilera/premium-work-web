import { sectorLabels, serviceLabels, validDate } from "./service-options";
import { normalizedPhone, resolveCity } from "./contact-options";

export const candidateSectors = ["Hoteles", "Restaurantes", "Catering", "Eventos", "Limpieza y housekeeping", "Otro", "Sin experiencia previa"];
export type FormKind = "candidate" | "client";
export type FieldErrors = Record<string, string>;

export function validateForm(kind: FormKind, data: Record<string, unknown>): FieldErrors {
  const errors: FieldErrors = {};
  const required = kind === "candidate"
    ? ["name", "email", "phone", "city", "sector", "companies", "availability"]
    : ["name", "company", "email", "city", "sector", "service", "message"];
  for (const key of required) {
    const max = key === "message" ? 5000 : ["companies", "availability"].includes(key) ? 3000 : 200;
    const value = data[key];
    if (typeof value !== "string" || !value.trim()) errors[key] = "Completa este campo.";
    else if (value.length > max) errors[key] = `Usa como máximo ${max} caracteres.`;
  }
  if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email).trim())) errors.email = "Introduce un email válido, por ejemplo nombre@empresa.com.";
  if (!errors.name) {
    const parts = String(data.name).trim().split(/\s+/);
    if (parts.length < 2 || parts.some(part => !/^[\p{L}\p{M}'’.-]+$/u.test(part) || (part.match(/\p{L}/gu)?.length || 0) < 2)) errors.name = "Escribe al menos tu nombre y un apellido, con un mínimo de dos letras cada uno.";
  }
  if (!errors.city && !resolveCity(String(data.city))) errors.city = "Selecciona una ciudad de España.";
  const phone = data.phone ?? "";
  if (!errors.phone && (typeof phone !== "string" || normalizedPhone(phone, data.phone_country ?? "ES") === null)) errors.phone = "Selecciona el país e introduce un número de teléfono válido.";
  if (!errors.sector && !(kind === "candidate" ? candidateSectors.includes(String(data.sector).trim()) : Object.hasOwn(sectorLabels, String(data.sector).trim()))) errors.sector = "Selecciona un sector válido.";
  if (data.consent !== "on") errors.consent = "Marca esta casilla para poder enviar el formulario.";
  if (kind === "candidate") {
    const years = Number(String(data.years).replace(",", "."));
    if (typeof data.years !== "string" || !/^\d+(?:[.,]\d{1,2})?$/.test(data.years.trim()) || !Number.isFinite(years) || years < 0 || years > 80) errors.years = "Indica cuántos años tienes de experiencia.";
    const cv = data.cv;
    if (!(cv instanceof File) || !cv.size || cv.size > 4 * 1024 * 1024 || !cv.name.toLowerCase().endsWith(".pdf")) errors.cv = "Adjunta un CV en PDF, no vacío y de hasta 4 MB.";
  } else {
    if (!errors.service && !Object.hasOwn(serviceLabels, String(data.service).trim())) errors.service = "Selecciona un servicio válido.";
    const date = data.event_date ?? "";
    if (typeof date !== "string" || (date && !validDate(date))) errors.event_date = "Introduce una fecha válida.";
    for (const key of ["staff_count", "budget"]) {
      const raw = data[key];
      if (raw === "" || raw === undefined || raw === null) continue;
      const value = Number(raw);
      const valid = (typeof raw === "number" || (typeof raw === "string" && !!raw.trim())) && Number.isFinite(value);
      if (key === "staff_count" && (!valid || !Number.isInteger(value) || value < 1 || value > 10000)) errors[key] = "Indica un número entero entre 1 y 10.000.";
      if (key === "budget" && (!valid || value < 0 || value > 100000000 || Math.abs(value * 100 - Math.round(value * 100)) > 0.00001)) errors[key] = "Indica un presupuesto entre 0 y 100.000.000 €, con hasta dos decimales.";
    }
  }
  return errors;
}
