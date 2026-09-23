import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { CookieSettingsButton } from "@/components/CookiePreferences";
import { legalReady } from "@/lib/legal";

export const metadata: Metadata = { title: "Política de cookies | Premium Work", robots: { index: legalReady(), follow: true } };
export default function CookiesPolicy() {
  return <LegalPage title="Política de cookies">
    <h2>1. Qué son las cookies y tecnologías similares</h2>
    <p>Las cookies son archivos que un sitio guarda en el navegador. Otras tecnologías, como localStorage, también permiten recordar información. Esta política describe el almacenamiento utilizado por la aplicación de Premium Work.</p>
    <h2>2. Qué utiliza esta web</h2>
    <p>No se han incorporado herramientas de analítica, píxeles publicitarios ni contenido incrustado de redes sociales. La preferencia de cookies se guarda en localStorage, no en una cookie HTTP. Las fuentes y fotografías se sirven desde la propia web.</p>
    <div className="overflow-x-auto"><table><thead><tr><th>Nombre</th><th>Responsable / tipo</th><th>Finalidad</th><th>Duración</th></tr></thead><tbody><tr><td>pw_cookie_preferences</td><td>Propio · localStorage técnico</td><td>Recordar la elección, su fecha y la versión del aviso. No contiene un identificador publicitario.</td><td>180 días desde la elección. Se invalida al caducar o cambiar la versión; el dato caducado se elimina cuando vuelves a visitar la web.</td></tr></tbody></table></div>
    <p>El almacenamiento para recordar una elección solicitada no se utiliza para perfilar visitantes. El aviso aparece únicamente al abrir o recargar la página de inicio y permanece hasta una elección expresa. Puedes abrir la configuración desde el botón «Preferencias de cookies» en las demás páginas. Si desmarcas «Guardar mi elección», se elimina el valor guardado. Los formularios no guardan el CV ni sus campos en localStorage.</p>
    <h2>3. Aceptar, rechazar y configurar</h2>
    <p>Los botones «Aceptar» y «Rechazar» tienen la misma visibilidad. Como actualmente no hay categorías opcionales, ambas opciones mantienen solo lo necesario. «Configurar» permite consultar las categorías y decidir si se recuerda la elección. Seguir navegando o cerrar la configuración sin guardar no equivale a aceptar.</p>
    <p>La elección actual no autoriza futuras herramientas. Si se incorporan servicios opcionales, deberán informarse sus fines, proveedores y duraciones, bloquearse hasta obtener el consentimiento correspondiente y solicitarse una nueva elección. Las reglas sobre consentimiento y sus excepciones se recogen en la <a href="https://www.aepd.es/guias/guia-cookies.pdf">Guía de cookies de la AEPD</a>.</p>
    <h2>4. Cambiar la elección</h2>
    <p>Puedes volver al panel desde el botón permanente «Preferencias de cookies» o desde este enlace:</p>
    <CookieSettingsButton className="rounded-full bg-[#131313] px-5 py-3 text-sm font-bold text-white" />
    <p>También puedes borrar los datos del sitio en los ajustes de privacidad de tu navegador. Si bloqueas el almacenamiento local, la elección se aplicará a la vista actual pero el aviso puede reaparecer. Esto no impide navegar ni completar los formularios.</p>
    <h2>5. Servicios externos y alcance del inventario</h2>
    <p>WhatsApp, Instagram, LinkedIn y Facebook solo se abren al pulsar sus enlaces; sus cookies se rigen por las políticas de esos sitios. Supabase se utiliza desde el servidor para los formularios, sin una sesión de usuario de Supabase en el navegador.</p>
    <p>El inventario corresponde al código de esta versión. El titular debe comprobar si el alojamiento, CDN o servicios que se añadan al desplegar instalan almacenamiento adicional y actualizar la información antes de activarlo.</p>
    <h2>6. Información adicional</h2>
    <p>Consulta la identidad del titular en el <a href="/aviso-legal">aviso legal</a> y tus derechos en la <a href="/politica-de-privacidad">política de privacidad</a>.</p>
  </LegalPage>;
}
