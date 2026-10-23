"use client";

import { useLang } from "@/components/i18n/lang";

// Canales de contacto públicos. Los formularios quedan conservados en el
// código pero no se sirven en público hasta que la empresa esté registrada.
const EMAIL = "hola@premiumwork.es";
const WHATSAPP_NUMBER = "34604858113";

export function DirectContact({
  kind,
  service,
  sector,
  center,
}: {
  kind: "client" | "candidate";
  service?: string;
  sector?: string;
  center?: boolean;
}) {
  const { t } = useLang();
  const detail = [service, sector].filter(Boolean).join(" — ");
  const waText =
    kind === "client"
      ? `${t("directContact.waClient")}${detail ? ` — ${detail}` : ""}.`
      : t("directContact.waCandidate");
  const mailSubject =
    kind === "client"
      ? `${t("directContact.mailSubjectClient")}${detail ? ` — ${detail}` : ""}`
      : t("directContact.mailSubjectCandidate");
  const mailBody =
    kind === "client"
      ? `${t("directContact.mailBodyClient")}${detail ? ` — ${detail}` : ""}.`
      : t("directContact.mailBodyCandidate");
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
  const mailHref = `mailto:${EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  const waButton = (
    <a
      href={waHref}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center rounded-full bg-[#131834] px-6 py-3 text-base font-semibold text-[#faf6ee] transition hover:bg-[#1e2450]"
    >
      {t("footer.whatsapp")} <span aria-hidden="true" className="ml-2">↗</span>
    </a>
  );
  const mailButton = (
    <a
      href={mailHref}
      className="inline-flex items-center justify-center rounded-full border border-[#131834]/25 px-6 py-3 text-base font-semibold text-[#131834] transition hover:border-[#131834]/60"
    >
      {t("directContact.emailButton")}: {EMAIL}
    </a>
  );
  return (
    <div className={center ? "text-center" : undefined}>
      <p className="text-base leading-7 text-[#4a5264]">
        {kind === "client" ? t("directContact.introClient") : t("directContact.introCandidate")}
      </p>
      <div className={`mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap ${center ? "items-center sm:justify-center" : ""}`}>
        {kind === "candidate" ? (
          <>
            {mailButton}
            {waButton}
          </>
        ) : (
          <>
            {waButton}
            {mailButton}
          </>
        )}
      </div>
      <p className="mt-6 text-sm text-[#4a5264]">{t("directContact.note")}</p>
    </div>
  );
}
