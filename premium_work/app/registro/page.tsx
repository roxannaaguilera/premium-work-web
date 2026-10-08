"use client";

import { Navbar } from "@/components/Navbar";
import { CandidateForm } from "@/components/CandidateForm";
import { useLang } from "@/components/i18n/lang";

export default function RegistrationPage() {
  const { t } = useLang();
  return <main className="service-request-surface relative min-h-screen px-5 pb-20 pt-44 text-[#131313] md:px-8 md:pt-48">
    <Navbar /><div className="form-separator" aria-hidden="true" />
    <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
      <div>
        <p className="eyebrow text-[#173aab]">{t("registerPage.eyebrow")}</p>
        <h1 className="display mt-6 text-5xl leading-[.92] md:text-7xl">{t("registerPage.title")}</h1>
        <p className="mt-7 max-w-md leading-7 text-[#4a5264]">{t("registerPage.copy")}</p>
      </div>
      <CandidateForm />
    </div>
  </main>;
}
