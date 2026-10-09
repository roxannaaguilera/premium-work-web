import { randomUUID } from "node:crypto";
import type { H3Event } from "h3";
import { database, privateHeaders } from "../utils/candidates";
import { PRIVACY_VERSION } from "../utils/legal";
import { validateForm } from "../../app/utils/form-validation";
import { normalizedPhone, resolveCity } from "../../app/utils/contact-options";
import { sectorLabels, serviceLabels, validDate } from "../../app/utils/service-options";

// The keys are identical in ES and EN; validation checks keys, not labels.
const SECTORS = sectorLabels("es");
const SERVICES = serviceLabels("es");

function fail(event: H3Event, message: string, status = 400, extra?: Record<string, unknown>) {
  setResponseStatus(event, status);
  setResponseHeaders(event, privateHeaders);
  return { error: message, ...extra };
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const origin = getHeader(event, "origin");
  if (origin && origin !== url.origin) return fail(event, "Origen no permitido.", 403);
  if (!(getHeader(event, "content-type") ?? "").startsWith("application/json"))
    return fail(event, "Formato de solicitud no válido.", 415);

  let data: Record<string, unknown>;
  try {
    const body = await readBody(event);
    if (!body || typeof body !== "object" || Array.isArray(body)) return fail(event, "Datos no válidos.");
    data = body as Record<string, unknown>;
  } catch {
    return fail(event, "No se ha podido leer la solicitud.");
  }

  const errors = validateForm("client", data);
  if (Object.keys(errors).length) return fail(event, "Revisa los campos señalados.", 400, { errors });

  const values = {} as Record<"name" | "company" | "email" | "city" | "sector" | "service" | "message", string>;
  for (const key of ["name", "company", "email", "city", "sector", "service", "message"] as const) {
    const value = data[key];
    if (typeof value !== "string" || !value.trim() || value.length > (key === "message" ? 5000 : 200))
      return fail(event, "Revisa los campos obligatorios y su longitud.");
    values[key] = value.trim();
  }
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ||
    !Object.hasOwn(SECTORS, values.sector) ||
    !Object.hasOwn(SERVICES, values.service) ||
    data.consent !== "on"
  )
    return fail(event, "Revisa el email, el servicio, el sector y el consentimiento.");

  values.city = resolveCity(values.city)!;
  const phone = normalizedPhone(String(data.phone ?? ""), data.phone_country ?? "ES")!;
  const eventDate = typeof data.event_date === "string" ? data.event_date : "";
  if (typeof phone !== "string" || phone.length > 100 || (eventDate && !validDate(eventDate)))
    return fail(event, "Revisa el teléfono o la fecha del evento.");

  function optionalNumber(value: unknown) {
    if (value === "" || value === undefined || value === null) return null;
    if (typeof value !== "string" && typeof value !== "number") return NaN;
    if (typeof value === "string" && !value.trim()) return NaN;
    return Number(value);
  }
  const staff = optionalNumber(data.staff_count), budget = optionalNumber(data.budget);
  if (staff !== null && (!Number.isInteger(staff) || staff < 1 || staff > 10000))
    return fail(event, "Indica un número entero de profesionales entre 1 y 10.000.");
  if (budget !== null && (!Number.isFinite(budget) || budget < 0 || budget > 100000000 || Math.abs(budget * 100 - Math.round(budget * 100)) > 0.00001))
    return fail(event, "Indica un presupuesto válido, con un máximo de dos decimales.");

  try {
    const { error: insertError } = await database().from("client_requests").insert({
      id: randomUUID(), ...values,
      phone: phone.trim() || null,
      event_date: eventDate || null,
      staff_count: staff, budget,
      consent_at: new Date().toISOString(),
      privacy_version: PRIVACY_VERSION,
    });
    if (insertError) throw insertError;
    setResponseStatus(event, 201);
    setResponseHeaders(event, privateHeaders);
    return { ok: true };
  } catch {
    return fail(event, "No se ha podido guardar tu solicitud. Inténtalo de nuevo más tarde.", 503);
  }
});
