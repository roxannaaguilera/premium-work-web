"use client";

import Link from "next/link";
import FixedHeader from "@/components/chrome/FixedHeader";
import { WhyUs } from "@/components/WhyUs";
import { DirectContact } from "@/components/DirectContact";
import { ServiceFooter } from "@/components/ServiceFooter";
import { useLang } from "@/components/i18n/lang";

/**
 * Vista «Nosotros»: página que vende Premium Work — titular, contacto
 * directo, por qué nosotros, sectores con enlace a cada detalle y cómo
 * trabajamos, cerrada con el footer de servicio.
 */
export default function NosotrosPage() {
  const { dict } = useLang();
  const items = dict.serviceDetail.items;

  return (
    <>
      <FixedHeader />
      <main className="bg-[#faf6ee] text-[#131834]">
        {/* Hero: la promesa + contacto directo */}
        <section className="px-5 pt-44 pb-16 md:px-16 md:pt-52 md:pb-24">
          <p className="eyebrow flex items-center gap-2 text-[#131834]/60">
            <span className="text-[#eab308]" aria-hidden="true">◆</span> {dict.about.eyebrow}
          </p>
          <h1 className="font-serif mt-6 max-w-5xl text-[clamp(2.75rem,6vw,6rem)] leading-[0.95] font-semibold tracking-[-0.01em]">
            {dict.about.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#131834]/70">
            {dict.about.copy}
          </p>
          <div className="mt-10 max-w-2xl">
            <DirectContact kind="client" />
          </div>
        </section>

        {/* Por qué nosotros */}
        <WhyUs />

        {/* Sectores: cada tarjeta lleva a su detalle */}
        <section className="bg-[#fbe5d4] px-5 py-16 md:px-16 md:py-24">
          <p className="eyebrow flex items-center gap-2 text-[#131834]/60">
            <span className="text-[#eab308]" aria-hidden="true">◆</span> {dict.sectors.eyebrow}
          </p>
          <h2 className="font-serif mt-4 max-w-4xl text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] font-semibold tracking-[-0.01em]">
            {dict.sectors.titleA}{dict.sectors.titleB}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#131834]/70">
            {dict.sectors.copy}
          </p>
          <ul className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <li key={item.slug}>
                <Link
                  href={`/servicios/${item.slug}`}
                  className="group block h-full rounded-2xl bg-[#faf6ee] p-6 transition duration-300 hover:-translate-y-1 md:p-8"
                >
                  <span className="font-mono text-sm text-[#131834]/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif mt-3 text-3xl leading-tight font-semibold">
                    {dict.sectors.items[i].title}
                  </h3>
                  <p className="mt-2 leading-7 text-[#131834]/70">
                    {dict.sectors.items[i].copy}
                  </p>
                  <span className="mt-4 inline-block font-semibold transition-colors group-hover:text-[#eab308]">
                    {dict.serviceDetail.discover} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Cómo trabajamos */}
        <section className="px-5 py-16 md:px-16 md:py-24">
          <p className="eyebrow flex items-center gap-2 text-[#131834]/60">
            <span className="text-[#eab308]" aria-hidden="true">◆</span> {dict.about.processTitle}
          </p>
          <ol className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-6">
            {dict.about.steps.map((step, i) => (
              <li key={step.title} className="border-t-2 border-[#131834]/15 pt-6">
                <p className="font-serif text-6xl leading-none font-semibold text-[#eab308]">
                  /{String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-serif mt-4 text-2xl leading-snug font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 leading-7 text-[#131834]/70">{step.copy}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <ServiceFooter />
    </>
  );
}
