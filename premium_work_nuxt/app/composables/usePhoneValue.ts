import { computed, ref } from "vue";
import type { CountryCode } from "libphonenumber-js";
import { phoneParts } from "~/utils/contact-options";

export interface PhoneValue {
  number: import("vue").Ref<string>;
  country: import("vue").Ref<CountryCode>;
  setNumber: (v: string) => void;
  setCountry: (c: CountryCode) => void;
  fingerprint: import("vue").ComputedRef<string>;
  clear: () => void;
  importValue: (value: string) => string;
}

/** Equivalente Vue de usePhoneValue (React). */
export function usePhoneValue(): PhoneValue {
  const number = ref("");
  const country = ref<CountryCode>("ES");

  function setNumber(v: string) { number.value = v; }
  function setCountry(c: CountryCode) { country.value = c; }
  function clear() { number.value = ""; country.value = "ES"; }
  function importValue(value: string) {
    const next = phoneParts(value);
    number.value = next.number;
    country.value = next.country;
    return `${next.country}:${next.number}`;
  }

  const fingerprint = computed(() => `${country.value}:${number.value}`);

  return { number, country, setNumber, setCountry, fingerprint, clear, importValue };
}
