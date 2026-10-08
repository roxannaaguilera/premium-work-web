"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/components/i18n/lang";

const SLUGS = ["hoteles", "restaurantes", "catering", "eventos-corporativos", "eventos-deportivos", "festivales", "bodas-y-celebraciones", "experiencias-privadas"];

export function SectorsAccordion() {
  const { t, dict } = useLang();
  const [open, setOpen] = useState<number | null>(0);
  const sectors = dict.sectors.items.map((s, i) => ({ ...s, slug: SLUGS[i] }));

  return (
    <section aria-label={t("sectors.aria")} className="relative overflow-hidden bg-white py-10 md:py-16">
      <div aria-hidden="true" className="hero-dots pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] gap-6 px-5 md:gap-12 md:px-8 lg:grid-cols-[1fr_1.5fr] lg:gap-24 lg:px-10">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow flex items-center gap-2 text-[#131313]/60">
            <span className="text-[#eab308]" aria-hidden="true">◆</span> {t("sectors.eyebrow")}
          </p>
          <h2 className="display mt-4 text-3xl leading-[1.02] text-[#131313] md:mt-6 md:text-[clamp(2.5rem,5vw,4.5rem)]">
            {t("sectors.titleA")}<br />{t("sectors.titleB")}
          </h2>
          <p className="mt-6 hidden max-w-md text-base leading-7 text-[#131313]/70 md:block">
            {t("sectors.copy")}
          </p>
          <a
            href="/solicitar-servicio"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2451e6] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1b45c4] md:mt-8"
          >
            {t("sectors.cta")} <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>

        <div className="border-t border-[#131313]/15">
          {sectors.map((sector, index) => {
            const isOpen = open === index;
            return (
              <div key={sector.slug} className="border-b border-[#131313]/15">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`sector-panel-${sector.slug}`}
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="group flex w-full items-center justify-between gap-6 py-3 text-left md:py-4"
                >
                  <span className={`display text-xl transition-colors md:text-[1.75rem] ${isOpen ? "text-[#173aab]" : "text-[#131313] group-hover:text-[#173aab]"}`}>
                    {sector.title}
                  </span>
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-all md:size-10 ${isOpen ? "rotate-180 border-[#2451e6] bg-[#2451e6] text-white" : "border-[#131313]/25 text-[#131313]/70 group-hover:border-[#173aab]/60"}`}>
                    <ChevronDown size={20} aria-hidden="true" />
                  </span>
                </button>
                <div
                  id={`sector-panel-${sector.slug}`}
                  role="region"
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-7 pr-4 md:pr-16">
                      <p className="max-w-xl text-base leading-7 text-[#131313]/70">{sector.copy}</p>
                      <a
                        href={`/solicitar-servicio?sector=${sector.slug}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#173aab] transition hover:gap-3"
                      >
                        {t("sectors.requestFor")} {sector.title.toLowerCase()} <ArrowRight size={16} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
