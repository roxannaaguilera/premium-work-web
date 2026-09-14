# Guía del proyecto PREMIUM WORK

Actualizada el 11 de septiembre de 2026. Este documento recoge el estado actual del proyecto y los cambios de diseño, navegación y gestión de solicitudes realizados.

## Estado del proyecto

Web corporativa de una marca de lujo construida con Next.js 16, React 19, TypeScript, Tailwind CSS 4 y Framer Motion. Se incorporó `@supabase/supabase-js` para gestionar candidatos y solicitudes comerciales.

El código de ambas integraciones está preparado. **Todavía falta configurar el proyecto real de Supabase, ejecutar los scripts SQL y verificar el guardado real.** No debe confundirse la compilación correcta con una base de datos ya conectada.

## Desarrollo y comprobaciones

Requiere Node.js 24.x. Ejecutar desde la carpeta `premium_work`:

```powershell
npm.cmd run dev
```

Dirección habitual: `http://localhost:3000`.

```powershell
node --test tests/candidates.test.cjs tests/clients.test.cjs tests/privacy.test.cjs
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run start
```

Se verificaron 16 pruebas con Supabase simulado, TypeScript y la compilación de producción. Las pruebas no conectan a un proyecto real ni sustituyen la revisión visual en navegador. `npm.cmd run lint` sigue disponible, pero la comprobación previa encontró una incompatibilidad entre ESLint 10 y los plugins de React de la configuración de Next.js.

## Organización actual

El orden de la página principal en `app/page.tsx` es: Navbar → Hero → ServicesIntro → Features → WhyUs → ClientsCarousel → Footer.

| Elemento | Archivo |
| --- | --- |
| Página principal | [app/page.tsx](app/page.tsx) |
| Metadatos e idioma | [app/layout.tsx](app/layout.tsx) |
| Tipografías, colores, degradados y animaciones CSS | [app/globals.css](app/globals.css) |
| Navbar y menú móvil | [components/Navbar.tsx](components/Navbar.tsx) |
| Portada | [components/Hero.tsx](components/Hero.tsx) |
| Banda de servicios y titular introductorio | [components/ServicesIntro.tsx](components/ServicesIntro.tsx) |
| Profesiones y «¿Qué necesitas?» | [components/Features.tsx](components/Features.tsx) |
| Acerca de nosotros y ventajas | [components/WhyUs.tsx](components/WhyUs.tsx) |
| Carrusel de sectores | [components/ClientsCarousel.tsx](components/ClientsCarousel.tsx) |
| Contacto, redes y pie de página | [components/Footer.tsx](components/Footer.tsx) |
| Animación compartida de aparición | [components/Reveal.tsx](components/Reveal.tsx) |
| Formulario de candidatos | [components/CandidateForm.tsx](components/CandidateForm.tsx) |
| Formulario comercial | [components/ClientForm.tsx](components/ClientForm.tsx) |
| Catálogos compartidos de sectores y servicios | [lib/service-options.ts](lib/service-options.ts) |
| Cliente Supabase y comprobación de acceso administrativo | [lib/candidates.ts](lib/candidates.ts) |

`Problem.tsx` y `Solution.tsx` permanecen en el proyecto, pero no forman parte de la composición actual de la portada. `EmailForm.tsx` conserva la implementación anterior mediante correo; los formularios actuales de candidatos y empresas utilizan sus componentes específicos.

## Identidad visual

Se mantienen exclusivamente las familias definidas para la marca: **Playfair Display** para titulares mediante `.display` y **DM Sans** para texto general, navegación y etiquetas. Los titulares del carrusel utilizan Playfair Display; su encabezado recupera el estilo pequeño en mayúsculas con un rombo dorado.

```css
--navy: #0B1F3A;
--gold: #C9A227;
--cream: #F8F7F4;
```

Los ajustes priorizan azul marino, dorado y marfil, pesos moderados y contraste legible. Los logos están en `public/brand/`; el navbar utiliza `logotipo-horizontal.svg`.

## Hero

En móvil se presenta sobre fondo azul marino, con el mensaje «¿Servicio perfecto? Equipo correcto.» y acceso directo al formulario de empresas. A partir de 768 px se muestra el carrusel de cinco imágenes con controles, fundido y avance de 5,6 segundos al inicializarse en ese ancho.

Las imágenes de escritorio están en `public/images/hero-1.webp` a `hero-5.webp`. Existen referencias a variantes móviles en los datos, pero el render actual no utiliza un `<source>` para servirlas. Los encuadres se controlan en las clases de las imágenes.

## ServicesIntro y banda dorada

La banda pasó a ser delgada, con enlaces de 44 px de altura, fondo dorado sólido y texto azul marino en DM Sans. Se conserva el reflejo blanco que recorre la franja cada 7 segundos y el desplazamiento infinito de los servicios, de 36 segundos por ciclo.

El desplazamiento de la banda se pausa al pasar el ratón o enfocar sus enlaces. Cada servicio abre `/solicitar-servicio?servicio=...`.

El titular «Mucho más que personal: un servicio completo.» aparece y se desvanece mediante opacidad, sin desplazamiento, al entrar y salir de pantalla. Se retiró la luz animada del fondo de esta sección; permanece su fondo de marca estático.

## Features: profesiones y vista móvil

En escritorio, los seis servicios mantienen bloques alternados de texto y fotografía. El panel de texto usa marfil cálido `#f3efe5`, letras azul marino y detalles dorados. **Features queda sin efecto de luz.** Sus textos entran desde el lateral exterior hacia el interior, alternando el sentido según la posición de la fotografía.

En móvil y tablet, «¿Qué necesitas?» muestra dos tarjetas: candidatos y empresas. Se ajustaron al estilo del carrusel de sectores: esquinas `rounded-xl`, sombra suave, proporción 1.08, ancho de 76 vw y deslizamiento manual con ajuste al centro. Se retiró el recuadro claro: el texto y la flecha vuelven a estar directamente sobre la foto, en blanco, con degradado oscuro para mejorar el contraste.

Las fotos utilizadas por Features son `serv-1-display.webp` a `serv-6-display.webp`; el encuadre se define en `position`. Los títulos de las tarjetas móviles también tienen entrada lateral.

## Acerca de nosotros

WhyUs conserva un fondo azul profundo con luz dorada difusa en movimiento. Las ventajas se presentan en una fila en escritorio y con desplazamiento horizontal y flechas en móvil y tablet.

Se corrigió la llegada del enlace `/#nosotros`, que dejaba el titular tapado por el navbar fijo. La sección incluye:

```tsx
scroll-mt-[calc(5rem+1px)]
```

Esto establece `scroll-margin-top: calc(5rem + 1px)`: reserva 80 px del menú y 1 px del borde al navegar al ancla, sin añadir un espacio permanente al diseño. Si cambia la altura del navbar, debe revisarse este valor y la altura de la sección.

## Carrusel de sectores

`ClientsCarousel` muestra tres tarjetas completas y fragmentos laterales en escritorio. En móvil destaca una tarjeta centrada con las contiguas asomando. Todas conservan color, esquinas redondeadas y títulos legibles; se eliminaron la atenuación y escala reducida de las tarjetas laterales.

El avance automático es de **3 segundos**, con repetición de las diapositivas para mantener el bucle. Incluye flechas de escritorio, puntos de navegación y gesto táctil. Se pausa al pasar el ratón, mantener foco dentro de la zona interactiva o tocar el carrusel; retoma el avance al terminar esa interacción.

El fondo tiene una luz amarilla cálida que viaja de lado a lado en 12 segundos por recorrido. Cada tarjeta abre el formulario comercial con su sector preseleccionado.

## Animaciones al hacer scroll

Se cambió `viewport.once` a `false` en Features, ServicesIntro, WhyUs y Reveal para repetir sus animaciones de entrada al subir y bajar. Los brillos y carruseles conservan sus ciclos propios.

ServicesIntro utiliza fundido; Features utiliza desplazamiento lateral y opacidad. WhyUs y Reveal mantienen sus transiciones de aparición. Las nuevas luces CSS y las animaciones de Features y ServicesIntro contemplan la preferencia de movimiento reducido. No equivale a una desactivación global de todas las animaciones: el Hero y algunos efectos existentes conservan su comportamiento específico.

## Navbar, enlaces y contacto

El navbar permanece fijo, con fondo azul translúcido, detalle dorado, letras claras y desenfoque. Después del scroll se ajusta su tratamiento visual, no se convierte en un fondo crema. El menú de escritorio y el menú móvil mantienen la misma identidad.

| Acceso | Destino |
| --- | --- |
| Inicio / logo | `/#inicio` |
| Acerca de nosotros | `/#nosotros` |
| Contacto | `/#contacto` |
| Candidato / Registrarse | `/registro` |
| Empresas / Solicitar servicio | `/solicitar-servicio` |
| Servicio del menú, banda o pie de página | `/solicitar-servicio?servicio=identificador` |
| Sector del carrusel | `/solicitar-servicio?sector=identificador` |
| Correo | `mailto:hola@premiumwork.es` |
| WhatsApp | Número configurado `34604858113` |

Por petición del usuario, Instagram, LinkedIn y Facebook apuntan provisionalmente a la página principal de cada red social, con apertura en nueva pestaña. No son todavía perfiles oficiales de Premium Work.

Los enlaces legales del footer ya abren las páginas de aviso legal, privacidad y cookies. Se muestran como borrador hasta completar los datos del titular en `lib/legal.ts`. El aviso de cookies permite aceptar, rechazar y configurar la preferencia; no hay analítica ni publicidad instalada.

## Diseño de los formularios

`/registro` y `/solicitar-servicio` integran los campos en el fondo, sin tarjeta blanca ni borde exterior. El degradado va de arriba abajo: azul oscuro, azul más claro y un toque dorado al final. Las letras y campos son claros para mantener el contraste.

Entre el navbar y el contenido se añadió una tira de 48 px con degradado horizontal y halo estático suave. Sus estilos están en `.form-separator`. El fondo general usa `.service-request-surface` y los campos `.integrated-form`.

## Candidatos y CV

El formulario de `/registro` recoge nombre, email, teléfono, ciudad, años de experiencia, sector, empresas anteriores, puesto de interés y disponibilidad, consentimiento y un CV en PDF de hasta 5 MB.

`POST /api/candidatos` valida los campos y el archivo, sube el PDF al bucket privado `candidate-cvs` y guarda los datos en `candidates`. La confirmación solo aparece si ambas operaciones terminan correctamente. Ante un fallo de inserción se intenta eliminar el archivo recién subido.

El panel `/admin/candidatos` filtra por experiencia mínima/máxima, sector y empresas anteriores, y permite descargar el CV mediante una ruta protegida. Muestra hasta 200 coincidencias sin paginación. No hay filtros de selección por sexo o nacionalidad ni extracción automática del contenido del CV.

Explicación completa: [IMPLEMENTACION_CANDIDATOS.md](IMPLEMENTACION_CANDIDATOS.md).

## Clientes y solicitudes comerciales

El formulario de `/solicitar-servicio` guarda datos de contacto, empresa, sector, servicio, ciudad y descripción. Fecha del evento, cantidad de profesionales y presupuesto son opcionales. Conserva la preselección de sector y servicio procedente de los enlaces.

`POST /api/clientes` valida los datos e inserta una fila en `client_requests`. Cada fila representa una solicitud: una empresa puede enviar varias sin sobrescribir las anteriores. El formulario ya no abre el correo y no envía notificaciones automáticas.

El panel `/admin/clientes` permite combinar filtros por empresa, ciudad, sector, servicio, fechas del evento, personal y presupuesto. Los resultados se ordenan por recepción y se paginan de 50 en 50. Los valores opcionales sin definir se almacenan como `NULL`.

Explicación completa: [IMPLEMENTACION_CLIENTES.md](IMPLEMENTACION_CLIENTES.md).

## Acceso a los paneles privados

Con el servidor local iniciado:

- Clientes: `http://localhost:3000/admin/clientes`.
- Candidatos: `http://localhost:3000/admin/candidatos`.

Ambos utilizan **CANDIDATE_ADMIN_TOKEN**, pese al nombre de la variable. La clave es independiente de la de Supabase y debe tener al menos 32 caracteres. Se introduce en el panel y se conserva en memoria; no se añade a la URL ni se guarda de forma persistente en el navegador.

La estructura de los paneles puede cargarse sin clave, pero la API no devuelve datos ni CV sin autorización. El acceso actual usa una clave compartida, no cuentas individuales de Supabase Auth. Los paneles tienen enlaces entre sí.

## Configurar Supabase

Ejecutar en el SQL Editor del proyecto:

1. [supabase/candidates.sql](supabase/candidates.sql): tabla de candidatos, permisos y bucket privado.
2. [supabase/clients.sql](supabase/clients.sql): tabla de solicitudes comerciales, permisos e índices.

Configurar en `.env.local` y en las variables privadas del alojamiento:

```dotenv
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=TU_CLAVE_PRIVADA_DEL_SERVIDOR
CANDIDATE_ADMIN_TOKEN=UNA_CLAVE_ADMINISTRATIVA_ALEATORIA_DE_AL_MENOS_32_CARACTERES
```

No usar el prefijo `NEXT_PUBLIC_` ni publicar las claves. Reiniciar el servidor al configurarlas. Los scripts habilitan Row Level Security, revocan acceso directo a los roles públicos de las tablas y mantienen el bucket de CV privado. El servidor realiza las operaciones con la clave de servicio.

Instrucciones adicionales: [supabase/SETUP.md](supabase/SETUP.md).

## Verificación antes de publicar

1. Configurar Supabase y comprobar el guardado real de una candidatura con PDF y una solicitud comercial.
2. Verificar que ambos paneles filtran correctamente y que las consultas y descargas sin clave devuelven `401`.
3. Revisar navegación desde portada y formularios, especialmente la llegada a «Acerca de nosotros».
4. Comprobar carruseles, esquinas, contraste y textos en móvil y escritorio; revisar las animaciones al subir y bajar.
5. Ejecutar las 16 pruebas y la compilación de producción.
6. Configurar HTTPS y límites de peticiones en el alojamiento. El tamaño máximo admitido por el alojamiento debe ser compatible con la subida del CV.
7. Definir el aviso de privacidad, conservación y eliminación de datos, completar las páginas legales y sustituir los enlaces provisionales de redes cuando existan los perfiles oficiales.

No hay todavía cuentas administrativas individuales, auditoría, notificaciones automáticas ni interfaces de edición y eliminación. La comprobación básica del PDF no sustituye un análisis antivirus. Las tareas pendientes de conexión y producción están también detalladas en los documentos de cada integración.
## Privacidad y cookies: actualización de septiembre de 2026

Se añadieron `/aviso-legal`, `/politica-de-privacidad` y `/politica-de-cookies`, con navegación, información en los formularios y enlaces a derechos. El consentimiento para la bolsa de candidatos se diferencia de la lectura de información en las solicitudes comerciales; no hay suscripción publicitaria.

El aviso presenta aceptar, rechazar y configurar con igual visibilidad. Como no hay categorías opcionales, aceptar y rechazar mantienen únicamente lo necesario. La elección se guarda solo tras una acción en `pw_cookie_preferences` (localStorage, no cookie HTTP), durante 180 días. El usuario puede no recordarla, borrarla desde la configuración o modificarla desde el acceso permanente. Ninguna elección autoriza rastreadores futuros.

Las fuentes DM Sans y Playfair Display se descargaron con sus licencias y se sirven desde `public/fonts/`; se eliminó Google Fonts del CSS. Se añadieron cabeceras de seguridad y noindex para API/paneles. El footer puede crecer para que los enlaces legales no queden recortados en móvil.

Las solicitudes nuevas registran `privacy_version`. Ejecutar `supabase/privacy-update.sql` en tablas existentes. La identidad, domicilio, NIF, registro, conservación, proveedores y transferencias deben completarse en `lib/legal.ts`; `reviewed` permanece en `false`. Los envíos de producción están bloqueados mientras falten esos datos, aunque el desarrollo permite seguir probando. Esto no sustituye la revisión jurídica ni los procedimientos de conservación, derechos y seguridad.

Se añadieron cuatro pruebas de privacidad a las 16 existentes y tres comprobaciones de navegador en `tests/browser/privacy.spec.ts`, ejecutables con `npx.cmd playwright test` después del build. La prueba de bloqueo en producción corresponde a la configuración de borrador y debe adaptarse al activarla.

Documentación completa y tareas del titular: [PUESTA_EN_MARCHA_LEGAL.md](PUESTA_EN_MARCHA_LEGAL.md).
El aviso de cookies se incluye en el HTML inicial y permanece visible hasta aceptar, rechazar o guardar preferencias. Recuperar una elecci�n anterior no lo cierra autom�ticamente; se vuelve a mostrar al abrir o recargar la página de inicio. No aparece en los formularios ni en las demás rutas.

## Profesiones y footer en m�vil

Los bloques de las seis profesiones ya se muestran tambi�n en m�vil, con texto y fotograf�a apilados, im�genes redondeadas y margen de ancla para el navbar. Los enlaces de profesiones del men�, banda y footer llevan a `/#identificador`. Dentro de cada bloque, �Solicitar este servicio� abre el formulario con el servicio preseleccionado. ��Qu� necesitas?� mantiene sus accesos a candidatos y empresas.

El men� m�vil cierra al elegir un enlace y permite cerrar con Escape; mientras est� abierto bloquea el scroll del fondo. El footer tiene mayor interlineado en m�vil, �todo funcione.� en una l�nea de bloque independiente y contacto/redes apilados en pantallas estrechas. Las profesiones del footer est�n disponibles tambi�n en m�vil.

Las pruebas `tests/browser/mobile.spec.ts` comprueban las seis anclas, el cierre del men�, la preselecci�n del servicio y la composici�n del footer a 360 px. El env�o real sigue dependiendo de Supabase y de completar la configuraci�n legal.
