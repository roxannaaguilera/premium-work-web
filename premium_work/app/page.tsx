import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { SectorsAccordion } from "@/components/SectorsAccordion";
import { ServicesIntro } from "@/components/ServicesIntro";
import { WhyUs } from "@/components/WhyUs";

export default function Home() {
  return <main className="overflow-hidden"><Navbar /><Hero /><ServicesIntro /><Features /><WhyUs /><SectorsAccordion /><Footer /></main>;
}
