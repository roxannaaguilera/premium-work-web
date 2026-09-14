import type { useFormValidation } from "@/components/useFormValidation";

export function FormConsent({ candidate = false, validation }: { candidate?: boolean; validation: ReturnType<typeof useFormValidation> }) {
  return <div className="sm:col-span-2">
    <label className="flex items-start gap-3 text-sm leading-6">
      <input required type="checkbox" name="consent" {...validation.props("consent")} className="mt-1.5 h-4 w-4 shrink-0 accent-[#C9A227]" />
      <span>{candidate ? "Consiento el tratamiento de mis datos y CV para gestionar mi candidatura y contactar conmigo sobre oportunidades laborales. Puedo retirar mi consentimiento." : "He leído la información de privacidad sobre la gestión de mi solicitud."} * {" "}
        <a href="/politica-de-privacidad" className="underline underline-offset-2">Política de privacidad</a>
      </span>
    </label>
    {validation.error("consent")}
  </div>;
}
