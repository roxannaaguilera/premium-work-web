import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legal, legalReady, legalValue, PRIVACY_VERSION } from "@/lib/legal";

export const metadata: Metadata = { title: "Política de privacidad | Premium Work", robots: { index: legalReady(), follow: true } };
export default function PrivacyPolicy() {
  return <LegalPage title="Política de privacidad">
    <h2>1. Responsable y contacto</h2>
    <p>Responsable: {legalValue(legal.owner)} NIF/CIF: {legalValue(legal.taxId)} Domicilio: {legalValue(legal.address)}</p>
    <p>Para consultas y ejercicio de derechos: <a href={`mailto:${legal.email}`}>{legal.email}</a>. Información adicional en el <a href="/aviso-legal">aviso legal</a>. Versión informativa: {PRIVACY_VERSION}.</p>
    <h2>2. Datos y procedencia</h2>
    <p>Los datos proceden de la información que envías. En candidaturas: nombre, email, teléfono, ciudad, experiencia, sector, empresas anteriores, disponibilidad y CV. En solicitudes de empresas: persona de contacto, empresa, email, teléfono opcional, ciudad, sector, servicio, descripción y, si se indican, fecha, personal y presupuesto.</p>
    <p>Se registra la fecha de envío y la versión de esta información. No incluyas datos de salud, creencias, antecedentes penales ni documentos de identidad en tu CV. La aplicación no solicita sexo o nacionalidad. El alojamiento puede generar registros técnicos de conexión y seguridad; su proveedor y conservación deben concretarse en la configuración indicada más abajo.</p>
    <h2>3. Finalidades y bases jurídicas</h2>
    <ul><li><strong>Candidaturas espontáneas:</strong> gestionar tu inclusión en la bolsa de candidatos y contactar sobre oportunidades laborales. Base: el consentimiento específico que prestas al enviar el formulario, artículo 6.1.a del RGPD. Puedes retirarlo. No se utiliza para publicidad.</li><li><strong>Solicitudes comerciales:</strong> responder y preparar una propuesta a petición del interesado, artículo 6.1.b del RGPD. Cuando actúas como contacto de una empresa, el interés legítimo es mantener esa relación profesional, artículo 6.1.f del RGPD y artículo 19 de la LOPDGDD. La casilla acredita que has leído la información, no una suscripción comercial.</li><li><strong>Preferencias del navegador:</strong> recordar la elección que solicitas mediante el panel, sin analítica ni publicidad.</li></ul>
    <p>Los campos obligatorios son necesarios para tramitar la solicitud correspondiente. Si no los facilitas, no se podrá enviar el formulario. Los datos opcionales no condicionan el envío. La web no envía newsletters ni añade automáticamente los contactos a campañas.</p>
    <h2>4. Conservación</h2>
    <dl><dt>Candidaturas y CV</dt><dd>{legalValue(legal.candidateRetention)}</dd><dt>Solicitudes comerciales y registros relacionados</dt><dd>{legalValue(legal.clientRetention)}</dd></dl>
    <p>La retirada del consentimiento o la solicitud de supresión se atenderán conforme a la base aplicable. Cuando exista una obligación de conservación o sea necesario atender responsabilidades, se limitará el uso de los datos a esa finalidad durante el plazo correspondiente. No se aplicará una conservación indefinida por defecto.</p>
    <h2>5. Acceso, proveedores y transferencias</h2>
    <p>El código limita la consulta al panel privado. Supabase está previsto como proveedor de base de datos y almacenamiento del CV. Los CV no tienen un enlace público. No existe una función de publicación de candidaturas ni de envío automático de CV a empresas clientes. Cualquier comunicación adicional requiere identificar su finalidad, destinatarios y base antes de realizarla.</p>
    <dl><dt>Alojamiento y otros encargados</dt><dd>{legalValue(legal.hosting)}</dd><dt>Región de Supabase</dt><dd>{legalValue(legal.supabaseRegion)}</dd><dt>Transferencias internacionales y garantías</dt><dd>{legalValue(legal.internationalTransfers)}</dd></dl>
    <p>El titular debe formalizar los contratos de encargo y comprobar subencargados, accesos y garantías aplicables. No se afirma que todos los datos permanezcan en la Unión Europea mientras esa configuración no esté verificada. Podrán atenderse requerimientos de autoridades cuando exista una obligación legal.</p>
    <h2>6. Tus derechos</h2>
    <p>Puedes solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad cuando procedan, y retirar el consentimiento sin afectar a la licitud del tratamiento anterior. Escribe al contacto indicado, identifica tu solicitud y facilita lo necesario para localizar tus datos. Solo se pedirá información adicional de identidad si es necesaria.</p>
    <p>El plazo general de respuesta es de un mes; puede ampliarse otros dos por complejidad o número de solicitudes, informándote dentro del primer mes. Puedes reclamar ante la <a href="https://www.aepd.es/derechos-y-deberes/ejerce-tus-derechos">Agencia Española de Protección de Datos</a>, especialmente si no recibes respuesta o no estás conforme.</p>
    <h2>7. Decisiones automatizadas y seguridad</h2>
    <p>Los paneles permiten búsquedas manuales por criterios profesionales o comerciales. No hay puntuación automática ni decisiones de contratación automatizadas. La aplicación valida los envíos y protege consultas y descargas mediante acceso administrativo; la seguridad operativa, la gestión de accesos y las copias deben mantenerse por el titular y sus proveedores.</p>
    <h2>8. Enlaces y cambios</h2>
    <p>Al abrir WhatsApp o redes sociales pasarás a un servicio externo. No se cargan sus widgets en esta página. Consulta también la <a href="/politica-de-cookies">política de cookies</a>. Los cambios relevantes se publicarán con una nueva versión; una autorización anterior no se extenderá automáticamente a nuevas finalidades.</p>
    <h2>9. Normativa de referencia</h2>
    <p><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=es">Reglamento General de Protección de Datos</a>, <a href="https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673">Ley Orgánica 3/2018</a> y <a href="https://www.aepd.es/documento/guia-modelo-clausula-informativa.pdf">guía de la AEPD sobre el deber de informar</a>.</p>
  </LegalPage>;
}
