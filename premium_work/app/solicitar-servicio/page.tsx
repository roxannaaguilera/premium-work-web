const sectorLabels: Record<string, string> = {
  hoteles: "Hoteles",
  restaurantes: "Restaurantes",
  catering: "Catering",
  "eventos-corporativos": "Eventos corporativos",
  congresos: "Congresos",
  ferias: "Ferias",
  "eventos-deportivos": "Eventos deportivos",
  festivales: "Festivales",
  "bodas-y-celebraciones": "Bodas y celebraciones",
  "espacios-culturales": "Espacios culturales",
  "clubs-y-ocio": "Clubs y ocio",
  "experiencias-privadas": "Experiencias privadas",
};

export default async function RequestServicePage({ searchParams }: { searchParams: Promise<{ sector?: string }> }) {
  const { sector } = await searchParams;
  const selectedSector = sector && sectorLabels[sector] ? sectorLabels[sector] : "";

  return (
    <main className="min-h-screen bg-[#F8F7F4] px-5 py-32 text-[#0B1F3A] md:px-8">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
        <div>
          <p className="eyebrow text-[#C9A227]">◆ Solicita un servicio</p>
          <h1 className="display mt-6 max-w-xl text-5xl leading-[.92] md:text-7xl">Cuéntanos qué necesitas.</h1>
          <p className="mt-7 max-w-md text-base leading-7 text-[#0B1F3A]/70">Prepararemos una propuesta adaptada a las necesidades de tu empresa y evento.</p>
        </div>
        <form className="border border-[#0B1F3A]/15 bg-white p-6 md:p-10">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="text-sm font-bold">Nombre y apellidos<input required name="name" className="mt-2 w-full border-b border-[#0B1F3A]/25 bg-transparent py-3 font-normal outline-none transition focus:border-[#C9A227]" /></label>
            <label className="text-sm font-bold">Empresa<input required name="company" className="mt-2 w-full border-b border-[#0B1F3A]/25 bg-transparent py-3 font-normal outline-none transition focus:border-[#C9A227]" /></label>
            <label className="text-sm font-bold">Email<input required type="email" name="email" className="mt-2 w-full border-b border-[#0B1F3A]/25 bg-transparent py-3 font-normal outline-none transition focus:border-[#C9A227]" /></label>
            <label className="text-sm font-bold">Teléfono<input type="tel" name="phone" className="mt-2 w-full border-b border-[#0B1F3A]/25 bg-transparent py-3 font-normal outline-none transition focus:border-[#C9A227]" /></label>
            <label className="text-sm font-bold sm:col-span-2">Sector<select name="sector" defaultValue={selectedSector} className="mt-2 w-full border-b border-[#0B1F3A]/25 bg-transparent py-3 font-normal outline-none transition focus:border-[#C9A227]"><option value="">Selecciona un sector</option>{Object.values(sectorLabels).map((label) => <option key={label}>{label}</option>)}</select></label>
            <label className="text-sm font-bold sm:col-span-2">¿En qué podemos ayudarte?<textarea required name="message" rows={5} className="mt-2 w-full resize-none border-b border-[#0B1F3A]/25 bg-transparent py-3 font-normal outline-none transition focus:border-[#C9A227]" /></label>
          </div>
          <label className="mt-7 flex gap-3 text-sm leading-5 text-[#0B1F3A]/70"><input required type="checkbox" className="mt-1 accent-[#C9A227]" />Acepto la política de privacidad y el tratamiento de mis datos para atender esta solicitud.</label>
          <button type="button" className="mt-8 w-full rounded-full bg-[#C9A227] px-6 py-4 text-sm font-bold text-[#0B1F3A] transition hover:-translate-y-0.5 hover:bg-[#e2be3d] active:translate-y-0">ENVIAR SOLICITUD</button>
          <p className="mt-4 text-xs leading-5 text-[#0B1F3A]/50">El envío del formulario se activará al conectar la base de datos y el servicio de correo.</p>
        </form>
      </div>
    </main>
  );
}
