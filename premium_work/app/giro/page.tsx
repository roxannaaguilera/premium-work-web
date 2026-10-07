import type { Metadata } from "next";
import { GiroStage } from "@/components/giro/GiroStage";

export const metadata: Metadata = {
  title: "Giro | Premium Work",
  description: "Servicios Premium Work. Desplaza o arrastra para traer el siguiente al frente.",
};

export default function GiroPage() {
  return <GiroStage />;
}
