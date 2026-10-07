# Prompt para Cursor — Transformar Premium Work al estilo landonorris.com

## Contexto
Este repo es la web de **Premium Work** (Next.js + TypeScript + Tailwind): agencia premium
de personal para eventos en Madrid. Servicios: camareros/as, maîtres, office y
housekeeping, hostess, personal de cocina, supervisores. Sectores: hoteles,
restaurantes, catering, eventos corporativos, eventos deportivos, festivales,
bodas y celebraciones, eventos privados. La web debe verse MUY actual, al nivel
de landonorris.com.

## Referencia visual: landonorris.com
- Fondo oscuro, tipografía display GIGANTE (titulares a pantalla completa).
- Acento de color vivo (allí lima; aquí mantener la paleta de marca: azul royal
  `#2451e6`, azul medianoche `#0a1428`, diamantes amarillos `#eab308`).
- Secciones de alto contraste, marquees infinitos, galerías con hover que cambia
  la imagen, CTAs grandes en píldora.
- landonorris.com está hecha en Webflow, pero este proyecto es Next.js: replica
  el MISMO lenguaje visual y de movimiento en código. No uses Webflow.

## Stack de movimiento (instálalo y úsalo)
- **GSAP + ScrollTrigger + SplitText**: revelados de texto, secciones fijadas
  (pin), animaciones con scrub ligadas al scroll.
- **Lenis**: scroll suave, sincronizado con ScrollTrigger vía `gsap.ticker`.
- **three.js**: acentos 3D ligeros (partículas, haces de luz, fondo del hero).
  Lazy-load por debajo del fold, `devicePixelRatio` capado a 2.
- **Rive**: micro-animaciones (logo / diamante animado, iconos de sección).
- **Transiciones de página estilo Taxi.js**: transición animada entre rutas del
  App Router (componente de transición + View Transitions API donde aplique).

## Idea creativa elegida — «El día del evento»
Narrativa de 24 horas: el scroll avanza el reloj de un día de evento.
- **Mañana** (amanecer): housekeeping y montaje. Luz cálida de primera hora.
- **Mediodía**: personal de cocina en plena acción. Luz blanca de día.
- **Tarde** (atardecer): eventos corporativos y deportivos. Tonos dorados.
- **Noche** (gala nocturna): bodas, galas, festivales. Azul medianoche con
  haces de luz y partículas doradas.
La propia página "se hace de noche" mientras se baja: el fondo y la iluminación
cambian de amanecer a gala nocturna ligados al scroll (scrub). Un sol/reloj
animado (three.js o Rive) marca el progreso de la jornada, fijo en una esquina.
Cada franja horaria presenta su sector con fotografía a pantalla completa y
titular gigante con SplitText. Toda la home gira en torno a esta idea.

## Requisitos
- **Mobile-first y totalmente responsive**: experiencia 3D/motion completa en
  desktop; en móvil versión simplificada y rápida (2D, sin WebGL pesado).
- **Mantener todo lo funcional**: rutas (`/solicitar-servicio`, `/registro`,
  `aviso-legal`, `politica-de-privacidad`, `politica-de-cookies`), formularios
  con su validación actual, anclas, copy en español, SEO (titles, metas).
- **Paleta de marca intacta**: azul royal, azul medianoche, diamantes amarillos.
  Nada de lima.
- **Accesibilidad**: respetar `prefers-reduced-motion` (reducir a fades), texto
  real en HTML (no meter todo el copy dentro del canvas), contraste suficiente,
  orden de foco intacto.
- **Performance**: LCP rápido, animar solo `transform` y `opacity`, assets
  comprimidos (webp), preloader si la escena 3D tarda.
- `npm run build`, `tsc --noEmit` y los tests (unit + Playwright) deben seguir
  pasando. Commits en inglés, Conventional Commits.

## Proceso
1. Instala las dependencias y crea los componentes base de motion
   (`SmoothScroll` con Lenis, `Reveal` con SplitText, `PageTransition`).
2. Rediseña el hero según la idea elegida.
3. Extiende el lenguaje al resto de secciones (servicios, sectores, why-us,
   footer).
4. Verifica responsive en 360px, 768px y 1440px, y con `prefers-reduced-motion`
   activado.
