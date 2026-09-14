# Privacidad, cookies y aviso legal

Actualización: septiembre de 2026. Este documento distingue los cambios técnicos realizados de los datos y actuaciones pendientes del titular. No es una certificación de cumplimiento integral.

## Cambios implementados

- Rutas `/aviso-legal`, `/politica-de-privacidad` y `/politica-de-cookies`, con diseño de marca, navegación entre ellas y enlaces en el footer.
- Aviso de cookies con «Aceptar», «Rechazar» y «Configurar» igualmente accesibles. Panel mediante diálogo nativo, manejo de teclado y acceso permanente para modificar la elección.
- Inventario fiel al código: no hay analítica, publicidad ni widgets sociales. No se añaden rastreadores para justificar el aviso.
- La elección se recuerda en `localStorage` bajo `pw_cookie_preferences`, durante 180 días. No es una cookie HTTP. Caduca por fecha o cambio de versión. No se escribe hasta una acción del usuario; puede desactivarse el recuerdo y eliminarse desde el panel.
- Aceptar y rechazar tienen el mismo resultado técnico en esta versión: solo almacenamiento necesario. Ninguna elección autoriza proveedores futuros. Para añadir herramientas opcionales habrá que informar, cambiar versión e implementar su bloqueo previo y retirada.
- Las familias DM Sans y Playfair Display se sirven localmente desde `public/fonts/`, con sus licencias OFL. Se eliminó la importación de Google Fonts del CSS.
- Información básica de privacidad junto a cada formulario, con enlace a la política completa. Consentimiento específico para la bolsa de candidatos; lectura de información para la solicitud comercial, sin consentimiento de marketing.
- Las nuevas solicitudes guardan `privacy_version` además de la fecha. Los registros anteriores no se rellenan con consentimientos ficticios.
- Cabeceras contra incrustación y detección incorrecta de tipos, política de referente y desactivación de cámara, micrófono y geolocalización. Paneles y API tienen `X-Robots-Tag: noindex, nofollow`; esto complementa, no sustituye, su autenticación.
- Los documentos legales incompletos se muestran como borrador. Los formularios funcionan en producción independientemente de ese estado.

## Datos necesarios para completar los textos

Editar [lib/legal.ts](lib/legal.ts) con información real:

| Campo | Qué debe aportar el titular |
| --- | --- |
| `owner` | Razón social o nombre del titular. |
| `taxId` | NIF/CIF. |
| `address` | Domicilio del titular. |
| `registry` | Datos registrales o indicación expresa de que no corresponde inscripción. |
| `email` | Correo operativo para privacidad y derechos; actualmente figura el contacto conocido `hola@premiumwork.es`. |
| `candidateRetention` | Plazo y criterios reales de conservación de candidatos y CV, incluida la retirada del consentimiento. |
| `clientRetention` | Plazo y criterios de conservación de solicitudes comerciales y registros asociados. |
| `hosting` | Proveedor de alojamiento y otros encargados relevantes, incluidos los registros técnicos. |
| `supabaseRegion` | Región elegida y condiciones reales del proyecto. |
| `internationalTransfers` | Destinos, accesos y garantías aplicables, o ausencia de transferencias verificada. |
| `reviewed` | Cambiar a `true` solo tras completar y revisar lo anterior. |

No se ha inventado una sociedad, un NIF, un plazo de conservación ni una residencia de datos. Tampoco se ha afirmado que contratar una región europea de almacenamiento elimine por sí solo cualquier transferencia internacional.

## Activar la base de datos

En proyectos nuevos ejecutar `supabase/candidates.sql` y `supabase/clients.sql`. Si las tablas ya existían, ejecutar además [supabase/privacy-update.sql](supabase/privacy-update.sql).

La migración añade `privacy_version` a ambas tablas. En clientes, la columna histórica `consent_at` registra envío y lectura de información, no autorización publicitaria. En candidatos registra el consentimiento para la bolsa de empleo. Guardar una fecha y versión es evidencia técnica parcial: no sustituye la gestión del consentimiento y de sus retiradas.

Las credenciales y pruebas de conexión de Supabase siguen pendientes si todavía no se configuraron. Ver [supabase/SETUP.md](supabase/SETUP.md).

## Actuaciones que no se resuelven con un banner

Antes de tratar datos reales, el titular debe validar las bases jurídicas y la información publicada, formalizar encargos de tratamiento con sus proveedores, revisar transferencias, definir conservación y ejecutar las eliminaciones correspondientes también en archivos y copias. Los textos no crean por sí solos esos procesos.

Debe existir un procedimiento para atender derechos en el correo indicado, documentar solicitudes y responder dentro de los plazos aplicables. No hay todavía una interfaz administrativa de eliminación, tareas de purga ni seguimiento de derechos. El panel usa una clave compartida; quedan por definir cuentas individuales, permisos y auditoría según el equipo autorizado.

También quedan por revisar medidas de seguridad operativa, dependencias, límites de peticiones, copias, gestión de incidentes, registros de actividades y necesidad de evaluaciones adicionales. El análisis de accesibilidad, contratación y obligaciones sectoriales depende de la actividad y del servicio finalmente publicado; no se presume completado con este cambio. Actualmente no existe compra ni pago en línea.

Al desplegar, revisar en un navegador limpio el almacenamiento, las peticiones de red y cualquier servicio añadido por el alojamiento o CDN. El inventario de cookies solo puede certificarse sobre el despliegue final. La consola de desarrollo de Next.js puede comportarse de forma distinta a producción.

## Archivos

| Archivo | Función |
| --- | --- |
| `lib/legal.ts` | Datos públicos del titular, versión de privacidad y comprobación de preparación. |
| `lib/cookie-preferences.ts` | Formato de preferencias, caducidad y versión. |
| `components/CookiePreferences.tsx` | Aviso, diálogo y cambio de elección. |
| `components/LegalPage.tsx` | Estructura común de las páginas legales. |
| `components/PrivacySummary.tsx` | Primera capa de información en formularios. |
| `app/aviso-legal/page.tsx` | Identidad, uso, contratación, contenidos y enlaces. |
| `app/politica-de-privacidad/page.tsx` | Datos, finalidades, bases, conservación, destinatarios y derechos. |
| `app/politica-de-cookies/page.tsx` | Inventario, duración, configuración y alcance. |
| `supabase/privacy-update.sql` | Actualización de tablas ya existentes. |
| `tests/privacy.test.cjs` | Pruebas de preferencias y envíos en producción. |
| `tests/browser/privacy.spec.ts` | Comprobaciones del aviso y páginas en navegador. |

## Comprobaciones

```powershell
node --test tests/candidates.test.cjs tests/clients.test.cjs tests/privacy.test.cjs
npm.cmd run build
npx.cmd playwright test
```

La configuración de Playwright utiliza Edge en Windows y un servidor temporal en el puerto 3107. En otros sistemas requiere Chromium instalado para Playwright. Las pruebas de API usan Supabase simulado; no envían datos a un proyecto real. Las pruebas verifican los env?os y la validaci?n en producci?n.

Para revisión manual: comprobar igual visibilidad de aceptar/rechazar, configuración con teclado, persistencia tras recargar, caducidad, acceso a documentos desde móvil, campos de privacidad y ausencia de conexiones externas no previstas. El aviso no se utiliza como muro que impida navegar sin aceptar.

## Fuentes oficiales consultadas

- [LSSI, Ley 34/2002, especialmente artículos 10 y 22](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758).
- [Reglamento General de Protección de Datos](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=es).
- [LOPDGDD, Ley Orgánica 3/2018](https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673).
- [Guía de cookies de la AEPD](https://www.aepd.es/guias/guia-cookies.pdf).
- [AEPD: deber de informar](https://www.aepd.es/documento/guia-modelo-clausula-informativa.pdf).
- [AEPD: ejercicio de derechos](https://www.aepd.es/derechos-y-deberes/ejerce-tus-derechos).
- [AEPD: protección de datos en las relaciones laborales](https://www.aepd.es/guias/la-proteccion-de-datos-en-las-relaciones-laborales.pdf).

## Comportamiento de apertura actualizado
El aviso se muestra desde el HTML inicial en cada apertura o recarga y solo se cierra con una acci�n expresa. Leer una preferencia anterior no lo oculta. La prueba de navegador comprueba su permanencia despu�s del avance del carrusel.
