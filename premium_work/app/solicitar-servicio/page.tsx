import { Navbar } from '@/components/Navbar';
import { ClientForm } from '@/components/ClientForm';
import { sectorLabels, serviceLabels } from '@/lib/service-options';

export default async function RequestServicePage({ searchParams }: { searchParams: Promise<{ sector?: string; servicio?: string }> }) {
  const { sector, servicio } = await searchParams;
  const selectedSector = sector && sectorLabels[sector] ? sector : "";

  return (
    <main className="service-request-surface relative min-h-screen px-5 pb-20 pt-44 text-[#131313] md:px-8 md:pt-48"><Navbar /><div className="form-separator" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
        <div>
          <p className="eyebrow text-[#6e7a10]">◆ Solicita un servicio</p>
          <h1 className="display mt-6 max-w-xl text-5xl leading-[.92] md:text-7xl">Cuéntanos qué necesitas.</h1>
          <p className="mt-7 max-w-md text-base leading-7 text-[#4a5264]">Prepararemos una propuesta adaptada a las necesidades de tu empresa y evento.</p>
        </div>
        <ClientForm sector={selectedSector} service={servicio && Object.hasOwn(serviceLabels, servicio) ? servicio : ""} />
      </div>
    </main>
  );
}
