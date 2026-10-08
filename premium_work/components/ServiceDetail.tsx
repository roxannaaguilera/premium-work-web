"use client";

import Link from "next/link";
import FixedHeader from "@/components/chrome/FixedHeader";
import { Footer } from "@/components/Footer";
import { useLang } from "@/components/i18n/lang";

/** Divide un título en dos líneas equilibradas (p. ej. EVENTOS / PRIVADOS). */
function splitTitle(title: string): string[] {
  const words = title.split(" ");
  if (words.length === 1) return [title];
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    const b = words.slice(i).join(" ").length;
    const d = Math.abs(a - b);
    if (d < bestDiff) {
      bestDiff = d;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

export default function ServiceDetail({ slug }: { slug: string }) {
  const { dict } = useLang();
  const items = dict.serviceDetail.items;
  const idx = items.findIndex((i) => i.slug === slug);
  const item = items[idx];
  const sector = dict.sectors.items[idx];
  const lines = splitTitle(sector.title.toUpperCase());

  return (
    <>
      <FixedHeader />
      <main className="bg-[#fdf3eb] text-[#131834]">
        {/* Nombre gigante + elemento: cada uno ocupa media pantalla */}
        <section aria-label={sector.title} className="px-5 md:px-10 pt-40 md:pt-48">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#131834]/60 hover:text-[#131834] transition-colors"
          >
            <span aria-hidden="true">←</span> {dict.serviceDetail.back}
          </Link>
          <h1 className="mt-6 font-serif font-semibold uppercase leading-[0.9] tracking-tight text-[#131834] text-[clamp(3.5rem,13vw,12rem)]">
            {lines.map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-xl md:text-2xl italic text-[#131834]/80">
            {item.tagline}
          </p>
          <div className="flex min-h-[50vh] items-end justify-center py-10">
            <img
              src={item.img}
              alt={sector.title}
              className="h-[46vh] w-auto object-contain drop-shadow-[0_30px_40px_rgba(19,24,52,0.18)]"
            />
          </div>
        </section>

        {/* Descripción y qué incluye */}
        <section className="px-5 md:px-10 py-14 md:py-20">
          <p className="max-w-3xl text-lg md:text-xl leading-relaxed text-[#131834]/85">
            {sector.copy}
          </p>
          <h2 className="mt-12 text-xs font-bold uppercase tracking-[0.35em] text-[#131834]/60">
            {dict.serviceDetail.includesTitle}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 max-w-4xl">
            {item.includes.map((inc) => (
              <li key={inc} className="flex items-start gap-3 text-base md:text-lg">
                <span aria-hidden="true" className="mt-2 inline-block h-2.5 w-2.5 shrink-0 rotate-45 bg-[#d9a83f]" />
                <span>{inc}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/solicitar-servicio?sector=${slug}`}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#131834] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#faf6ee] transition-colors hover:bg-[#1e2450]"
          >
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rotate-45 bg-[#eab308]" />
            {dict.serviceDetail.cta}
          </Link>
        </section>

        {/* Los otros servicios */}
        <section className="border-t border-[#131834]/10 px-5 md:px-10 py-14 md:py-20">
          <h2 className="text-xs font-bold uppercase tracking-[0.35em] text-[#131834]/60">
            {dict.serviceDetail.otherTitle}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items
              .filter((o) => o.slug !== slug)
              .map((o) => {
                const oi = items.indexOf(o);
                return (
                  <Link
                    key={o.slug}
                    href={`/servicios/${o.slug}`}
                    className="group rounded-2xl bg-[#faf6ee] p-5 transition-transform hover:-translate-y-1"
                  >
                    <img src={o.img} alt="" className="mx-auto h-28 w-auto object-contain transition-transform group-hover:scale-105" />
                    <p className="mt-4 text-center text-sm font-bold uppercase tracking-wider text-[#131834]">
                      {dict.sectors.items[oi].title}
                    </p>
                  </Link>
                );
              })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
