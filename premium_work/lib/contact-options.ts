import cities from "./spanish-cities.json";
import { parsePhoneNumberFromString, isSupportedCountry, type CountryCode } from "libphonenumber-js";

export const spanishCities = cities.toSorted((a, b) => a.localeCompare(b, "es"));
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const cityNames = new Map<string, string>();
for (const city of spanishCities) {
  cityNames.set(normalize(city), city);
  for (const alias of city.split("/")) {
    cityNames.set(normalize(alias), city);
    const inverted = alias.match(/^(.+), (.+)$/);
    if (inverted) cityNames.set(normalize(`${inverted[2]} ${inverted[1]}`), city);
  }
}
export function resolveCity(value: string) { return cityNames.get(normalize(value)); }
export function phoneParts(value: string, country: CountryCode = "ES") {
  const parsed = parsePhoneNumberFromString(value.replace(/^00/, "+"), country);
  return parsed ? { country: parsed.country || country, number: String(parsed.nationalNumber) } : { country, number: value };
}
export function normalizedPhone(value: string, country: unknown = "ES") {
  if (!value.trim()) return "";
  if (typeof country !== "string" || !isSupportedCountry(country)) return null;
  if (!/^\+?[\d\s().-]+$/.test(value.trim())) return null;
  const parsed = parsePhoneNumberFromString(value.trim().replace(/^00/, "+"), country as CountryCode);
  return parsed?.isPossible() ? String(parsed.number) : null;
}
