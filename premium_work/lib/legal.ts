// Public legal information. Complete with verified business details before publication.
export const legal = {
  brand: "Premium Work",
  owner: "",
  taxId: "",
  address: "",
  registry: "", // Enter registry details or explicitly state that registration does not apply.
  email: "hola@premiumwork.es",
  candidateRetention: "",
  clientRetention: "",
  hosting: "Vercel",
  supabaseRegion: "",
  internationalTransfers: "",
  reviewed: false,
};
export const PRIVACY_VERSION = "2026-09-10.1";
export function legalReady() {
  return legal.reviewed && [legal.owner, legal.taxId, legal.address, legal.registry, legal.candidateRetention, legal.clientRetention, legal.hosting, legal.supabaseRegion, legal.internationalTransfers].every(value => value.trim());
}
export const legalValue = (value: string) => value || "Pendiente de completar por el titular antes de publicar.";
