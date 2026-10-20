"use client";

import Link from "next/link";
import FixedHeader from "@/components/chrome/FixedHeader";
import { useLang } from "@/components/i18n/lang";

/**
 * Vista de servicios: índice de los ocho sectores, cada uno enlaza
 * a su página de detalle en /servicios/<slug>.
 */
export default function ServiciosPage() {
  const { dict } = useLang();
  const items = dict.serviceDetail.items;

  return (
    <>
      <FixedHeader />
      <main className="min-h-dvh overflow-x-clip bg-[#faf6ee] px-4 pb-24 pt-28 text-[#131834] md:px-16 md:pt-52">
        <p className="eyebrow flex items-center gap-2 text-[#131834]/60">
          <span className="text-[#eab308]" aria-hidden="true">◆</span> {dict.header.nav[1]}
        </p>
        <ul className="mt-10 md:mt-14">
          {items.map((item, i) => (
            <li key={item.slug} className="border-t border-[#131834]/15 last:border-b">
              <Link
                href={`/servicios/${item.slug}`}
                className="group flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1 py-5 md:gap-x-6 md:py-7"
              >
                <span className="font-mono text-sm text-[#131834]/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 font-serif text-[clamp(1.7rem,8vw,3.5rem)] font-semibold leading-tight transition-colors group-hover:text-[#eab308] md:text-6xl">
                  {dict.sectors.items[i].title}
                </span>
                <span className="w-full text-sm text-[#131834]/60 md:w-auto md:text-base">
                  {item.tagline}
                </span>
                <span aria-hidden="true" className="ml-auto transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
