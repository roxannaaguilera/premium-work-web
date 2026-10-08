"use client";

import { LegalPage } from "@/components/LegalPage";
import { legal, legalValue } from "@/lib/legal";
import { useLang } from "@/components/i18n/lang";

export default function LegalNotice() {
  const { lang } = useLang();
  const es = lang === "es";
  return <LegalPage title={es ? "Aviso legal" : "Legal notice"}>
    {es ? <>
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
    </> : <>
      <h2>1. Website owner</h2>
      <p>This website presents Premium Work's services and allows requesting commercial proposals and submitting job applications.</p>
      <dl><dt>Trade name</dt><dd>Premium Work</dd><dt>Owner / company name</dt><dd>{legalValue(legal.owner)}</dd><dt>Tax ID</dt><dd>{legalValue(legal.taxId)}</dd><dt>Address</dt><dd>{legalValue(legal.address)}</dd><dt>Registry details</dt><dd>{legalValue(legal.registry)}</dd><dt>Contact</dt><dd><a href={`mailto:${legal.email}`}>{legal.email}</a></dd></dl>
      <p>Identifying information is provided in accordance with Article 10 of <a href="https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758#a10">Law 34/2002 on information society services and electronic commerce</a>.</p>
      <h2>2. Use of the website</h2>
      <p>Browsing the website is free, without prejudice to the connection costs contracted by the user. Forms must be used with truthful data and for their intended purpose. Introducing unlawful content, impersonating others, attempting to access third-party data or compromising the security of the service is not allowed.</p>
      <h2>3. Requests and contracting</h2>
      <p>Submitting a request does not constitute contracting, booking or acceptance of a quote. Terms, scope, price and taxes will be specified in the corresponding proposal before contracting. Submitting a CV does not guarantee employment. This website does not include payments or direct electronic contracting.</p>
      <h2>4. Content and intellectual property</h2>
      <p>Texts, photographs, trademarks and design are subject to the rights of their respective owners. Browsing does not transfer exploitation rights. Any reuse beyond the uses permitted by law requires the corresponding authorization. Typefaces are distributed with their licenses, available alongside their files.</p>
      <h2>5. Availability and external links</h2>
      <p>The website may be interrupted for maintenance or incidents. If you detect incorrect information or a malfunction, please report it to the contact indicated. Links to WhatsApp and social networks open third-party services with their own terms. Social icons currently link to their main pages, not to verified Premium Work profiles. This information does not exclude liabilities that cannot be legally limited.</p>
      <h2>6. Privacy and cookies</h2>
      <p>Data processing is explained in the <a href="/politica-de-privacidad">privacy policy</a>. Browser storage and its settings are described in the <a href="/politica-de-cookies">cookie policy</a>.</p>
      <h2>7. Legislation and claims</h2>
      <p>The applicable Spanish and European Union legislation for the activity applies. You may direct queries to the contact indicated. Any dispute will be resolved before the competent bodies in accordance with applicable regulations, respecting the mandatory rights and jurisdictions of consumers and users.</p>
    </>}
  </LegalPage>;
}
