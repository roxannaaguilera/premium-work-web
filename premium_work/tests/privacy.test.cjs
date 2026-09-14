const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function load(file, mocks = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)((name) => { if (mocks[name]) return mocks[name]; if (name.startsWith('@/')) return load(name.slice(2) + '.ts'); if (name.startsWith('.')) { const local = path.join(path.dirname(file), name); return name.endsWith('.json') ? JSON.parse(fs.readFileSync(path.join(__dirname, '..', local), 'utf8')) : load(local + '.ts'); } return require(name); }, module, module.exports);
  return module.exports;
}
const prefs = load('lib/cookie-preferences.ts');
test('choice is invalidated when absent, corrupt, expired or from another version', () => {
  const now = 1000000000000;
  const good = prefs.createPreference('reject', now);
  assert.ok(prefs.parsePreference(JSON.stringify(good), now));
  for (const raw of [null, 'broken', '{}', JSON.stringify({ ...good, version: 'old' }), JSON.stringify({ ...good, choice: 'anything' })]) assert.equal(prefs.parsePreference(raw, now), null);
  assert.equal(prefs.parsePreference(JSON.stringify(good), now + prefs.PREFERENCE_MAX_AGE), null);
});
test('accept and reject do not grant analytics or marketing permissions', () => {
  for (const choice of ['accept', 'reject', 'custom']) {
    const result = prefs.createPreference(choice);
    assert.equal(result.necessary, true);
    assert.equal(result.analytics, undefined);
    assert.equal(result.marketing, undefined);
  }
});
test('production saves valid submissions even when legal details are still drafts', async () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    const legal = load('lib/legal.ts');
    legal.legal.reviewed = false;
    const inserts = [];
    const mocks = { '@/lib/legal': legal, '@/lib/candidates': { privateHeaders: {}, CV_BUCKET: 'candidate-cvs', database() { return {
      from(table) { return { async insert(row) { inserts.push({ table, row }); return { error: null }; } }; },
      storage: { from() { return { async upload() { return { error: null }; } }; } },
    }; } } };
    const candidate = new FormData();
    for (const [key, value] of Object.entries({ name: 'Test Candidate', email: 'test@example.invalid', phone: '600123456', city: 'Madrid', years: '0', sector: 'Hoteles', companies: 'Sin experiencia', availability: 'Inmediata', consent: 'on' })) candidate.set(key, value);
    candidate.set('cv', new File(['%PDF-1.4\nTest'], 'cv.pdf', { type: 'application/pdf' }));
    const response = await load('app/api/candidatos/route.ts', mocks).POST(new Request('http://localhost', { method: 'POST', body: candidate }));
    assert.equal(response.status, 201);
    const commercial = await load('app/api/clientes/route.ts', mocks).POST(new Request('http://localhost', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Test Contact', company: 'Hotel Test', email: 'test@example.invalid', city: 'Madrid', sector: 'hoteles', service: 'camareros', message: 'Personal para un evento', consent: 'on' }) }));
    assert.equal(commercial.status, 201);
    assert.deepEqual(inserts.map(item => item.table), ['candidates', 'client_requests']);
  } finally { if (previous === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous; }
});
test('legal readiness requires identity, retention and providers, not just approval flag', () => {
  const { legal, legalReady } = load('lib/legal.ts');
  legal.reviewed = true; legal.owner = '';
  assert.equal(legalReady(), false);
});
