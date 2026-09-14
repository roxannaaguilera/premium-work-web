// Run from the project directory: node --env-file=.env.local scripts/check-supabase.cjs
// Read-only checks. Never log credentials or stored submissions.
const { createClient } = require('@supabase/supabase-js');
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Missing Supabase URL or server key.'); process.exit(1); }
const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15000) }) },
});
(async () => {
  let failed = false;
  for (const [table, columns] of [
    ['candidates', 'id,name,email,phone,city,years,sector,companies,availability,privacy_version,consent_at,cv_path'],
    ['client_requests', 'id,name,company,email,phone,city,sector,service,event_date,staff_count,budget,message,privacy_version,consent_at'],
  ]) {
    const { error, status } = await db.from(table).select(columns).limit(0);
    console.log(`${table}: ${error ? `FAILED (HTTP ${status}, code ${error.code || 'network'})` : 'OK'}`);
    if (error) failed = true;
  }
  try {
    const { data, error } = await db.storage.getBucket('candidate-cvs');
    if (error) { failed = true; console.log(`candidate-cvs: FAILED (code ${error.statusCode || 'network'})`); }
    else {
      const ready = data.public === false && Number(data.file_size_limit) === 5242880 && data.allowed_mime_types?.includes('application/pdf');
      console.log(`candidate-cvs: ${ready ? 'OK (private, PDF, 5 MB)' : 'CONFIGURATION REQUIRED'}`);
      if (!ready) failed = true;
    }
  } catch { failed = true; console.log('candidate-cvs: network error'); }
  process.exitCode = failed ? 1 : 0;
})().catch(() => { console.error('Connection check failed.'); process.exitCode = 1; });
