import FixedHeader from "@/components/chrome/FixedHeader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

/**
 * Principal: solo el header. El resto del sitio vive en sus propias
 * vistas (servicios, nosotros, solicitar servicio), a las que se
 * llega desde el menú del header.
 */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <FixedHeader />
      <main className="min-h-screen bg-[#faf6ee]" />
    </>
  );
}
