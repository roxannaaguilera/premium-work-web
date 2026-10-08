import { notFound } from "next/navigation";
import ServiceDetail from "@/components/ServiceDetail";

const SLUGS = [
  "hoteles",
  "restaurantes",
  "catering",
  "eventos-corporativos",
  "eventos-deportivos",
  "festivales",
  "bodas-y-celebraciones",
  "experiencias-privadas",
];

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SLUGS.includes(slug)) notFound();
  return <ServiceDetail slug={slug} />;
}
