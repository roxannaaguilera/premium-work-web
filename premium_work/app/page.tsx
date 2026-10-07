import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectorsAccordion } from "@/components/SectorsAccordion";
import { ServicesIntro } from "@/components/ServicesIntro";
import { WhyUs } from "@/components/WhyUs";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { AnimatedHero } from "@/components/motion/AnimatedHero";
import { DayJourney } from "@/components/motion/DayJourney";
import { FloatingShowcase } from "@/components/motion/FloatingShowcase";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <SmoothScroll />
      <Navbar />
      <AnimatedHero />
      <DayJourney />
      <FloatingShowcase />
      <ServicesIntro />
      <Features />
      <WhyUs />
      <SectorsAccordion />
      <Footer />
    </main>
  );
}
