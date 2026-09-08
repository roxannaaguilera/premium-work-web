const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(file, mocks = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', compiled)((name) => mocks[name] || require(name), module, module.exports);
  return module.exports;
}
function setup(fail = false) {
  const calls = [];
  const client = { from(table) {
    calls.push(['table', table]);
    return {
      async insert(data) { calls.push(['insert', data]); return { error: fail ? new Error('test') : null }; },
      select(...args) {
        calls.push(['select', ...args]); const query = {};
        for (const name of ['eq', 'ilike', 'gte', 'lte', 'order']) query[name] = (...args) => { calls.push([name, ...args]); return query; };
        query.range = async (...args) => { calls.push(['range', ...args]); return { data: [], count: 0, error: fail ? new Error('test') : null }; };
        return query;
      },
    };
  } };
  process.env.SUPABASE_URL = 'https://example.invalid';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only';
  process.env.CANDIDATE_ADMIN_TOKEN = 'test-admin-token-with-at-least-32-characters';
  const lib = load('lib/candidates.ts', { '@supabase/supabase-js': { createClient: () => client } });
  return { calls, routes: load('app/api/clientes/route.ts', { '@/lib/candidates': lib, '@/lib/service-options': load('lib/service-options.ts') }) };
}
function request(overrides = {}) {
  return new Request('http://localhost/api/clientes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'Test Contact', company: 'Example Hotel', email: 'test@example.invalid', city: 'Madrid', sector: 'hoteles', service: 'camareros', message: 'Servicio de prueba', consent: 'on', ...overrides }) });
}
function admin(query = '') { return new Request(`http://localhost/api/clientes${query}`, { headers: { authorization: `Bearer ${process.env.CANDIDATE_ADMIN_TOKEN}` } }); }

test('saves request with optional values null and no public data in response', async () => {
  const { routes, calls } = setup();
  const response = await routes.POST(request());
  assert.equal(response.status, 201); assert.deepEqual(await response.json(), { ok: true });
  const row = calls.find(c => c[0] === 'insert')[1];
  assert.equal(row.budget, null); assert.equal(row.staff_count, null); assert.equal(row.event_date, null);
  assert.ok(row.id); assert.ok(row.consent_at);
});
test('preserves zero budget, date and staff and creates independent request IDs', async () => {
  const { routes, calls } = setup();
  for (let i = 0; i < 2; i++) assert.equal((await routes.POST(request({ budget: '0', staff_count: '10', event_date: '2027-02-20' }))).status, 201);
  const rows = calls.filter(c => c[0] === 'insert').map(c => c[1]);
  assert.equal(rows[0].budget, 0); assert.equal(rows[0].staff_count, 10);
  assert.equal(rows[0].event_date, '2027-02-20'); assert.notEqual(rows[0].id, rows[1].id);
});
test('rejects invalid consent, enum values, dates, staff and monetary amounts', async () => {
  const { routes, calls } = setup();
  for (const value of [{ consent: '' }, { email: 'invalid' }, { sector: 'unknown' }, { service: '__proto__' }, { event_date: '2027-02-30' }, { staff_count: '1.5' }, { budget: '-1' }, { budget: '12.345' }, { budget: true }, { message: 'a'.repeat(5001) }]) assert.equal((await routes.POST(request(value))).status, 400);
  assert.equal(calls.length, 0);
});
test('rejects malformed, oversized and cross-origin submissions', async () => {
  const { routes, calls } = setup();
  assert.equal((await routes.POST(new Request('http://localhost/api/clientes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' }))).status, 400);
  assert.equal((await routes.POST(request({ message: 'a'.repeat(33000) }))).status, 413);
  const cross = request(); cross.headers.set('origin', 'https://other.invalid');
  assert.equal((await routes.POST(cross)).status, 403); assert.equal(calls.length, 0);
});
test('denies unauthenticated listing before accessing Supabase', async () => {
  const { routes, calls } = setup();
  assert.equal((await routes.GET(new Request('http://localhost/api/clientes'))).status, 401);
  delete process.env.CANDIDATE_ADMIN_TOKEN;
  assert.equal((await routes.GET(admin())).status, 401); assert.equal(calls.length, 0);
});
test('combines all business filters, escapes wildcards and paginates', async () => {
  const { routes, calls } = setup();
  const response = await routes.GET(admin('?company=Hotel%25&city=Madrid&sector=hoteles&service=camareros&minBudget=100&maxBudget=1000&minStaff=2&maxStaff=10&dateFrom=2027-01-01&dateTo=2027-12-31&page=2'));
  assert.equal(response.status, 200);
  assert.ok(calls.some(c => c[0] === 'ilike' && c[1] === 'company' && c[2] === '%Hotel\\%%'));
  assert.ok(calls.some(c => c[0] === 'eq' && c[1] === 'service' && c[2] === 'camareros'));
  assert.ok(calls.some(c => c[0] === 'gte' && c[1] === 'budget' && c[2] === 100));
  assert.ok(calls.some(c => c[0] === 'lte' && c[1] === 'staff_count' && c[2] === 10));
  assert.ok(calls.some(c => c[0] === 'gte' && c[1] === 'event_date'));
  assert.ok(calls.some(c => c[0] === 'range' && c[1] === 50 && c[2] === 99));
  assert.equal(response.headers.get('cache-control'), 'no-store');
});
test('rejects inverted ranges, bad dates and invalid pagination before query', async () => {
  const { routes, calls } = setup();
  for (const query of ['?minBudget=10&maxBudget=1', '?minStaff=20&maxStaff=2', '?dateFrom=2027-02-30', '?dateFrom=2027-03-01&dateTo=2027-01-01', '?page=0', '?page=1.5', '?minStaff=NaN']) assert.equal((await routes.GET(admin(query))).status, 400);
  assert.equal(calls.length, 0);
});
test('database failures never produce a success response', async () => {
  const { routes } = setup(true);
  assert.equal((await routes.POST(request())).status, 503);
  assert.equal((await routes.GET(admin())).status, 503);
});
