import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "node:crypto";

export const CV_BUCKET = "candidate-cvs";
export function database() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Configure Supabase credentials on the server");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
export function authorized(request: Request) {
  const secret = process.env.CANDIDATE_ADMIN_TOKEN;
  const token = request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  if (!secret || secret.length < 32) return false;
  const a = Buffer.from(secret), b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const privateHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
