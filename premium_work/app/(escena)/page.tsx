import { Footer } from "@/components/Footer";
import { SectorsAccordion } from "@/components/SectorsAccordion";
import { WhyUs } from "@/components/WhyUs";
import { ContactSection } from "@/components/ContactSection";
import AgrumeaHero from "@/components/motion/AgrumeaHero";
import { DayJourney } from "@/components/motion/DayJourney";
import { FloatingShowcase } from "@/components/motion/FloatingShowcase";

/**
 * Home: el lienzo, el header y el telón viven en la cáscara.
 * Aquí solo cambia la capa HTML.
 */
export default function Home() {
  return (
    <main className="overflow-x-clip">
      <AgrumeaHero />
      <div className="pointer-events-auto">
        <DayJourney />
        <FloatingShowcase />
        <section id="nosotros" aria-label="Por qué Premium Work" className="scroll-mt-20">
          <WhyUs />
        </section>
        <SectorsAccordion />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
