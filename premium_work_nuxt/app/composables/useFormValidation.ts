import { ref, type Ref } from "vue";
import { validateForm, type FieldErrors, type FormKind } from "~/utils/form-validation";

export interface FormValidation {
  errors: Ref<FieldErrors>;
  validate: (form: HTMLFormElement) => boolean;
  onBlur: (event: FocusEvent) => void;
  onChange: (event: Event) => void;
  setErrors: (next: FieldErrors) => void;
  props: (name: string) => { "aria-invalid": boolean; "aria-describedby": string | undefined };
  errorId: (name: string) => string;
}

/**
 * Equivalente Vue de useFormValidation (React).
 * Valida con validateForm() y expone errores reactivos + helpers de a11y.
 */
export function useFormValidation(kind: FormKind): FormValidation {
  const { t, lang } = useLang();
  const uid = `fv-${Math.random().toString(36).slice(2, 9)}`;
  const errors = ref<FieldErrors>({});

  function validate(form: HTMLFormElement): boolean {
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, unknown>;
    const next = validateForm(kind, data, lang.value);
    for (const control of form.elements) {
      if (control instanceof HTMLInputElement && control.validity.badInput) next[control.name] = t("validation.badInput");
    }
    errors.value = next;
    const first = Object.keys(next)[0];
    if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
    return !first;
  }

  function revalidateField(form: HTMLFormElement, name: string) {
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, unknown>;
    const next = validateForm(kind, data, lang.value);
    errors.value = { ...errors.value, [name]: next[name] || "" };
  }

  function onBlur(event: FocusEvent) {
    const target = event.target;
    const form = event.currentTarget;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
    if (!target.name || !(form instanceof HTMLFormElement)) return;
    revalidateField(form, target.name);
  }

  function onChange(event: Event) {
    const target = event.target;
    const form = event.currentTarget;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
    if (!target.name || !errors.value[target.name] || !(form instanceof HTMLFormElement)) return;
    revalidateField(form, target.name);
  }

  function setErrors(next: FieldErrors) {
    errors.value = next;
  }

  function errorId(name: string) {
    return `${uid}-${name}`;
  }

  function props(name: string) {
    return {
      "aria-invalid": !!errors.value[name],
      "aria-describedby": errors.value[name] ? errorId(name) : undefined,
    };
  }

  return { errors, validate, onBlur, onChange, setErrors, props, errorId };
}
