import { Footer } from "@/components/Footer";
import { SectorsAccordion } from "@/components/SectorsAccordion";
import { WhyUs } from "@/components/WhyUs";
import { ClientForm } from "@/components/ClientForm";
import FixedHeader from "@/components/chrome/FixedHeader";
import Preloader from "@/components/chrome/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import AgrumeaHero from "@/components/motion/AgrumeaHero";
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
        <section id="contacto" aria-label="Solicitar servicio" className="scroll-mt-20 bg-white">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
            <p className="text-xs tracking-[0.35em] uppercase text-[#131834]/60 font-semibold">
              Contacto
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-semibold text-[#131834]">
              Solicita tu equipo
            </h2>
            <p className="mt-4 text-[#131834]/70">
              Cuéntanos qué necesitas y te preparamos una propuesta a medida.
            </p>
            <div className="mt-8">
              <ClientForm />
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
