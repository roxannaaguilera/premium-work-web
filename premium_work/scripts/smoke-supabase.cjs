// Real route handlers, synthetic submissions, cleanup limited to this run's unique email.
// Run: node --env-file=.env.local scripts/smoke-supabase.cjs
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(relative) {
  const file = path.resolve(root, relative);
  if (cache.has(file)) return cache.get(file).exports;
  const mod = { exports: {} }; cache.set(file, mod);
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  new Function('require', 'module', 'exports', js)(name => {
    if (name.startsWith('@/')) return load(name.slice(2) + '.ts');
    if (name.startsWith('.')) {
      const dependency = path.resolve(path.dirname(file), name);
      return name.endsWith('.json') ? JSON.parse(fs.readFileSync(dependency, 'utf8')) : load(dependency + '.ts');
    }
    return require(name);
  }, mod, mod.exports);
  return mod.exports;
}
// Exercise the same production handlers used by the deployment.
process.env.NODE_ENV = 'production';
const originalFetch = global.fetch;
global.fetch = (input, init) => originalFetch(input, { ...init, signal: AbortSignal.timeout(15000) });
const db = load('lib/candidates.ts').database();
const email = `integration-${randomUUID()}@example.invalid`;
const candidates = load('app/api/candidatos/route.ts');
const clients = load('app/api/clientes/route.ts');
function check(ok, label) { if (!ok) throw new Error(label + ': FAILED'); console.log(label + ': OK'); }
(async () => {
  try {
    const form = new FormData();
    for (const [key, value] of Object.entries({ name: 'Prueba Integracion', email, phone: '600123456', phone_country: 'ES', city: 'Madrid', years: '2,25', sector: 'Hoteles', companies: 'Empresa de prueba', availability: 'Datos sinteticos', consent: 'on' })) form.set(key, value);
    form.set('cv', new File(['%PDF-1.4\n% Synthetic test\n%%EOF'], 'prueba.pdf', { type: 'application/pdf' }));
    check((await candidates.POST(new Request('http://localhost/api/candidatos', { method: 'POST', body: form }))).status === 201, 'Candidate submission');
    const response = await clients.POST(new Request('http://localhost/api/clientes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Prueba Integracion', company: 'Empresa de prueba', email, phone: '15123456789', phone_country: 'DE', city: 'Madrid', sector: 'hoteles', service: 'camareros', message: 'Datos sinteticos', consent: 'on' }) }));
    check(response.status === 201, 'Client submission');
    const { data: rows, error } = await db.from('candidates').select('phone,years,cv_path,privacy_version').eq('email', email);
    check(!error && rows?.length === 1 && rows[0].phone === '+34600123456' && Number(rows[0].years) === 2.25 && !!rows[0].privacy_version, 'Candidate persisted');
    const { data: requests, error: requestError } = await db.from('client_requests').select('phone,privacy_version').eq('email', email);
    check(!requestError && requests?.length === 1 && requests[0].phone === '+4915123456789' && !!requests[0].privacy_version, 'Client persisted');
    const downloaded = await db.storage.from('candidate-cvs').download(rows[0].cv_path);
    check(!downloaded.error && downloaded.data?.size > 0, 'Private CV download');
    const publicUrl = db.storage.from('candidate-cvs').getPublicUrl(rows[0].cv_path).data.publicUrl;
    check([400, 401, 403, 404].includes((await fetch(publicUrl)).status), 'Public CV access denied');
    check((await candidates.GET(new Request('http://localhost/api/candidatos'))).status === 401, 'Anonymous candidate listing denied');
    check((await clients.GET(new Request('http://localhost/api/clientes'))).status === 401, 'Anonymous client listing denied');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    const { data: rows, error } = await db.from('candidates').select('cv_path').eq('email', email);
    if (error) throw new Error(`Cleanup inspection failed (code ${error.code || 'network'}): ${error.message}`);
    if (rows.length) {
      const removed = await db.storage.from('candidate-cvs').remove(rows.map(row => row.cv_path));
      if (removed.error) throw new Error('Test CV cleanup failed');
    }
    for (const table of ['candidates', 'client_requests']) {
      const result = await db.from(table).delete().eq('email', email);
      if (result.error) throw new Error('Test row cleanup failed');
    }
    console.log('Synthetic rows and CV removed: OK');
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
