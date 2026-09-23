import { ClientsCarousel } from "@/components/ClientsCarousel";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { ServicesIntro } from "@/components/ServicesIntro";
import { Stats } from "@/components/Stats";
import { WhyUs } from "@/components/WhyUs";

export default function Home() {
  return <main className="overflow-hidden"><Navbar /><Hero /><ServicesIntro /><Features /><WhyUs /><Stats /><ClientsCarousel /><Footer /></main>;
}
