"use client";

import { LegalPage } from "@/components/LegalPage";
import { legal, PRIVACY_VERSION } from "@/lib/legal";
import { useLang } from "@/components/i18n/lang";

export default function PrivacyPolicy() {
  const { lang } = useLang();
  const es = lang === "es";
  return <LegalPage title={es ? "Política de privacidad" : "Privacy policy"}>
    {es ? <>
      <h2>1. Contacto</h2>
      <p>Los datos que nos envíes al contactarnos se tratarán únicamente para responderte (ver apartado 3). Contacto: <a href={`mailto:${legal.email}`}>{legal.email}</a>. Versión informativa: {PRIVACY_VERSION}.</p>
      <h2>2. Qué recoge esta web</h2>
      <p>Nada. Esta web no tiene formularios ni almacena datos personales de visitantes, clientes o candidatos. No hay base de datos de clientes ni bolsa de candidatos en el sitio. La única preferencia guardada en tu navegador es el idioma (español o inglés), en el almacenamiento local, sin seguimiento ni analítica. Durante la visita, el sitio también guarda datos técnicos de sesión (ver política de cookies).</p>
      <h2>3. Contacto por correo y WhatsApp</h2>
      <p>Si nos escribes por correo electrónico o WhatsApp, tu mensaje y los datos que incluyas (incluido un CV enviado por correo) serán tratados por esos servicios conforme a sus propias políticas. Premium Work los usará únicamente para responder a tu mensaje. La base jurídica es tu consentimiento al escribirnos y nuestro interés legítimo en responderte, y conservaremos tu mensaje solo el tiempo necesario para atender tu solicitud. No se añaden contactos a campañas ni se envían newsletters.</p>
      <h2>4. Derechos</h2>
      <p>Como esta web no almacena tus datos, no hay datos que consultar, rectificar o suprimir en el sitio. Para cualquier cuestión, escribe a <a href={`mailto:${legal.email}`}>{legal.email}</a>. Puedes reclamar ante la <a href="https://www.aepd.es/derechos-y-deberes/ejerce-tus-derechos">Agencia Española de Protección de Datos</a>, especialmente si no recibes respuesta o no estás conforme.</p>
      <h2>5. Enlaces y cambios</h2>
      <p>Al abrir WhatsApp o redes sociales pasarás a un servicio externo. No se cargan sus widgets en esta página. Consulta también la <a href="/politica-de-cookies">política de cookies</a>. Los cambios relevantes se publicarán con una nueva versión.</p>
      <h2>6. Normativa de referencia</h2>
      <p><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=es">Reglamento General de Protección de Datos</a>, <a href="https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673">Ley Orgánica 3/2018</a> y <a href="https://www.aepd.es/documento/guia-modelo-clausula-informativa.pdf">guía de la AEPD sobre el deber de informar</a>.</p>
    </> : <>
      <h2>1. Contact</h2>
      <p>Any data you send us when contacting us will be processed only to reply to you (see section 3). Contact: <a href={`mailto:${legal.email}`}>{legal.email}</a>. Informative version: {PRIVACY_VERSION}.</p>
      <h2>2. What this website collects</h2>
      <p>Nothing. This website has no forms and does not store personal data of visitors, clients or candidates. There is no client database or candidate pool on the site. The only preference saved in your browser is the language (Spanish or English), in local storage, with no tracking or analytics. During your visit, the site also stores technical session data (see cookie policy).</p>
      <h2>3. Contact by email and WhatsApp</h2>
      <p>If you write to us by email or WhatsApp, your message and any data you include (including a CV sent by email) will be processed by those services under their own policies. Premium Work will use them only to reply to your message. The legal basis is your consent when writing to us and our legitimate interest in replying, and we will keep your message only as long as needed to handle your request. Contacts are not added to campaigns and no newsletters are sent.</p>
      <h2>4. Rights</h2>
      <p>As this website does not store your data, there is no data to access, rectify or erase on the site. For any question, write to <a href={`mailto:${legal.email}`}>{legal.email}</a>. You may complain to the <a href="https://www.aepd.es/derechos-y-deberes/ejerce-tus-derechos">Spanish Data Protection Agency</a>, especially if you receive no response or disagree.</p>
      <h2>5. Links and changes</h2>
      <p>Opening WhatsApp or social networks takes you to an external service. Their widgets are not loaded on this page. Also see the <a href="/politica-de-cookies">cookie policy</a>. Relevant changes will be published with a new version.</p>
      <h2>6. Reference legislation</h2>
      <p><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=es">General Data Protection Regulation</a>, <a href="https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673">Organic Law 3/2018</a> and the <a href="https://www.aepd.es/documento/guia-modelo-clausula-informativa.pdf">AEPD guide on the duty to inform</a>.</p>
    </>}
  </LegalPage>;
}
