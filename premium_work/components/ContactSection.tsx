"use client";

import { ClientForm } from "@/components/ClientForm";
import { useLang } from "@/components/i18n/lang";

export function ContactSection() {
  const { t } = useLang();
  return (
    <section id="contacto" aria-label={t("contact.aria")} className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <p className="text-xs tracking-[0.35em] uppercase text-[#131834]/60 font-semibold">
          {t("contact.eyebrow")}
        </p>
        <h2 className="mt-3 font-serif text-3xl md:text-5xl font-semibold text-[#131834]">
          {t("contact.title")}
        </h2>
        <p className="mt-4 text-[#131834]/70">
          {t("contact.copy")}
        </p>
        <div className="mt-8">
          <ClientForm />
        </div>
      </div>
    </section>
  );
}
