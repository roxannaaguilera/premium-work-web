import type { Metadata } from "next";
import ElementsCarousel from "@/components/three/ElementsCarousel";

export const metadata: Metadata = {
  title: "Sectores | Premium Work",
  description: "Los 8 sectores de Premium Work en 3D. Desplaza o arrastra para traer el siguiente al frente.",
};

export default function GiroPage() {
  return <ElementsCarousel />;
}
