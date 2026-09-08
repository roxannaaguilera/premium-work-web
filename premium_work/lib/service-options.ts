export const serviceLabels: Record<string, string> = {
  camareros: "Camareros/as", maitres: "Maîtres", "office-y-housekeeping": "Office y Housekeeping",
  hostess: "Hostess", "personal-de-cocina": "Personal de cocina", supervisores: "Supervisores",
};
export const sectorLabels: Record<string, string> = {
  hoteles: "Hoteles", restaurantes: "Restaurantes", catering: "Catering",
  "eventos-corporativos": "Eventos corporativos", congresos: "Congresos", ferias: "Ferias",
  "eventos-deportivos": "Eventos deportivos", festivales: "Festivales",
  "bodas-y-celebraciones": "Bodas y celebraciones", "espacios-culturales": "Espacios culturales",
  "clubs-y-ocio": "Clubs y ocio", "experiencias-privadas": "Experiencias privadas", otro: "Otro",
};

export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
