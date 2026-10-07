# Sección lista para pegar en el prompt de Cursor — «Escaparate flotante de servicios»

> Bloque redactado el 2026-10-07 a partir del brief aprobado por Roxanna (screenshot
> de referencia tipo Agrumea + fotos Pexels verificadas). Pegar al final de
> `prompt-cursor-landonorris.md`, antes de la sección de Requisitos si se quiere.

## Sección nueva: «Escaparate flotante de servicios»

Inspirada en el escaparate flotante de agrumeafarm.it (nominada a Awwwards):
productos dispersos con rotación sobre una mancha orgánica de color, tipografía
gigante detrás y parallax ligado al scroll. Aquí los "tarros" se sustituyen por
**una tarjeta fotográfica por servicio de Premium Work**.

**Imágenes (ya descargadas en el repo)**
- `public/images/escaparate-flotante/camareros.jpg` → Camareros/as
- `public/images/escaparate-flotante/maitres.jpg` → Maîtres
- `public/images/escaparate-flotante/housekeeping.jpg` → Office y Housekeeping
- `public/images/escaparate-flotante/hostess.jpg` → Hostess
- `public/images/escaparate-flotante/cocina.jpg` → Personal de cocina
- `public/images/escaparate-flotante/supervisores.jpg` → Supervisores

Todas son fotos gratuitas de Pexels (verificadas, gente real en acción,
varias riendo). Al ser rectangulares, el elemento se adapta: tarjetas flotantes
con marco fino, rotadas sobre la mancha, en vez de recortes con transparencia.

**Composición**
- Contenedor relativo a pantalla completa: 6 tarjetas en posición absoluta,
  cada una con su rotación (±4–10°) y desplazamiento, superpuestas en capas
  (z-index). `drop-shadow` idéntico en todas para que parezcan flotar.
- Detrás: palabra gigante en tipografía display — "SERVICIOS" o "EVENTOS" —
  sólida o con contorno, parcialmente tapada por las tarjetas.
- La mancha burdeos de la referencia se sustituye por una forma orgánica en
  azul royal `#2451e6` (SVG o `border-radius` irregular en CSS). Diamantes
  amarillos `#eab308` como acento flotante, coherentes con la marca.

**Movimiento (GSAP + ScrollTrigger; sin three.js para esta sección)**
- Parallax con scrub: cada tarjeta se desplaza a distinta velocidad con el
  scroll. Flotación idle suave (yoyo) + hover que eleva la tarjeta.
- Opcional: arrastrar las tarjetas con Draggable.
- Las tarjetas entran con revelado por líneas del titular del servicio
  (SplitText) al llegar al viewport.

**Responsive**
- Móvil: 3 tarjetas, menos rotación, palabra de fondo más pequeña. Misma
  sección, menos piezas. Sin WebGL.

**Ubicación en la narrativa «El día del evento»**
- Situar la sección en la franja de **noche (gala)**: el escaparate funciona
  como "el equipo que hace posible la gala", cerrando la jornada.
