import { computed, watch, type ComputedRef, type Ref } from "vue";
import { useState } from "#app";
import { dicts, type Dict, type Lang } from "~~/i18n/dict";

export type { Dict, Lang };

type Vars = Record<string, string | number>;
type TFn = (key: string, vars?: Vars) => string;

export interface LangContext {
  lang: Ref<Lang>;
  setLang: (l: Lang) => void;
  t: TFn;
  dict: ComputedRef<Dict>;
}

const STORAGE_KEY = "pw-lang";

function get(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (o, k) =>
        o != null && typeof o === "object"
          ? (o as Record<string, unknown>)[k]
          : undefined,
      obj,
    );
}

/** Se registra una sola vez aunque useLang() se llame en muchos componentes. */
let clientHydrated = false;

/**
 * Equivalente Vue del hook `useLang()` de React.
 * Devuelve la misma API: { lang, setLang, t, dict }.
 *
 * - `lang` es un Ref<Lang> ("es" | "en"), compartido en SSR vía useState.
 * - `dict` es un ComputedRef<Dict> con el diccionario del idioma activo.
 * - `t("a.b.c", { var })` resuelve por ruta con puntos, interpola {var},
 *   cae a `es` si falta la clave y devuelve la clave si no existe.
 * - El idioma persiste en localStorage ("pw-lang") y sincroniza
 *   `document.documentElement.lang`, igual que la versión React.
 *
 * No necesita proveedor: en Nuxt basta con llamar useLang() en cualquier
 * componente o composable (el antiguo <LangRoot>/<LangProvider> no existe aquí).
 */
export function useLang(): LangContext {
  const lang = useState<Lang>(STORAGE_KEY, () => "es");

  if (import.meta.client && !clientHydrated) {
    clientHydrated = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "es") lang.value = saved;
    } catch {
      /* noop */
    }
    document.documentElement.lang = lang.value;
    watch(lang, (l) => {
      document.documentElement.lang = l;
    });
  }

  const setLang = (l: Lang): void => {
    lang.value = l;
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* noop */
    }
  };

  const dict = computed<Dict>(() => dicts[lang.value]);

  const t: TFn = (key, vars) => {
    let s: unknown = get(dict.value, key);
    if (typeof s !== "string") s = get(dicts.es, key);
    if (typeof s !== "string") return key;
    if (vars)
      for (const [k, v] of Object.entries(vars))
        s = (s as string).replace(`{${k}}`, String(v));
    return s as string;
  };

  return { lang, setLang, t, dict };
}
