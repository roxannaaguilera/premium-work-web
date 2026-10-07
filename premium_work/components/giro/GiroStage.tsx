"use client";

import dynamic from "next/dynamic";

const ServiceRotator = dynamic(
  () => import("./ServiceRotator").then((mod) => mod.ServiceRotator),
  { ssr: false },
);

export function GiroStage() {
  return <ServiceRotator />;
}
