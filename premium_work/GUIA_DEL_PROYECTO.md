# Guía del proyecto PREMIUM WORK

Web corporativa construida con Next.js, React, Tailwind CSS y Framer Motion. La página está compuesta por componentes independientes para que cada sección pueda modificarse sin afectar al resto.

## Ejecutar y comprobar

Desde la carpeta `premium_work`:

```powershell
npm.cmd run dev
```

La web se abre normalmente en `http://localhost:3000`. Antes de publicar, validar la versión final con `npm.cmd run build`.

## Mapa de componentes

| Elemento | Archivo |
| --- | --- |
| Estructura y orden de la página | `app/page.tsx` |
| Metadatos, título e idioma | `app/layout.tsx` |
| Tipografías, colores y estilos globales | `app/globals.css` |
| Menú superior y menú móvil | `components/Navbar.tsx` |
| Hero y carrusel principal | `components/Hero.tsx` |
| Beneficios | `components/WhyUs.tsx` |
| Servicios | `components/Features.tsx` |
| Problema, solución y diferenciadores | `components/Problem.tsx`, `Solution.tsx`, `Differences.tsx` |
| Proceso | `components/Timeline.tsx` |
| Clientes y testimonios | `components/ClientsCarousel.tsx`, `Testimonials.tsx` |
| CTA y pie de página | `components/CTA.tsx`, `Footer.tsx` |

## Hero: imágenes, calidad y móvil

El hero se controla desde `components/Hero.tsx` y contiene cinco diapositivas.

- Las fotos originales de escritorio están en `public/images/hero-1.webp` hasta `hero-5.webp`.
- Las fotos móviles correspondientes están en `public/images/hero-1-mobile.webp` hasta `hero-5-mobile.webp`.
- Las versiones móviles tienen 3.200 px de ancho y WebP de calidad alta. Son nítidas en pantallas retina y mucho más ligeras que los originales, que miden entre 5.264 y 7.900 px.
- Bajo 768 px, el navegador descarga solo la versión móvil; en escritorio utiliza el original.
- Cada slide tiene `mobilePosition`, que controla el encuadre. Ajusta el porcentaje horizontal si un sujeto queda demasiado cerca del borde.
- Las capas oscuras sobre la foto garantizan que el texto conserve contraste. Mantenerlas al cambiar imágenes.

El título consta de `¿Servicio perfecto?` y `Equipo correcto.`. Su separación se controla mediante `mt-3` en el elemento `<em>`; en pantallas mayores se usa `sm:mt-5`.

Al sustituir una foto, preparar también su equivalente `-mobile.webp` a 3.200 px de ancho, formato WebP y calidad alta. Mantener el mismo número evita cambios de código.

## Navegación y menú desplegable

`components/Navbar.tsx` adapta su aspecto al fondo:

- Sobre el hero usa azul marino translúcido, texto blanco y bordes claros.
- Después de hacer scroll pasa a fondo crema y texto azul marino.
- El desplegable de Servicios y el menú móvil siguen el mismo criterio visual que el navbar.

Los enlaces y servicios se modifican en las constantes `links` y `services` al inicio de `Navbar.tsx`.

## Beneficios en móvil

`components/WhyUs.tsx` funciona como carrusel horizontal táctil en móviles:

- Cada beneficio ocupa el ancho completo y se alinea mediante *scroll snap*.
- Se puede deslizar con el dedo o usar las flechas.
- Las flechas avanzan exactamente el ancho visible, mostrando una tarjeta completa.

En escritorio las tarjetas se muestran como una fila flexible.

## Identidad visual

Los colores principales están en `app/globals.css`:

```css
--navy: #0B1F3A;
--gold: #C9A227;
--cream: #F8F7F4;
```

Los titulares usan Playfair Display (`.display`) y el texto general usa DM Sans. Los logos se encuentran en `public/brand/`.

## Cambiar textos, enlaces y contactos

Abre el componente correspondiente, busca el texto visible y reemplázalo sin eliminar sus etiquetas HTML o JSX. Los botones y datos de contacto se encuentran principalmente en `CTA.tsx`, `Navbar.tsx` y `Footer.tsx`.

## Antes de publicar

1. Comprueba hero y menú tanto en móvil como en escritorio.
2. Desliza la sección de beneficios en un móvil real.
3. Ejecuta `npm.cmd run build`.
4. Tras publicar cambios de imágenes, realiza una recarga sin caché para no ver archivos anteriores.
