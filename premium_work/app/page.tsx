import FixedHeader from "@/components/chrome/FixedHeader";
import Preloader from "@/components/chrome/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import AgrumeaHero from "@/components/motion/AgrumeaHero";
import ServiceOverlay from "@/components/ServiceOverlay";

/**
 * Principal: header + la escena del héroe con los objetos 3D (con su
 * intro de telón y la caída del objeto). El resto de secciones vive
 * en sus propias vistas (/servicios, /nosotros, /solicitar-servicio),
 * a las que se llega desde el menú del header.
 */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Preloader />
      <FixedHeader />
      <main className="overflow-x-clip bg-[#faf6ee]">
        <AgrumeaHero />
      </main>
      <ServiceOverlay />
    </>
  );
}
