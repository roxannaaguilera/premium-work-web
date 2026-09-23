"use client";

import { useState, type FormEvent, type ReactNode } from "react";

export function EmailForm({ children, subject }: { children: ReactNode; subject: string }) {
  const [opened, setOpened] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = Array.from(data.entries()).map(([name, value]) => `${name}: ${value}`).join("\n");
    window.location.href = `mailto:hola@premiumwork.es?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }
  return <form onSubmit={submit} className="integrated-form text-[#131313]">
    {children}
    <p role="status" className="mt-4 text-xs leading-5 text-[#4a5264]">{opened ? "Se ha solicitado abrir tu aplicación de correo. Revisa el mensaje y envíalo para completar la solicitud. Si no se abre, escríbenos a hola@premiumwork.es." : "Al continuar se abrirá tu aplicación de correo con los datos de tu solicitud para que puedas revisarlos y enviarlos."}</p>
  </form>;
}
