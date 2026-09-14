const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Run the real route handlers with Supabase replaced by an in-memory test double.
// No network requests, credentials, or candidate files leave this process.
function load(file, mocks = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', compiled)((name) => { if (mocks[name]) return mocks[name]; if (name.startsWith('@/')) return load(name.slice(2) + '.ts'); if (name.startsWith('.')) { const local = path.join(path.dirname(file), name); return name.endsWith('.json') ? JSON.parse(fs.readFileSync(path.join(__dirname, '..', local), 'utf8')) : load(local + '.ts'); } return require(name); }, module, module.exports);
  return module.exports;
}

function setup(options = {}) {
  const calls = [];
  const client = {
    storage: { from(bucket) { return {
      async upload(file, bytes) { calls.push(['upload', bucket, file, bytes]); return { error: options.uploadError || null }; },
      async remove(files) { calls.push(['remove', files]); return { error: null }; },
      async download(file) { calls.push(['download', file]); return { data: new Blob(['%PDF-1.7\nTest']), error: null }; },
    }; } },
    from(table) {
      calls.push(['table', table]);
      return {
        async insert(row) { calls.push(['insert', row]); return { error: options.insertError || null }; },
        select(columns) {
          calls.push(['select', columns]);
          const query = {};
          for (const method of ['gte', 'lte', 'ilike', 'order', 'eq']) query[method] = (...args) => { calls.push([method, ...args]); return query; };
          query.limit = async () => ({ data: [], error: null });
          query.maybeSingle = async () => ({ data: { cv_path: 'private/cv.pdf' }, error: null });
          return query;
        },
      };
    },
  };
  process.env.SUPABASE_URL = 'https://example.invalid';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only-service-key';
  process.env.CANDIDATE_ADMIN_TOKEN = 'test-admin-token-with-at-least-32-characters';
  const lib = load('lib/candidates.ts', { '@supabase/supabase-js': { createClient: () => client } });
  return { calls, lib, routes: load('app/api/candidatos/route.ts', { '@/lib/legal': load('lib/legal.ts'), '@/lib/candidates': lib }), cv: load('app/api/candidatos/[id]/cv/route.ts', { '@/lib/legal': load('lib/legal.ts'), '@/lib/candidates': lib }) };
}

function submission(overrides = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ name: 'Test Candidate', email: 'test@example.invalid', phone: '600000000', city: 'Madrid', years: '3', sector: 'Hoteles', companies: 'Example Hotel', availability: 'Fines de semana', consent: 'on', ...overrides })) data.set(key, value);
  if (!data.has('cv')) data.set('cv', new File(['%PDF-1.7\nTest'], 'cv.pdf', { type: 'application/pdf' }));
  return new Request('http://localhost/api/candidatos', { method: 'POST', body: data });
}
function authenticated(url) { return new Request(url, { headers: { authorization: `Bearer ${process.env.CANDIDATE_ADMIN_TOKEN}` } }); }

test('rejects invalid contact details, sectors and experience before storage', async () => {
  const { routes, calls } = setup();
  for (const patch of [{ name: '   ' }, { name: 'Ana' }, { name: 'A B' }, { name: 'Ana 123' }, { city: 'Paris' }, { phone: 'abcdefghi' }, { phone: '123' }, { sector: 'unknown' }, { years: 'abc' }]) {
    const response = await routes.POST(submission(patch));
    assert.equal(response.status, 400);
    assert.ok((await response.json()).errors[Object.keys(patch)[0]]);
  }
  assert.equal(calls.length, 0);
});

test('stores international prefix and manually entered decimal experience', async () => {
  const { routes, calls } = setup();
  const response = await routes.POST(submission({ phone: '15123456789', phone_country: 'DE', years: '2,25' }));
  assert.equal(response.status, 201);
  const row = calls.find(call => call[0] === 'insert')[1];
  assert.equal(row.phone, '+4915123456789');
  assert.equal(row.years, 2.25);
});

test('stores validated candidate and private PDF, without exposing a file URL', async () => {
  const { routes, calls } = setup();
  const response = await routes.POST(submission());
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(calls.find(c => c[0] === 'upload')[1], 'candidate-cvs');
  const row = calls.find(c => c[0] === 'insert')[1];
  assert.equal(row.years, 3);
  assert.equal(row.cv_path, `${row.id}/cv.pdf`);
  assert.ok(row.consent_at);
});

test('rejects missing consent, invalid years, and disguised PDF before storage', async () => {
  const { routes, calls } = setup();
  for (const invalid of [{ consent: '' }, { years: '-1' }, { years: '' }, { years: 'NaN' }, { email: 'invalid' }, { cv: new File(['not PDF'], 'cv.pdf') }]) assert.equal((await routes.POST(submission(invalid))).status, 400);
  assert.equal(calls.length, 0);
});

test('rejects CVs above the Vercel-compatible upload limit before storage', async () => {
  const { routes, calls } = setup();
  const cv = new File([new Uint8Array(4 * 1024 * 1024 + 1)], 'cv.pdf', { type: 'application/pdf' });
  const response = await routes.POST(submission({ cv }));
  assert.equal(response.status, 400);
  assert.match((await response.json()).errors.cv, /4 MB/);
  assert.equal(calls.length, 0);
});

test('rejects oversized request and cross-origin upload', async () => {
  const { routes, calls } = setup();
  const response = await routes.POST(new Request('http://localhost/api/candidatos', { method: 'POST', body: new Uint8Array(6 * 1024 * 1024 + 1) }));
  assert.equal(response.status, 413);
  const request = submission(); request.headers.set('origin', 'https://untrusted.invalid');
  assert.equal((await routes.POST(request)).status, 403);
  assert.equal(calls.length, 0);
});

test('removes uploaded file when database insert fails; never reports success', async () => {
  const { routes, calls } = setup({ insertError: new Error('simulated failure') });
  assert.equal((await routes.POST(submission())).status, 500);
  assert.ok(calls.some(c => c[0] === 'remove'));
});

test('does not insert a candidate if upload fails', async () => {
  const { routes, calls } = setup({ uploadError: new Error('simulated failure') });
  assert.equal((await routes.POST(submission())).status, 500);
  assert.ok(!calls.some(c => c[0] === 'insert'));
});

test('list and download are private even if admin configuration is absent', async () => {
  const { routes, cv, calls } = setup();
  assert.equal((await routes.GET(new Request('http://localhost/api/candidatos'))).status, 401);
  assert.equal((await cv.GET(new Request('http://localhost/api/candidatos/id/cv'), { params: Promise.resolve({ id: 'id' }) })).status, 401);
  delete process.env.CANDIDATE_ADMIN_TOKEN;
  assert.equal((await routes.GET(new Request('http://localhost/api/candidatos'))).status, 401);
  assert.equal(calls.length, 0);
});

test('combines experience, sector and company filters and excludes CV path from list', async () => {
  const { routes, calls } = setup();
  const response = await routes.GET(authenticated('http://localhost/api/candidatos?minYears=2&maxYears=8&sector=Hoteles&company=Example'));
  assert.equal(response.status, 200);
  assert.ok(calls.some(c => c[0] === 'gte' && c[1] === 'years' && c[2] === 2));
  assert.ok(calls.some(c => c[0] === 'lte' && c[2] === 8));
  assert.ok(calls.some(c => c[0] === 'ilike' && c[1] === 'companies'));
  assert.ok(!calls.find(c => c[0] === 'select')[1].includes('cv_path'));
  assert.equal((await routes.GET(authenticated('http://localhost/api/candidatos?minYears=9&maxYears=2'))).status, 400);
});

test('authorized CV download uses attachment and no-store headers', async () => {
  const { cv } = setup();
  const response = await cv.GET(authenticated('http://localhost/api/candidatos/id/cv'), { params: Promise.resolve({ id: '11111111-1111-4111-8111-111111111111' }) });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-disposition'), /^attachment/);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});
