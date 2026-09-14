import type { Metadata } from "next";
import "./globals.css";
import { CookiePreferences } from "@/components/CookiePreferences";

export const metadata: Metadata = {
  title: "PREMIUM WORK | Profesionales que representan tu imagen",
  description: "Selección y gestión de profesionales para hoteles, caterings, eventos y hospitality.",
  keywords: ["hostelería", "selección de personal", "eventos", "hoteles", "hospitality"],
  openGraph: { title: "PREMIUM WORK | Profesionales que representan tu imagen", description: "Selección y gestión de profesionales para hoteles, caterings, eventos y hospitality.", type: "website" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body><CookiePreferences />{children}</body></html>; }
