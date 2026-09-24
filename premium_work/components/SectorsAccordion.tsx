"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";

const sectors = [
  {
    title: "Hoteles",
    slug: "hoteles",
    copy: "Camareros, maîtres, hostess y personal de housekeeping seleccionados y supervisados para el día a día del hotel y sus eventos.",
  },
  {
    title: "Restaurantes",
    slug: "restaurantes",
    copy: "Refuerzos de sala y cocina que se integran con agilidad en tu equipo, trabajando con los estándares de tu casa.",
  },
  {
    title: "Catering",
    slug: "catering",
    copy: "Equipos completos de sala, cocina y office para servicios dentro y fuera de tus instalaciones.",
  },
  {
    title: "Eventos corporativos",
    slug: "eventos-corporativos",
    copy: "Personal de recepción, sala y coordinación para congresos, convenciones y actos de empresa.",
  },
  {
    title: "Eventos deportivos",
    slug: "eventos-deportivos",
    copy: "Equipos ágiles para hospitality, palcos y zonas VIP en competiciones y torneos.",
  },
  {
    title: "Festivales",
    slug: "festivales",
    copy: "Refuerzos numerosos y supervisados para barras, accesos y zonas de restauración.",
  },
  {
    title: "Bodas y celebraciones",
    slug: "bodas-y-celebraciones",
    copy: "Maîtres, camareros y hostess con la presencia y el cuidado que exige un día único.",
  },
  {
    title: "Eventos privados",
    slug: "experiencias-privadas",
    copy: "Discreción y excelencia para celebraciones privadas, con un solo interlocutor.",
  },
];

export function SectorsAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-label="Sectores en los que trabajamos" className="relative overflow-hidden bg-white py-10 md:py-32">
      <div aria-hidden="true" className="hero-dots pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] gap-6 px-5 md:gap-12 md:px-8 lg:grid-cols-[1fr_1.5fr] lg:gap-24 lg:px-10">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow flex items-center gap-2 text-[#131313]/60">
            <span className="text-[#6e7a10]" aria-hidden="true">◆</span> Sectores
          </p>
          <h2 className="display mt-4 text-3xl leading-[1.02] text-[#131313] md:mt-6 md:text-[clamp(2.5rem,5vw,4.5rem)]">
            ¿Dónde<br />trabajamos?
          </h2>
          <p className="mt-6 hidden max-w-md text-base leading-7 text-[#131313]/70 md:block">
            Llevamos profesionales seleccionados, formados y supervisados a cada tipo de espacio y evento.
          </p>
          <a
            href="/solicitar-servicio"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d2d943] px-6 py-3.5 text-sm font-bold text-[#131313] transition hover:-translate-y-0.5 hover:bg-[#e0e753] md:mt-8"
          >
            Solicitar servicio <ArrowRight size={18} aria-hidden="true" />
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
                  className="group flex w-full items-center justify-between gap-6 py-3 text-left md:py-7"
                >
                  <span className={`display text-xl transition-colors md:text-[1.75rem] ${isOpen ? "text-[#6e7a10]" : "text-[#131313] group-hover:text-[#6e7a10]"}`}>
                    {sector.title}
                  </span>
                  <span className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-all md:size-10 ${isOpen ? "rotate-180 border-[#d2d943] bg-[#d2d943] text-[#131313]" : "border-[#131313]/25 text-[#131313]/70 group-hover:border-[#6e7a10]/60"}`}>
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
                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#6e7a10] transition hover:gap-3"
                      >
                        Solicitar servicio para {sector.title.toLowerCase()} <ArrowRight size={16} aria-hidden="true" />
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
