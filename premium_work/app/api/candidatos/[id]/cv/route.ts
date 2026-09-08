import { authorized, CV_BUCKET, database, privateHeaders } from "@/lib/candidates";

export const runtime = "nodejs";
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!authorized(request)) return new Response(null, { status: 401, headers: privateHeaders });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response(null, { status: 400 });
  try {
    const db = database();
    const { data: row, error } = await db.from("candidates").select("cv_path").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!row) return new Response(null, { status: 404, headers: privateHeaders });
    const file = await db.storage.from(CV_BUCKET).download(row.cv_path);
    if (file.error) throw file.error;
    return new Response(file.data, { headers: { ...privateHeaders, "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="curriculum.pdf"', "Content-Security-Policy": "sandbox" } });
  } catch {
    return new Response("No se puede descargar el CV.", { status: 503, headers: privateHeaders });
  }
}