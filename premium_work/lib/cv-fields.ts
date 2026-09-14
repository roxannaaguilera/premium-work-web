export type CandidateFields = Partial<Record<"name" | "email" | "phone" | "city" | "years" | "sector" | "companies" | "availability", string>>;

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const headings = /^(experiencia(?: laboral| profesional)?|historial laboral|work experience|employment(?: history)?|formacion(?: academica)?|educacion|education|estudios|habilidades|skills|idiomas|languages|contacto|datos personales|perfil(?: profesional)?|sobre mi|resumen|profile|summary|disponibilidad|availability|referencias|references)\s*:?$/i;

/** Conservative suggestions: missing or ambiguous information remains editable and blank. */
export function fieldsFromCv(text: string): CandidateFields {
  const lines = text.slice(0, 100000).split(/\r?\n/).map(line => line.replace(/\s+/g, " ").trim()).filter(Boolean);
  const joined = lines.join("\n");
  const fields: CandidateFields = {};
  function labelled(label: string) {
    const expression = new RegExp(`^(?:${label})\\s*[:：]\\s*(.+)$`, "i");
    return lines.map(line => line.match(expression)?.[1]?.trim()).find(Boolean);
  }
  function section(pattern: RegExp) {
    const start = lines.findIndex(line => pattern.test(normalize(line)));
    if (start < 0) return "";
    const result: string[] = [];
    for (const line of lines.slice(start + 1)) {
      if (headings.test(normalize(line))) break;
      result.push(line);
    }
    return result.join("\n");
  }
  const name = labelled("nombre(?: y apellidos)?|name|full name") || lines.slice(0, 5).find(line => {
    const words = line.split(" ");
    return words.length >= 2 && words.length <= 6 && /^[\p{L}\p{M} .'’\-]+$/u.test(line)
      && !headings.test(normalize(line))
      && !/curriculum|vitae|resume|camarer|recepcion|hostess|housekeep|cocin|chef|maitre|supervisor|profesional|personal|hotel|restaurante|experiencia|contact|limpieza|assistant|manager/i.test(normalize(line));
  });
  if (name) fields.name = name.slice(0, 200);
  const email = joined.match(/[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+/i)?.[0];
  if (email) fields.email = email.slice(0, 200);
  const phoneSource = labelled("tel[eé]fono|tel\\.?|m[oó]vil|phone|mobile") || lines.slice(0, 20).join("\n");
  const phone = phoneSource.match(/\+?\d[\d ().-]{5,}\d/g)?.find(value => {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 9 && digits.length <= 15 && !/^\d{4}\s*[-–]\s*\d{4}$/.test(value);
  });
  if (phone) fields.phone = phone.trim();
  const city = labelled("ciudad|localidad|residencia|ubicaci[oó]n|city|location");
  if (city) fields.city = city.slice(0, 200);
  else {
    const contactCity = lines.slice(0, 12).find(line => /^(?:\d{5}\s+)?(?:Madrid|Barcelona|Valencia|Sevilla|M[aá]laga|Bilbao|Zaragoza|Alicante|Murcia|Granada|C[oó]rdoba|Valladolid|Palma)(?:\s*[,|·-]\s*(?:Espa[nñ]a|Spain))?$/i.test(line));
    if (contactCity) fields.city = contactCity.replace(/^\d{5}\s+/, "").split(/[,|·]/)[0].trim();
  }
  const years = joined.match(/(\d{1,2}(?:[.,]5)?)\s*(?:a[nñ]os? de experiencia|years?(?: of)? experience)/i)?.[1]
    || labelled("a[nñ]os de experiencia|years of experience")?.match(/^\d{1,2}(?:[.,]5)?$/)?.[0];
  if (years && Number(years.replace(",", ".")) <= 80) fields.years = years.replace(",", ".");
  const experience = section(/^(experiencia(?: laboral| profesional)?|historial laboral|work experience|employment(?: history)?)\s*:?$/);
  const companies = labelled("empresas?(?: anteriores)?|companies|empresa actual");
  if (companies || experience) fields.companies = (companies || experience).slice(0, 3000);
  const availability = labelled("disponibilidad|availability");
  const profile = section(/^(perfil(?: profesional)?|sobre mi|resumen|profile|summary)\s*:?$/);
  const availabilitySection = section(/^(disponibilidad|availability)\s*:?$/);
  const details = [profile, availability || availabilitySection].filter(Boolean).join("\n\n");
  if (details) fields.availability = details.slice(0, 3000);
  const sectorText = normalize(labelled("sector") || experience || profile);
  const sectors: [string, RegExp][] = [
    ["Hoteles", /\bhotel(?:es)?\b/], ["Restaurantes", /\brestaurante?s?\b/],
    ["Catering", /\bcatering\b/], ["Eventos", /\beventos?\b/],
    ["Limpieza y housekeeping", /\blimpieza\b|\bhousekeeping\b/],
  ];
  const matches = sectors.filter(([, pattern]) => pattern.test(sectorText));
  if (matches.length === 1) fields.sector = matches[0][0];
  if (/\bsin experiencia(?: previa| laboral)?\b/i.test(joined) && !experience) {
    fields.years ??= "0";
    fields.sector ??= "Sin experiencia previa";
    fields.companies ??= "Sin experiencia";
  }
  return fields;
}
