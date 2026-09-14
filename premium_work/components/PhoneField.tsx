"use client";

import { useId, useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js";
import * as flags from "country-flag-icons/react/3x2";
import { phoneParts } from "@/lib/contact-options";

const regionNames = new Intl.DisplayNames(["es"], { type: "region" });
const countries = getCountries().map(code => ({ code, name: regionNames.of(code) || code, dial: `+${getCountryCallingCode(code)}` })).sort((a, b) => a.name.localeCompare(b.name, "es"));

export function usePhoneValue() {
  const [number, setNumber] = useState("");
  const [country, setCountry] = useState<CountryCode>("ES");
  return { number, country, setNumber, setCountry,
    fingerprint: `${country}:${number}`,
    clear: () => { setNumber(""); setCountry("ES"); },
    importValue: (value: string) => { const next = phoneParts(value); setNumber(next.number); setCountry(next.country); return `${next.country}:${next.number}`; },
  };
}

export function PhoneField({ value, required = false, disabled = false, field, validation, error }: {
  value: ReturnType<typeof usePhoneValue>; required?: boolean; disabled?: boolean; field: string;
  validation: Pick<InputHTMLAttributes<HTMLInputElement>, "aria-invalid" | "aria-describedby">; error: ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const Flag = flags[value.country as keyof typeof flags];
  const selected = countries.find(country => country.code === value.country)!;
  const query = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const options = countries.filter(country => `${country.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")} ${country.dial}`.toLowerCase().includes(query));
  return <div className="min-w-0 text-sm font-bold">
    <label htmlFor={`${id}-phone`}>Teléfono{required ? " *" : " (opcional)"}</label>
    <div className="relative flex items-end gap-3" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={event => { if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); } }}>
      <input type="hidden" name="phone_country" value={value.country} />
      <button ref={trigger} type="button" disabled={disabled} aria-label={`País del teléfono: ${selected.name} ${selected.dial}`} aria-expanded={open} aria-controls={`${id}-countries`} aria-haspopup="dialog" onClick={() => { setSearch(""); setOpen(!open); }} className="flex min-h-12 shrink-0 items-center gap-2 border-b border-white/35 px-1 font-normal">
        {Flag && <Flag aria-hidden="true" className="h-4 w-6" />} {selected.dial} <span aria-hidden="true">▾</span>
      </button>
      <input id={`${id}-phone`} required={required} name="phone" type="tel" autoComplete="tel-national" maxLength={30} value={value.number} onChange={event => {
        const next = event.target.value;
        if (/^(\+|00)/.test(next)) value.importValue(next); else value.setNumber(next);
      }} {...validation} className={`${field} min-w-0`} />
      {open && <div id={`${id}-countries`} role="dialog" aria-label="Selecciona el país del teléfono" className="absolute left-0 top-full z-30 mt-2 w-full min-w-64 rounded-xl border border-[#C9A227] bg-[#0B1F3A] p-3 text-white shadow-xl">
        <input autoFocus type="search" aria-label="Buscar país o prefijo" placeholder="Buscar país o prefijo" value={search} onChange={event => setSearch(event.target.value)} className="mb-2 w-full rounded border border-white/40 bg-transparent p-2 font-normal" />
        <ul className="max-h-52 overflow-y-auto">{options.map(country => {
          const CountryFlag = flags[country.code as keyof typeof flags];
          return <li key={country.code}><button type="button" aria-pressed={country.code === value.country} onClick={() => { value.setCountry(country.code); setOpen(false); trigger.current?.focus(); }} className="flex min-h-11 w-full items-center gap-3 rounded px-2 py-2 text-left font-normal hover:bg-white/10 focus-visible:bg-white/10">
            {CountryFlag && <CountryFlag aria-hidden="true" className="h-4 w-6 shrink-0" />}<span className="flex-1">{country.name}</span><span>{country.dial}</span>
          </button></li>;
        })}</ul>
        {!options.length && <p className="py-3 font-normal">No se han encontrado países.</p>}
      </div>}
    </div>
    {error}
  </div>;
}
