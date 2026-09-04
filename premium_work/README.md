# Premium Work

Sitio corporativo de Premium Work, construido con Next.js, TypeScript y Tailwind CSS.

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Scripts

- `npm run dev`: inicia el entorno de desarrollo.
- `npm run build`: genera y valida la compilación de producción.
- `npm run start`: sirve la compilación de producción.
- `npm run lint`: ejecuta ESLint.

## Actualizaciones de interfaz

### Septiembre de 2026

- El hero móvil ya no utiliza imágenes ni carrusel: se presenta sobre un fondo azul marino uniforme y conserva el mensaje principal y la llamada a la acción.
- La sección de servicios se organiza en escritorio como franjas alternadas: texto e imagen intercambian su posición en cada profesión. Las imágenes se muestran en formato vertical y con encuadres que preservan rostros y manos.
- En móvil y tablet, el listado de profesiones se sustituye por un carrusel horizontal manual con el título «¿Qué necesitas?» y dos accesos: registro de candidatos y soluciones para empresas. En escritorio, cada tarjeta de servicio enlaza directamente a su bloque correspondiente.
- La sección «Nuestros servicios incluyen» se muestra en escritorio y móvil como una sección completa, con contenido reducido para que el catálogo posterior conserve su protagonismo.
- «La diferencia Premium Work» se rediseñó como una sección de pantalla completa: titular, ventajas resumidas, títulos alineados y navegación horizontal solo para móvil y tablet. La respuesta ante imprevistos se comunica como «Respuesta sin demoras».
- Los sectores se presentan en un carrusel automático e infinito: destaca un sector cada 3,8 segundos, atenúa el resto, se pausa al interactuar y permite navegación manual. Cada tarjeta enlaza al formulario de solicitud con el sector preseleccionado, sin desplazar al usuario a otra sección de la página.
- Se añadió la ruta `/solicitar-servicio`, con un formulario visual para recibir solicitudes de servicio. El envío permanece pendiente de conectar una base de datos y un proveedor de correo.
- El footer se rehízo para caber en una sola vista, con ritmo vertical equilibrado, logo gráfico, acceso a WhatsApp sin exponer el teléfono, correo, enlaces de navegación y servicios, e iconos de Instagram, LinkedIn y Facebook. Se corrigió la codificación UTF-8 de sus textos.
- Se incorporó el recurso visual `public/images/logo_nombre_premium_work.png` para la identidad de marca en el footer.
- Los CTA de candidato, empresas y envío de solicitud comparten el mismo lenguaje visual: forma de píldora, color dorado y elevación sutil al pasar el cursor.
