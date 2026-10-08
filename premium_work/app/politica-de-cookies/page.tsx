"use client";

import { LegalPage } from "@/components/LegalPage";
import { useLang } from "@/components/i18n/lang";

export default function CookiesPolicy() {
  const { lang } = useLang();
  const es = lang === "es";
  return <LegalPage title={es ? "Política de cookies" : "Cookie policy"}>
    {es ? <>
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
    </> : <>
      <h2>1. What cookies and similar technologies are</h2>
      <p>Cookies are files that a website stores in the browser. Other technologies, such as localStorage, can also remember information. This policy describes the storage used by the Premium Work application.</p>
      <h2>2. What this website uses</h2>
      <p>No analytics tools, advertising pixels or embedded social media content have been added. This website does not store cookies nor use the browser's local storage. Fonts and photographs are served from the website itself.</p>
      <p>Forms do not store the CV or its fields in the browser's local storage.</p>
      <h2>3. Consent</h2>
      <p>This website shows no cookie notice and does not request your consent, because it does not use cookies or tracking technologies. The rules on consent and its exceptions are set out in the <a href="https://www.aepd.es/guias/guia-cookies.pdf">AEPD cookie guide</a>.</p>
      <h2>4. Changing your choice</h2>
      <p>There is no saved choice to change: this website does not store cookie preferences in your browser.</p>
      <p>You can also delete the site's data in your browser's privacy settings. This does not prevent browsing or completing the forms.</p>
      <h2>5. External services and inventory scope</h2>
      <p>WhatsApp, Instagram, LinkedIn and Facebook only open when you click their links; their cookies are governed by those sites' policies. Supabase is used server-side for the forms, with no Supabase user session in the browser.</p>
      <p>The inventory corresponds to the code of this version. The owner must check whether hosting, CDN or services added when deploying install additional storage and update the information before enabling it.</p>
      <h2>6. Additional information</h2>
      <p>See the owner's identity in the <a href="/aviso-legal">legal notice</a> and your rights in the <a href="/politica-de-privacidad">privacy policy</a>.</p>
    </>}
  </LegalPage>;
}
