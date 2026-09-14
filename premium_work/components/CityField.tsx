import { spanishCities } from "@/lib/contact-options";
import type { InputHTMLAttributes, ReactNode } from "react";

const options = spanishCities.map(city => <option key={city} value={city}>{city}</option>);

export function CityField({ label, field, validation, error }: { label: string; field: string; validation: Pick<InputHTMLAttributes<HTMLInputElement>, "aria-invalid" | "aria-describedby">; error: ReactNode }) {
  return <label className="text-sm font-bold">{label} *
    <select required name="city" autoComplete="address-level2" defaultValue="" {...validation} className={field}>
      <option value="">Selecciona una ciudad de España</option>
      {options}
    </select>
    {error}
  </label>;
}
