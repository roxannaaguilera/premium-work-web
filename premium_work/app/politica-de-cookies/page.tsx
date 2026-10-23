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
      <p>No se han incorporado herramientas de analítica, píxeles publicitarios ni contenido incrustado de redes sociales. Esta web no guarda cookies. El único dato que se conserva en el almacenamiento local de tu navegador (localStorage) es tu preferencia de idioma (español o inglés), que eliges con el selector de idioma de la cabecera. Además, durante tu visita el sitio usa el almacenamiento de sesión (sessionStorage) solo para recordar si ya viste la introducción y la animación de paso entre páginas; se borra al cerrar el navegador. Nada de esto se usa para seguimiento ni analítica. Las fuentes y fotografías se sirven desde la propia web.</p>
      <h2>3. Consentimiento</h2>
      <p>Esta web no muestra ningún aviso de cookies ni solicita tu consentimiento, porque no utiliza cookies ni tecnologías de seguimiento. Las reglas sobre consentimiento y sus excepciones se recogen en la <a href="https://www.aepd.es/guias/guia-cookies.pdf">Guía de cookies de la AEPD</a>.</p>
      <h2>4. Cambiar la elección</h2>
      <p>La única elección guardada es tu preferencia de idioma. Puedes cambiarla en cualquier momento con el selector ES / EN de la cabecera.</p>
      <p>También puedes borrar los datos del sitio en los ajustes de privacidad de tu navegador. Esto no impide navegar.</p>
      <h2>5. Servicios externos y alcance del inventario</h2>
      <p>WhatsApp, Instagram, LinkedIn y Facebook solo se abren al pulsar sus enlaces; sus cookies se rigen por las políticas de esos sitios. Esta web no utiliza bases de datos ni guarda datos de formularios.</p>
      <p>Si en el futuro se añaden herramientas de analítica o cookies no técnicas, actualizaremos esta política y, cuando sea necesario, pediremos tu consentimiento antes de activarlas.</p>
      <h2>6. Información adicional</h2>
      <p>Consulta el contacto en el <a href="/aviso-legal">aviso legal</a> y tus derechos en la <a href="/politica-de-privacidad">política de privacidad</a>.</p>
    </> : <>
      <h2>1. What cookies and similar technologies are</h2>
      <p>Cookies are files that a website stores in the browser. Other technologies, such as localStorage, can also remember information. This policy describes the storage used by the Premium Work application.</p>
      <h2>2. What this website uses</h2>
      <p>No analytics tools, advertising pixels or embedded social media content have been added. This website does not store cookies. The only data kept in your browser's local storage (localStorage) is your language preference (Spanish or English), which you choose with the language selector in the header. In addition, during your visit the site uses session storage (sessionStorage) only to remember whether you have already seen the intro and the page-transition animation; it is deleted when you close the browser. None of this is used for tracking or analytics. Fonts and photographs are served from the website itself.</p>
      <h2>3. Consent</h2>
      <p>This website shows no cookie notice and does not request your consent, because it does not use cookies or tracking technologies. The rules on consent and its exceptions are set out in the <a href="https://www.aepd.es/guias/guia-cookies.pdf">AEPD cookie guide</a>.</p>
      <h2>4. Changing your choice</h2>
      <p>The only saved choice is your language preference. You can change it at any time with the ES / EN selector in the header.</p>
      <p>You can also delete the site's data in your browser's privacy settings. This does not prevent browsing.</p>
      <h2>5. External services and inventory scope</h2>
      <p>WhatsApp, Instagram, LinkedIn and Facebook only open when you click their links; their cookies are governed by those sites' policies. This website does not use databases and does not store form data.</p>
      <p>If analytics tools or non-technical cookies are added in the future, we will update this policy and, where required, ask for your consent before enabling them.</p>
      <h2>6. Additional information</h2>
      <p>See the contact details in the <a href="/aviso-legal">legal notice</a> and your rights in the <a href="/politica-de-privacidad">privacy policy</a>.</p>
    </>}
  </LegalPage>;
}
