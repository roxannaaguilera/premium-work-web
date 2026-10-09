"use client";

import { createContext, useContext } from "react";

export type StagePose = "home" | "service";

type StageApi = {
  go: (href: string) => void;
  pose: StagePose;
};

const StageContext = createContext<StageApi | null>(null);

export function StageProvider({ value, children }: { value: StageApi; children: React.ReactNode }) {
  return <StageContext.Provider value={value}>{children}</StageContext.Provider>;
}

export function useStage(): StageApi {
  const ctx = useContext(StageContext);
  if (ctx) return ctx;
  return {
    pose: "home",
    go: (href: string) => {
      window.location.assign(href);
    },
  };
}
