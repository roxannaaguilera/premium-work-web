import { validateForm } from "@/lib/form-validation";
import { normalizedPhone, resolveCity } from "@/lib/contact-options";
import { legalReady, PRIVACY_VERSION } from "@/lib/legal";
import { randomUUID } from "node:crypto";
import { authorized, database, privateHeaders } from "@/lib/candidates";
import { sectorLabels, serviceLabels, validDate } from "@/lib/service-options";

export const runtime = "nodejs";
const error = (message: string, status = 400) => Response.json({ error: message }, { status, headers: privateHeaders });

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" && !legalReady()) return Response.json({ error: "El formulario no está disponible temporalmente. Vuelve a intentarlo más adelante." }, { status: 503, headers: privateHeaders });
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) return error("Origen no permitido.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return error("Formato de solicitud no válido.", 415);
  let data: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return error("Faltan los datos.");
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32768) { await reader.cancel(); return error("La solicitud es demasiado grande.", 413); }
      chunks.push(value);
    }
    data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) return error("Datos no válidos.");
  } catch { return error("No se ha podido leer la solicitud."); }
  const errors = validateForm("client", data);
  if (Object.keys(errors).length) return Response.json({ error: "Revisa los campos señalados.", errors }, { status: 400, headers: privateHeaders });
  const values: Record<string, string> = {};
  for (const key of ["name", "company", "email", "city", "sector", "service", "message"]) {
    const value = data[key];
    if (typeof value !== "string" || !value.trim() || value.length > (key === "message" ? 5000 : 200)) return error("Revisa los campos obligatorios y su longitud.");
    values[key] = value.trim();
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !Object.hasOwn(sectorLabels, values.sector) || !Object.hasOwn(serviceLabels, values.service) || data.consent !== "on") return error("Revisa el email, el servicio, el sector y el consentimiento.");
  values.city = resolveCity(values.city)!;
  const phone = normalizedPhone(String(data.phone ?? ""), data.phone_country ?? "ES")!, eventDate = data.event_date ?? "";
  if (typeof phone !== "string" || phone.length > 100 || typeof eventDate !== "string" || (eventDate && !validDate(eventDate))) return error("Revisa el teléfono o la fecha del evento.");
  function optionalNumber(value: unknown) {
    if (value === "" || value === undefined || value === null) return null;
    if (typeof value !== "string" && typeof value !== "number") return NaN;
    if (typeof value === "string" && !value.trim()) return NaN;
    return Number(value);
  }
  const staff = optionalNumber(data.staff_count), budget = optionalNumber(data.budget);
  if (staff !== null && (!Number.isInteger(staff) || staff < 1 || staff > 10000)) return error("Indica un número entero de profesionales entre 1 y 10.000.");
  if (budget !== null && (!Number.isFinite(budget) || budget < 0 || budget > 100000000 || Math.abs(budget * 100 - Math.round(budget * 100)) > 0.00001)) return error("Indica un presupuesto válido, con un máximo de dos decimales.");
  try {
    const { error: insertError } = await database().from("client_requests").insert({ id: randomUUID(), ...values, phone: phone.trim() || null, event_date: eventDate || null, staff_count: staff, budget, consent_at: new Date().toISOString(), privacy_version: PRIVACY_VERSION });
    if (insertError) throw insertError;
    return Response.json({ ok: true }, { status: 201, headers: privateHeaders });
  } catch { return error("No se ha podido guardar tu solicitud. Inténtalo de nuevo más tarde.", 503); }
}

export async function GET(request: Request) {
  if (!authorized(request)) return error("Acceso no autorizado.", 401);
  const params = new URL(request.url).searchParams;
  const numeric: Record<string, number> = {};
  for (const key of ["minBudget", "maxBudget", "minStaff", "maxStaff"]) {
    const raw = params.get(key);
    if (!raw) continue;
    const value = Number(raw), staff = key.endsWith("Staff");
    if (!raw.trim() || !Number.isFinite(value) || value < (staff ? 1 : 0) || value > (staff ? 10000 : 100000000) || (staff && !Number.isInteger(value))) return error("Rango numérico no válido.");
    numeric[key] = value;
  }
  if (numeric.minBudget > numeric.maxBudget || numeric.minStaff > numeric.maxStaff) return error("El mínimo no puede superar al máximo.");
  const from = params.get("dateFrom"), to = params.get("dateTo");
  if ((from && !validDate(from)) || (to && !validDate(to)) || (from && to && from > to)) return error("Rango de fechas no válido.");
  const sector = params.get("sector"), service = params.get("service");
  if ((sector && !Object.hasOwn(sectorLabels, sector)) || (service && !Object.hasOwn(serviceLabels, service))) return error("Sector o servicio no válido.");
  const page = Number(params.get("page") || 1);
  if (!Number.isInteger(page) || page < 1 || page > 100000) return error("Página no válida.");
  try {
    let query = database().from("client_requests").select("id,name,company,email,phone,city,sector,service,event_date,staff_count,budget,message,consent_at", { count: "exact" });
    for (const column of ["company", "city"]) {
      const value = params.get(column)?.trim();
      if (value) query = query.ilike(column, `%${value.slice(0, 200).replace(/[\\%_]/g, "\\$&")}%`);
    }
    if (sector) query = query.eq("sector", sector);
    if (service) query = query.eq("service", service);
    if (from) query = query.gte("event_date", from);
    if (to) query = query.lte("event_date", to);
    for (const [key, value] of Object.entries(numeric)) {
      const column = key.endsWith("Staff") ? "staff_count" : "budget";
      query = key.startsWith("min") ? query.gte(column, value) : query.lte(column, value);
    }
    const { data, count, error: queryError } = await query.order("consent_at", { ascending: false }).order("id").range((page - 1) * 50, page * 50 - 1);
    if (queryError) throw queryError;
    return Response.json({ requests: data, total: count, page, pageSize: 50 }, { headers: privateHeaders });
  } catch { return error("No se pueden consultar las solicitudes. Comprueba la conexión con Supabase.", 503); }
}
