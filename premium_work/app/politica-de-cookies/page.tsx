import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalReady } from "@/lib/legal";

export const metadata: Metadata = { title: "Política de cookies | Premium Work", robots: { index: legalReady(), follow: true } };
export default function CookiesPolicy() {
  return <LegalPage title="Política de cookies">
    <h2>1. Qué son las cookies y tecnologías similares</h2>
    <p>Las cookies son archivos que un sitio guarda en el navegador. Otras tecnologías, como localStorage, también permiten recordar información. Esta política describe el almacenamiento utilizado por la aplicación de Premium Work.</p>
    <h2>2. Qué utiliza esta web</h2>
    <p>No se han incorporado herramientas de analítica, píxeles publicitarios ni contenido incrustado de redes sociales. Esta web no guarda cookies ni utiliza el almacenamiento local del navegador. Las fuentes y fotografías se sirven desde la propia web.</p>
    <p>Los formularios no guardan el CV ni sus campos en el almacenamiento local del navegador.</p>
    <h2>3. Consentimiento</h2>
    <p>Esta web no muestra ningún aviso de cookies ni solicita tu consentimiento, porque no utiliza cookies ni tecnologías de seguimiento. Las reglas sobre consentimiento y sus excepciones se recogen en la <a href="https://www.aepd.es/guias/guia-cookies.pdf">Guía de cookies de la AEPD</a>.</p>
    <h2>4. Cambiar la elección</h2>
    <p>No hay ninguna elección guardada que cambiar: esta web no almacena preferencias de cookies en tu navegador.</p>
    <p>También puedes borrar los datos del sitio en los ajustes de privacidad de tu navegador. Esto no impide navegar ni completar los formularios.</p>
    <h2>5. Servicios externos y alcance del inventario</h2>
    <p>WhatsApp, Instagram, LinkedIn y Facebook solo se abren al pulsar sus enlaces; sus cookies se rigen por las políticas de esos sitios. Supabase se utiliza desde el servidor para los formularios, sin una sesión de usuario de Supabase en el navegador.</p>
    <p>El inventario corresponde al código de esta versión. El titular debe comprobar si el alojamiento, CDN o servicios que se añadan al desplegar instalan almacenamiento adicional y actualizar la información antes de activarlo.</p>
    <h2>6. Información adicional</h2>
    <p>Consulta la identidad del titular en el <a href="/aviso-legal">aviso legal</a> y tus derechos en la <a href="/politica-de-privacidad">política de privacidad</a>.</p>
  </LegalPage>;
}
