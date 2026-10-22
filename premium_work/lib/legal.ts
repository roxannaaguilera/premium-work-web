// Sin empresa registrada todavía en España: no se exhiben datos de responsable.
// Completar con la información legal real cuando la empresa esté registrada.

export const legal = {
  brand: "Premium Work",

  owner: "",
  taxId: "",
  address: "",

  registry: "",

  email: "hola@premiumwork.es",

  candidateRetention: "",

  clientRetention: "",

  hosting: "Vercel",

  supabaseRegion: "",

  internationalTransfers: "",

  reviewed: true,
};

export const PRIVACY_VERSION = "2026-10-22.1";

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