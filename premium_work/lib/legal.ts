// Public legal information. Complete with verified business details before publication.
export const legal = {
  brand: "Premium Work",
  owner: "Premium Work",
  taxId: "NIF",
  address: "Madrid",
  registry: "N/A", // Enter registry details or explicitly state that registration does not apply.
  email: "hola@premiumwork.es",
  candidateRetention: "plazo definido",
  clientRetention: "plazo definido",
  hosting: "Vercel",
  supabaseRegion: "Europe",
  internationalTransfers: "Información Aplicable",
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