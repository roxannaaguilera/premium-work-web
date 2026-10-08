import type { useFormValidation } from "@/components/useFormValidation";
import { useLang } from "@/components/i18n/lang";

export function FormConsent({ candidate = false, validation }: { candidate?: boolean; validation: ReturnType<typeof useFormValidation> }) {
  const { t } = useLang();
  return <div className="sm:col-span-2">
    <label className="flex items-start gap-3 text-sm leading-6">
      <input required type="checkbox" name="consent" {...validation.props("consent")} className="mt-1.5 h-4 w-4 shrink-0 accent-[#131313]" />
      <span>{candidate ? t("candidateForm.consent") : t("clientForm.consent")} * {" "}
        <a href="/politica-de-privacidad" className="underline underline-offset-2">{t("clientForm.privacyPolicy")}</a>
      </span>
    </label>
    {validation.error("consent")}
  </div>;
}
