import { ClientsCarousel } from "@/components/ClientsCarousel";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { ServicesIntro } from "@/components/ServicesIntro";
import { Testimonials } from "@/components/Testimonials";
import { WhyUs } from "@/components/WhyUs";

export default function Home() {
  return <main className="overflow-hidden"><Navbar /><Hero /><ServicesIntro /><Features /><WhyUs /><ClientsCarousel /><Testimonials /><Footer /></main>;
}
