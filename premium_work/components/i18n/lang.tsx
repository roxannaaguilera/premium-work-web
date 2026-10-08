"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dicts, type Dict, type Lang } from "./dict";

type TFn = (key: string, vars?: Record<string, string | number>) => string;

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TFn;
  dict: Dict;
}

const LangContext = createContext<LangCtx | null>(null);

function get(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o != null && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pw-lang");
      if (saved === "en" || saved === "es") setLangState(saved);
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("pw-lang", l); } catch { /* noop */ }
  };

  const dict = dicts[lang];
  const t: TFn = (key, vars) => {
    let s: unknown = get(dict, key);
    if (typeof s !== "string") s = get(dicts.es, key);
    if (typeof s !== "string") return key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = (s as string).replace(`{${k}}`, String(v));
    return s as string;
  };

  return <LangContext.Provider value={{ lang, setLang, t, dict }}>{children}</LangContext.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
