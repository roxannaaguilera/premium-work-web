import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Lobby } from "@/components/Lobby";
import { Navbar } from "@/components/Navbar";
import { RoomFrame } from "@/components/RoomFrame";
import { SectorsAccordion } from "@/components/SectorsAccordion";
import { ServicesIntro } from "@/components/ServicesIntro";
import { WhyUs } from "@/components/WhyUs";

/**
 * Recorrido por el edificio Premium Work (Madrid):
 * I El Portal (Hero) → II El Vestíbulo (Lobby) → III La Sala de Servicios
 * → IV La Sala de Juntas → V Las Galerías → VI La Salida (Footer).
 */
export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />
      <Lobby />
      <RoomFrame
        numeral="III"
        name="La Sala de Servicios"
        tagline="Nuestras especialidades, presentadas como se merecen: cada oficio, una pieza de la casa."
        image="/images/sala-servicios.jpg"
        imageAlt="Salón de eventos preparado para una cena de gala"
      >
        <ServicesIntro />
        <Features />
      </RoomFrame>
      <RoomFrame
        numeral="IV"
        name="La Sala de Juntas"
        tagline="Aquí se toman las decisiones que marcan la diferencia en cada servicio."
        image="/images/sala-juntas.jpg"
        imageAlt="Sala de juntas con vistas a Madrid de noche"
      >
        <WhyUs />
      </RoomFrame>
      <RoomFrame
        numeral="V"
        name="Las Galerías"
        tagline="Un pasillo de puertas abiertas: cada sector, un espacio donde ya trabajamos."
        image="/images/edificio-galerias.jpg"
        imageAlt="Galería del edificio con puertas abiertas a cada sector"
      >
        <SectorsAccordion />
      </RoomFrame>
      <Footer />
    </main>
  );
}
