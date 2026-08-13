"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
const services = [
  ["Camareros", "Profesionales de sala atentos, ágiles y alineados con la atmósfera de cada servicio.", "camareros"],
  ["Maîtres", "Dirección de sala con criterio, presencia y la serenidad que requieren los momentos importantes.", "maitres"],
  ["Bartenders", "Técnica, hospitalidad y ritmo detrás de cada barra, desde un cóctel privado a un gran evento.", "bartenders"],
  ["Hostess", "Una bienvenida cuidada y una atención impecable para invitados, asistentes y equipos.", "hostess"],
  ["Personal de cocina", "Apoyo especializado para que la operación fluya con orden, precisión y excelencia.", "personal-de-cocina"],
  ["Supervisores", "Coordinación en terreno para que cada detalle esté donde debe estar, en el momento adecuado.", "supervisores"],
];
export function Features() { return <section id="servicios" className="section-pad bg-[#F8F7F4]"><div className="mx-auto max-w-[1280px] space-y-8">{services.map(([title, copy, slug], index) => <motion.article id={slug} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-100px"}} transition={{duration:.5}} style={{top:`${88 + index * 14}px`, zIndex:index + 1}} className="sticky grid min-h-[570px] overflow-hidden border border-[#0B1F3A]/25 bg-[#F8F7F4] shadow-[0_-1px_0_rgba(11,31,58,.05)] md:grid-cols-[1fr_.92fr]" key={title}>
  <div className="flex flex-col p-7 md:p-11"><p className="text-sm font-bold">{String(index + 1).padStart(2, "0")}</p><div className="my-auto max-w-md py-10"><h3 className="display text-5xl leading-none md:text-6xl">{title}</h3><p className="mt-7 text-base leading-7 text-[#0B1F3A]/75">{copy}</p><a href="#contacto" className="mt-9 inline-flex items-center gap-2 border-b border-[#0B1F3A] pb-1 text-sm font-bold">Ver servicio <ArrowUpRight size={16}/></a></div></div>
  <div className="photo-placeholder--light relative min-h-[300px] overflow-hidden md:min-h-0"><div className="absolute inset-8 border border-white/60"/><span className="absolute bottom-6 left-6 text-[10px] font-bold tracking-[.15em] text-[#0B1F3A]/50">TODO · /images/service-{String(index + 1).padStart(2,"0")}.jpg</span></div>
 </motion.article>)}</div></section>; }
