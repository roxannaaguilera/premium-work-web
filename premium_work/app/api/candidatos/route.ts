import { randomUUID } from "node:crypto";
import { authorized, CV_BUCKET, database, privateHeaders } from "@/lib/candidates";

export const runtime = "nodejs";
const LIMIT = 6 * 1024 * 1024;

export async function POST(request: Request) {
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Origen no permitido." }, { status: 403 });
  try {
    const reader = request.body?.getReader();
    if (!reader) return Response.json({ error: "Faltan los datos." }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > LIMIT) { await reader.cancel(); return Response.json({ error: "El CV debe pesar como máximo 5 MB." }, { status: 413 }); }
      chunks.push(value);
    }
    const data = await new Response(Buffer.concat(chunks), { headers: { "Content-Type": request.headers.get("content-type") || "" } }).formData();
    const values: Record<string, string> = {};
    for (const key of ["name", "email", "phone", "city", "sector", "companies", "availability"]) {
      const value = data.get(key);
      if (typeof value !== "string" || !value.trim() || value.length > (key === "availability" || key === "companies" ? 3000 : 200)) return Response.json({ error: "Revisa los campos obligatorios y su longitud." }, { status: 400 });
      values[key] = value.trim();
    }
    const rawYears = data.get("years");
    const years = Number(rawYears);
    if (typeof rawYears !== "string" || !rawYears.trim() || !Number.isFinite(years) || years < 0 || years > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || data.get("consent") !== "on") return Response.json({ error: "Revisa el email, los años de experiencia y el consentimiento." }, { status: 400 });
    const cv = data.get("cv");
    if (!(cv instanceof File) || cv.size === 0 || cv.size > 5 * 1024 * 1024 || !cv.name.toLowerCase().endsWith(".pdf")) return Response.json({ error: "Adjunta un CV en PDF de hasta 5 MB." }, { status: 400 });
    const bytes = Buffer.from(await cv.arrayBuffer());
    if (bytes.subarray(0, 5).toString() !== "%PDF-") return Response.json({ error: "El archivo no es un PDF válido." }, { status: 400 });
    const db = database();
    const id = randomUUID();
    const cvPath = `${id}/cv.pdf`;
    const upload = await db.storage.from(CV_BUCKET).upload(cvPath, bytes, { contentType: "application/pdf", upsert: false });
    if (upload.error) throw upload.error;
    const inserted = await db.from("candidates").insert({ id, ...values, years, consent_at: new Date().toISOString(), cv_path: cvPath });
    if (inserted.error) {
      await db.storage.from(CV_BUCKET).remove([cvPath]);
      throw inserted.error;
    }
    return Response.json({ ok: true }, { status: 201, headers: privateHeaders });
  } catch {
    return Response.json({ error: "No se ha podido guardar la candidatura. Inténtalo de nuevo más tarde." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Acceso no autorizado." }, { status: 401, headers: privateHeaders });
  const query = new URL(request.url).searchParams;
  const min = Number(query.get("minYears") || 0), max = Number(query.get("maxYears") || 80);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max > 80 || min > max) return Response.json({ error: "Rango de experiencia no válido." }, { status: 400 });
  const sector = (query.get("sector") || "").slice(0, 200).toLowerCase();
  const company = (query.get("company") || "").slice(0, 200).toLowerCase();
  try {
    const db = database();
    let selection = db.from("candidates").select("id,name,email,phone,city,years,sector,companies,availability,consent_at").gte("years", min).lte("years", max);
    const escape = (value: string) => value.replace(/[\\%_]/g, "\\$&");
    if (sector) selection = selection.ilike("sector", `%${escape(sector)}%`);
    if (company) selection = selection.ilike("companies", `%${escape(company)}%`);
    const { data, error } = await selection.order("consent_at", { ascending: false }).limit(200);
    if (error) throw error;
    return Response.json({ candidates: data }, { headers: privateHeaders });
  } catch {
    return Response.json({ error: "No se pueden consultar las candidaturas. Comprueba la conexión con Supabase." }, { status: 503, headers: privateHeaders });
  }
}