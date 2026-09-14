import { legal, legalValue } from "@/lib/legal";

export function PrivacySummary({ candidate = false }: { candidate?: boolean }) {
  return <div className="space-y-2 text-xs leading-5 text-white/85 sm:col-span-2">
    <p><strong>Responsable:</strong> {legal.owner || "Titular de Premium Work pendiente de identificar en el aviso legal"}.</p>
    <p><strong>Finalidad y base:</strong> {candidate ? "gestionar tu candidatura espontánea y contactar contigo sobre oportunidades laborales, con tu consentimiento, que puedes retirar." : "atender tu solicitud y preparar una propuesta; medidas precontractuales a petición del interesado y, para contactos de empresas, interés legítimo en la relación profesional."}</p>
    <p><strong>Conservación:</strong> {legalValue(candidate ? legal.candidateRetention : legal.clientRetention)}</p>
    <p><strong>Destinatarios:</strong> personal autorizado y proveedores técnicos para prestar el servicio, incluido Supabase. Consulta los detalles y las transferencias en la política completa.</p>
    <p><strong>Derechos:</strong> acceso, rectificación, supresión y otros derechos explicados en la <a href="/politica-de-privacidad" className="underline underline-offset-2">política de privacidad</a>. Puedes dirigirte a <a href={`mailto:${legal.email}`} className="underline">{legal.email}</a>.</p>
  </div>;
}
