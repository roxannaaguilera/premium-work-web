"use client";

import { useId, useState, type FocusEvent, type FormEvent } from "react";
import { validateForm, type FieldErrors, type FormKind } from "@/lib/form-validation";

export function useFormValidation(kind: FormKind) {
  const id = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  function validate(form: HTMLFormElement) {
    const next = validateForm(kind, Object.fromEntries(new FormData(form)));
    for (const control of form.elements) {
      if (control instanceof HTMLInputElement && control.validity.badInput) next[control.name] = "Introduce un valor válido.";
    }
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
    return !first;
  }
  function onBlur(event: FocusEvent<HTMLFormElement>) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
    if (!target.name) return;
    const next = validateForm(kind, Object.fromEntries(new FormData(event.currentTarget)));
    setErrors(previous => ({ ...previous, [target.name]: next[target.name] || "" }));
  }
  function onChange(event: FormEvent<HTMLFormElement>) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) || !target.name || !errors[target.name]) return;
    const next = validateForm(kind, Object.fromEntries(new FormData(event.currentTarget)));
    setErrors(previous => ({ ...previous, [target.name]: next[target.name] || "" }));
  }
  return {
    validate, onBlur, onChange, setErrors,
    props: (name: string) => ({ "aria-invalid": !!errors[name], "aria-describedby": errors[name] ? `${id}-${name}` : undefined }),
    error: (name: string) => errors[name] ? <span id={`${id}-${name}`} className="mt-2 block text-sm font-normal text-red-200">{errors[name]}</span> : null,
  };
}
