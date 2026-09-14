// Server credentials are read from the environment, never printed.
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15000) }) },
});
(async () => {
  const { error } = await db.storage.createBucket('candidate-cvs', { public: false, fileSizeLimit: 5242880, allowedMimeTypes: ['application/pdf'] });
  if (error) { console.error(`Bucket creation failed (code ${error.statusCode || 'network'}).`); process.exitCode = 1; }
  else console.log('Created private CV bucket: PDFs up to 5 MB.');
})().catch(() => { console.error('Bucket creation failed.'); process.exitCode = 1; });
