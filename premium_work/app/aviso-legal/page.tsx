import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legal, legalReady, legalValue } from "@/lib/legal";

export const metadata: Metadata = { title: "Aviso legal | Premium Work", robots: { index: legalReady(), follow: true } };
export default function LegalNotice() {
  return <LegalPage title="Aviso legal">
    <h2>1. Titular del sitio</h2>
    <p>Este sitio presenta los servicios de Premium Work y permite solicitar propuestas comerciales y presentar candidaturas.</p>
    <dl><dt>Nombre comercial</dt><dd>Premium Work</dd><dt>Titular / razón social</dt><dd>{legalValue(legal.owner)}</dd><dt>NIF / CIF</dt><dd>{legalValue(legal.taxId)}</dd><dt>Domicilio</dt><dd>{legalValue(legal.address)}</dd><dt>Datos registrales</dt><dd>{legalValue(legal.registry)}</dd><dt>Contacto</dt><dd><a href={`mailto:${legal.email}`}>{legal.email}</a></dd></dl>
    <p>La información identificativa se facilita conforme al artículo 10 de la <a href="https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758#a10">Ley 34/2002 de servicios de la sociedad de la información y de comercio electrónico</a>.</p>
    <h2>2. Uso del sitio</h2>
    <p>La consulta de la web es gratuita, sin perjuicio del coste de conexión contratado por el usuario. Los formularios deben utilizarse con datos veraces y para su finalidad prevista. No se permite introducir contenido ilícito, suplantar identidades, intentar acceder a datos ajenos ni comprometer la seguridad del servicio.</p>
    <h2>3. Solicitudes y contratación</h2>
    <p>Enviar una solicitud no constituye una contratación, reserva ni aceptación de presupuesto. Las condiciones, alcance, precio e impuestos se concretarán en la propuesta correspondiente antes de contratar. Enviar un CV no garantiza la contratación laboral. Esta web no incluye pagos ni contratación electrónica directa.</p>
    <h2>4. Contenidos y propiedad intelectual</h2>
    <p>Los textos, fotografías, marcas y diseño están sujetos a los derechos de sus respectivos titulares. La navegación no transmite derechos de explotación. Cualquier reutilización que exceda los usos permitidos por la ley necesita la autorización correspondiente. Las fuentes tipográficas se distribuyen con sus licencias, disponibles junto a sus archivos.</p>
    <h2>5. Disponibilidad y enlaces externos</h2>
    <p>La web puede interrumpirse por mantenimiento o incidencias. Si detectas información incorrecta o un fallo, comunícalo al contacto indicado. Los enlaces a WhatsApp y redes sociales abren servicios de terceros con sus propias condiciones. Actualmente los iconos de redes enlazan a sus páginas principales, no a perfiles verificados de Premium Work. Esta información no excluye responsabilidades que no puedan limitarse legalmente.</p>
    <h2>6. Privacidad y cookies</h2>
    <p>El tratamiento de datos se explica en la <a href="/politica-de-privacidad">política de privacidad</a>. El almacenamiento en el navegador y su configuración se describen en la <a href="/politica-de-cookies">política de cookies</a>.</p>
    <h2>7. Legislación y reclamaciones</h2>
    <p>Resulta aplicable la legislación española y de la Unión Europea que corresponda a la actividad. Puedes dirigir consultas al contacto indicado. Cualquier controversia se resolverá ante los órganos competentes según la normativa aplicable, respetando los derechos y fueros imperativos de consumidores y usuarios.</p>
  </LegalPage>;
}
