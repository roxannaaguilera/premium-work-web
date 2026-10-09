import type { H3Event } from "h3";
import { adminAuthorized, database, privateHeaders } from "../utils/candidates";
import { sectorLabels, serviceLabels, validDate } from "../../app/utils/service-options";

// The keys are identical in ES and EN; validation checks keys, not labels.
const SECTORS = sectorLabels("es");
const SERVICES = serviceLabels("es");

function fail(event: H3Event, message: string, status = 400) {
  setResponseStatus(event, status);
  setResponseHeaders(event, privateHeaders);
  return { error: message };
}

function param(query: Record<string, unknown>, key: string): string {
  const value = query[key];
  if (Array.isArray(value)) return String(value[0] ?? "");
  return typeof value === "string" ? value : "";
}

export default defineEventHandler(async (event) => {
  const token = (getHeader(event, "authorization") ?? "").replace(/^Bearer /, "");
  if (!adminAuthorized(token)) return fail(event, "Acceso no autorizado.", 401);
  const query = getQuery(event);

  const numeric: Record<string, number> = {};
  for (const key of ["minBudget", "maxBudget", "minStaff", "maxStaff"]) {
    const raw = param(query, key);
    if (!raw) continue;
    const value = Number(raw), staff = key.endsWith("Staff");
    if (!raw.trim() || !Number.isFinite(value) || value < (staff ? 1 : 0) || value > (staff ? 10000 : 100000000) || (staff && !Number.isInteger(value)))
      return fail(event, "Rango numérico no válido.");
    numeric[key] = value;
  }
  if ((numeric.minBudget ?? -Infinity) > (numeric.maxBudget ?? Infinity) || (numeric.minStaff ?? -Infinity) > (numeric.maxStaff ?? Infinity))
    return fail(event, "El mínimo no puede superar al máximo.");
  const from = param(query, "dateFrom"), to = param(query, "dateTo");
  if ((from && !validDate(from)) || (to && !validDate(to)) || (from && to && from > to))
    return fail(event, "Rango de fechas no válido.");
  const sector = param(query, "sector"), service = param(query, "service");
  if ((sector && !Object.hasOwn(SECTORS, sector)) || (service && !Object.hasOwn(SERVICES, service)))
    return fail(event, "Sector o servicio no válido.");
  const page = Number(param(query, "page") || 1);
  if (!Number.isInteger(page) || page < 1 || page > 100000) return fail(event, "Página no válida.");

  try {
    let q = database().from("client_requests").select("id,name,company,email,phone,city,sector,service,event_date,staff_count,budget,message,consent_at", { count: "exact" });
    for (const column of ["company", "city"]) {
      const value = param(query, column).trim();
      if (value) q = q.ilike(column, `%${value.slice(0, 200).replace(/[\\%_]/g, "\\$&")}%`);
    }
    if (sector) q = q.eq("sector", sector);
    if (service) q = q.eq("service", service);
    if (from) q = q.gte("event_date", from);
    if (to) q = q.lte("event_date", to);
    for (const [key, value] of Object.entries(numeric)) {
      const column = key.endsWith("Staff") ? "staff_count" : "budget";
      q = key.startsWith("min") ? q.gte(column, value) : q.lte(column, value);
    }
    const { data, count, error: queryError } = await q.order("consent_at", { ascending: false }).order("id").range((page - 1) * 50, page * 50 - 1);
    if (queryError) throw queryError;
    setResponseHeaders(event, privateHeaders);
    return { requests: data, total: count, page, pageSize: 50 };
  } catch {
    return fail(event, "No se pueden consultar las solicitudes. Comprueba la conexión con Supabase.", 503);
  }
});
