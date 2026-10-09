import { Footer } from "@/components/Footer";
import { SectorsAccordion } from "@/components/SectorsAccordion";
import { WhyUs } from "@/components/WhyUs";
import { ContactSection } from "@/components/ContactSection";
import FixedHeader from "@/components/chrome/FixedHeader";
import Preloader from "@/components/chrome/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import AgrumeaHero from "@/components/motion/AgrumeaHero";
import ServiceOverlay from "@/components/ServiceOverlay";
import { DayJourney } from "@/components/motion/DayJourney";
import { FloatingShowcase } from "@/components/motion/FloatingShowcase";

/**
 * Home concepto Agrumea: header fijo + escena flotante a pantalla
 * completa animada por scroll, seguida del relato del día del evento,
 * el escaparate de servicios y el cierre comercial.
 */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Preloader />
      <FixedHeader />
      <main className="overflow-x-clip bg-[#faf6ee]">
        <AgrumeaHero />
        <DayJourney />
        <FloatingShowcase />
        <section id="nosotros" aria-label="Por qué Premium Work" className="scroll-mt-20">
          <WhyUs />
        </section>
        <SectorsAccordion />
        <ContactSection />
        <Footer />
      </main>
      <ServiceOverlay />
    </>
  );
}
