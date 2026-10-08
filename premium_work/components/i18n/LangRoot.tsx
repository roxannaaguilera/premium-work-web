"use client";

import type { ReactNode } from "react";
import { LangProvider } from "./lang";

export function LangRoot({ children }: { children: ReactNode }) {
  return <LangProvider>{children}</LangProvider>;
}
