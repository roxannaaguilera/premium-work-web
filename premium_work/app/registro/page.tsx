import { Navbar } from "@/components/Navbar";
import { CandidateForm } from "@/components/CandidateForm";


export default function RegistrationPage() {
  return <main className="service-request-surface relative min-h-screen px-5 pb-20 pt-44 text-[#131313] md:px-8 md:pt-48">
    <Navbar /><div className="form-separator" aria-hidden="true" />
    <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
      <div>
        <p className="eyebrow text-[#6e7a10]">Forma parte de Premium Work</p>
        <h1 className="display mt-6 text-5xl leading-[.92] md:text-7xl">Tu próximo paso empieza aquí.</h1>
        <p className="mt-7 max-w-md leading-7 text-[#4a5264]">Cuéntanos tu experiencia y disponibilidad para formar parte de nuestro equipo.</p>
      </div>
      <CandidateForm />
    </div>
  </main>;
}
