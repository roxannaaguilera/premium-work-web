"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/i18n/lang";

const CONSENT_KEY = "pw-cookie-consent";

/**
 * Ventana de cookies: solo en la primera visita. Al aceptar, guarda el
 * consentimiento en localStorage y no vuelve a aparecer.
 */
export default function CookieBanner() {
  const { t } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(CONSENT_KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    try {
      window.localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // Sin almacenamiento, la ventana volverá en la próxima visita.
    }
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label={t("cookies.policy")}
      className="fixed inset-x-4 bottom-4 z-[50] sm:left-6 sm:right-auto sm:max-w-md"
    >
      <div className="rounded-2xl bg-[#131834] p-5 text-[#faf6ee] shadow-2xl">
        <p className="text-sm leading-relaxed">{t("cookies.notice")}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-[#eab308] px-5 py-2 text-sm font-bold text-[#131834]"
          >
            {t("cookies.accept")}
          </button>
          <a href="/politica-de-cookies" className="text-sm underline underline-offset-4">
            {t("cookies.policy")}
          </a>
        </div>
      </div>
    </div>
  );
}
