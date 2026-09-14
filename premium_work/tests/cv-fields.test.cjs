const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../lib/cv-fields.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const mod = { exports: {} };
new Function('module', 'exports', compiled)(mod, mod.exports);
const { fieldsFromCv } = mod.exports;

test('extracts contacts, explicit experience and employment without education', () => {
  const result = fieldsFromCv(`CURRICULUM VITAE
María García López
maria@example.com
Teléfono: +34 600 123 456
Ciudad: Toledo
Perfil profesional
Camarera con 4 años de experiencia
Experiencia laboral
Hotel Central, camarera, 2020-2024
Formación académica
Escuela de hostelería
Disponibilidad: Fines de semana`);
  assert.deepEqual(result, { name: 'María García López', email: 'maria@example.com', phone: '+34 600 123 456', city: 'Toledo', years: '4', sector: 'Hoteles', companies: 'Hotel Central, camarera, 2020-2024', availability: 'Camarera con 4 años de experiencia\n\nFines de semana' });
});

test('leaves unknown values blank and does not turn date ranges into phones or experience', () => {
  const result = fieldsFromCv('CURRICULUM VITAE\nExperiencia laboral\n2018-2024\nHotel Central\nRestaurante Norte');
  assert.equal(result.name, undefined);
  assert.equal(result.phone, undefined);
  assert.equal(result.years, undefined);
  assert.equal(result.sector, undefined);
  assert.deepEqual(fieldsFromCv(''), {});
});

test('extracts labelled data and first-job candidates without inventing consent', () => {
  const result = fieldsFromCv('Nombre: Ana de la Cruz\nEmail: ana@example.com\nSin experiencia previa\nDisponibilidad: Inmediata');
  assert.equal(result.name, 'Ana de la Cruz');
  assert.equal(result.years, '0');
  assert.equal(result.sector, 'Sin experiencia previa');
  assert.equal(result.companies, 'Sin experiencia');
  assert.equal(result.consent, undefined);
});
