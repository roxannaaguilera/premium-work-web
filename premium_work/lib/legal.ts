// DATOS FICTICIOS EXCLUSIVAMENTE PARA PRUEBAS.
// Sustituir por información legal real antes de publicar.

export const legal = {
  brand: "Premium Work",

  owner: "Premium Work Servicios Profesionales, S.L.",
  taxId: "B12345678",
  address: "Calle Ejemplo 123, 28000 Madrid, España",

  registry:
    "Sociedad ficticia. Datos registrales utilizados exclusivamente para pruebas.",

  email: "hola@premiumwork.es",

  candidateRetention:
    "Los datos de candidatos se conservarán durante 12 meses desde la recepción de la candidatura.",

  clientRetention:
    "Los datos de clientes se conservarán durante la relación comercial y durante los plazos legalmente aplicables.",

  hosting: "Vercel",

  supabaseRegion: "Europa",

  internationalTransfers:
    "Configuración ficticia utilizada exclusivamente para pruebas. Pendiente de verificar los proveedores, regiones y mecanismos aplicables.",

  reviewed: true,
};

export const PRIVACY_VERSION = "2026-09-10.1";

export function legalReady() {
  return (
    legal.reviewed &&
    [
      legal.owner,
      legal.taxId,
      legal.address,
      legal.registry,
      legal.candidateRetention,
      legal.clientRetention,
      legal.hosting,
      legal.supabaseRegion,
      legal.internationalTransfers,
    ].every((value) => value.trim())
  );
}

export const legalValue = (value: string) =>
  value || "Pendiente de completar por el titular antes de publicar.";