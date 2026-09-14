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
test('production rejects personal-data submissions until legal details are ready', async () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    const legal = load('lib/legal.ts');
    // Force an incomplete draft even if real details are added later.
    legal.legal.reviewed = false;
    const mocks = { '@/lib/legal': legal, '@/lib/candidates': { privateHeaders: {}, database() { throw new Error('Must not access database'); } }, '@/lib/service-options': load('lib/service-options.ts') };
    for (const route of ['app/api/candidatos/route.ts', 'app/api/clientes/route.ts']) {
      const response = await load(route, mocks).POST(new Request('http://localhost', { method: 'POST' }));
      assert.equal(response.status, 503);
    }
  } finally { if (previous === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous; }
});
test('legal readiness requires identity, retention and providers, not just approval flag', () => {
  const { legal, legalReady } = load('lib/legal.ts');
  legal.reviewed = true; legal.owner = '';
  assert.equal(legalReady(), false);
});
