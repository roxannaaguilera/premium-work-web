"use client";

import { LegalPage } from "@/components/LegalPage";
import { legal, legalValue, PRIVACY_VERSION } from "@/lib/legal";
import { useLang } from "@/components/i18n/lang";

export default function PrivacyPolicy() {
  const { lang } = useLang();
  const es = lang === "es";
  return <LegalPage title={es ? "Política de privacidad" : "Privacy policy"}>
    {es ? <>
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
    </> : <>
      <h2>1. Controller and contact</h2>
      <p>Controller: {legalValue(legal.owner)} Tax ID: {legalValue(legal.taxId)} Address: {legalValue(legal.address)}</p>
      <p>For queries and exercising your rights: <a href={`mailto:${legal.email}`}>{legal.email}</a>. Additional information in the <a href="/aviso-legal">legal notice</a>. Informative version: {PRIVACY_VERSION}.</p>
      <h2>2. Data and source</h2>
      <p>Data comes from the information you submit. For applications: name, email, phone, city, experience, sector, previous companies, availability and CV. For company requests: contact person, company, email, optional phone, city, sector, service, description and, if provided, date, staff and budget.</p>
      <p>The submission date and the version of this information are recorded. Do not include health data, beliefs, criminal records or identity documents in your CV. The application does not ask for gender or nationality. Hosting may generate technical connection and security logs; their provider and retention must be specified in the configuration below.</p>
      <h2>3. Purposes and legal bases</h2>
      <ul><li><strong>Spontaneous applications:</strong> managing your inclusion in the candidate pool and contacting you about job opportunities. Basis: the specific consent you give when submitting the form, Article 6.1.a of the GDPR. You may withdraw it. It is not used for advertising.</li><li><strong>Commercial requests:</strong> responding and preparing a proposal at the data subject's request, Article 6.1.b of the GDPR. When you act as a company contact, the legitimate interest is maintaining that professional relationship, Article 6.1.f of the GDPR and Article 19 of the LOPDGDD. The checkbox confirms you have read the information, not a commercial subscription.</li><li><strong>Browser preferences:</strong> remembering the choice you request via the panel, with no analytics or advertising.</li></ul>
      <p>Mandatory fields are necessary to process the corresponding request. If you do not provide them, the form cannot be sent. Optional data does not affect submission. The website does not send newsletters nor automatically add contacts to campaigns.</p>
      <h2>4. Retention</h2>
      <dl><dt>Applications and CVs</dt><dd>{legalValue(legal.candidateRetention)}</dd><dt>Commercial requests and related records</dt><dd>{legalValue(legal.clientRetention)}</dd></dl>
      <p>Withdrawal of consent or erasure requests will be handled in accordance with the applicable basis. Where a retention obligation exists or liabilities must be addressed, data use will be limited to that purpose for the corresponding period. Indefinite retention will not apply by default.</p>
      <h2>5. Access, providers and transfers</h2>
      <p>The code limits access to the private panel. Supabase is the intended database and CV storage provider. CVs have no public link. There is no feature for publishing applications or automatically sending CVs to client companies. Any further communication requires identifying its purpose, recipients and basis beforehand.</p>
      <dl><dt>Hosting and other processors</dt><dd>{legalValue(legal.hosting)}</dd><dt>Supabase region</dt><dd>{legalValue(legal.supabaseRegion)}</dd><dt>International transfers and safeguards</dt><dd>{legalValue(legal.internationalTransfers)}</dd></dl>
      <p>The owner must formalize processor agreements and verify sub-processors, access and applicable safeguards. It is not claimed that all data remains in the European Union until that configuration is verified. Authority requests may be honored where a legal obligation exists.</p>
      <h2>6. Your rights</h2>
      <p>You may request access, rectification, erasure, objection, restriction and portability where applicable, and withdraw consent without affecting the lawfulness of prior processing. Write to the contact indicated, identify your request and provide what is needed to locate your data. Additional identity information will only be requested if necessary.</p>
      <p>The general response time is one month; it may be extended by two more months due to complexity or number of requests, informing you within the first month. You may complain to the <a href="https://www.aepd.es/derechos-y-deberes/ejerce-tus-derechos">Spanish Data Protection Agency</a>, especially if you receive no response or disagree.</p>
      <h2>7. Automated decisions and security</h2>
      <p>Panels allow manual searches by professional or commercial criteria. There is no automatic scoring or automated hiring decisions. The application validates submissions and protects queries and downloads through administrative access; operational security, access management and backups must be maintained by the owner and its providers.</p>
      <h2>8. Links and changes</h2>
      <p>Opening WhatsApp or social networks takes you to an external service. Their widgets are not loaded on this page. Also see the <a href="/politica-de-cookies">cookie policy</a>. Relevant changes will be published with a new version; a previous authorization will not automatically extend to new purposes.</p>
      <h2>9. Reference legislation</h2>
      <p><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=es">General Data Protection Regulation</a>, <a href="https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673">Organic Law 3/2018</a> and the <a href="https://www.aepd.es/documento/guia-modelo-clausula-informativa.pdf">AEPD guide on the duty to inform</a>.</p>
    </>}
  </LegalPage>;
}
