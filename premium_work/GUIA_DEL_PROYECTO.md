# Guía sencilla del proyecto PREMIUM WORK

Esta carpeta contiene la web de PREMIUM WORK. Está construida con **Next.js**, **React** y **Tailwind CSS**. No necesitas entender todo a la vez: para cambiar algo, localiza la sección correspondiente en la tabla de abajo y modifica solo ese archivo.

## Arrancar la web

Abre una terminal dentro de la carpeta `premium_work` y escribe:

```powershell
npm.cmd run dev
```

Después abre la dirección que aparezca en la terminal, normalmente `http://localhost:3000`.

Para parar el servidor: pulsa `Ctrl + C` en esa terminal.

Para comprobar que la versión final se puede publicar:

```powershell
npm.cmd run build
```

## Mapa rápido: dónde cambiar cada cosa

| Quiero cambiar... | Archivo que debes abrir |
| --- | --- |
| El título del navegador, Google y al compartir | `app/layout.tsx` |
| Colores globales, tipografías y estilos comunes | `app/globals.css` |
| El orden de las secciones de la página | `app/page.tsx` |
| Menú superior y botones del menú | `components/Navbar.tsx` |
| Pantalla principal grande | `components/Hero.tsx` |
| El texto “No somos una agencia más” | `components/Problem.tsx` |
| Misión y valores | `components/Solution.tsx` |
| Tarjetas de servicios | `components/Features.tsx` |
| Pasos del proceso | `components/Timeline.tsx` |
| Maqueta de tecnología / perfil | `components/Dashboard.tsx` |
| Comparativa y diferencial | `components/Differences.tsx` |
| Testimonios de ejemplo | `components/Testimonials.tsx` |
| Bloque final y botones de contacto | `components/CTA.tsx` |
| Pie de página, enlaces y redes | `components/Footer.tsx` |
| Animaciones suaves al aparecer | `components/Reveal.tsx` |

## Cambiar el logo

El logo que usa la web está aquí:

```text
public/brand/premium-work-logo.png
```

Es un PNG con transparencia. Para reemplazarlo en el futuro:

1. Conserva el formato PNG con fondo transparente.
2. Pon el nuevo archivo en `public/brand/`.
3. Si mantienes el mismo nombre (`premium-work-logo.png`), no hace falta cambiar código.
4. Si cambias el nombre, busca `premium-work-logo.png` en los archivos de `components/` y cambia las tres referencias.

El logo aparece en tres lugares: menú superior (`Navbar.tsx`), bloque final (`CTA.tsx`) y pie de página (`Footer.tsx`). Su tamaño se controla con las clases `h-20`, `h-40` y `h-24`. Un número mayor significa logo más grande.

## Cambiar textos

Abre el componente indicado en el mapa, busca el texto que ves en la pantalla y sustitúyelo entre las comillas o entre las etiquetas `>` y `<`.

Ejemplo: para cambiar el título principal, abre `components/Hero.tsx` y sustituye:

```tsx
Profesionales que <em>representan</em> tu imagen.
```

No borres las etiquetas como `<em>`, `<p>` o `<h2>` si no sabes qué hacen: cambia solamente las palabras que hay dentro.

## Cambiar servicios, pasos o testimonios

Estas secciones usan listas. Cada elemento entre corchetes corresponde a una tarjeta o paso visible.

- Servicios: en `components/Features.tsx`, modifica la lista llamada `services`.
- Proceso: en `components/Timeline.tsx`, modifica la lista llamada `steps`.
- Testimonios: en `components/Testimonials.tsx`, modifica la lista llamada `quotes`.

Puedes cambiar el texto sin problema. Si quieres añadir una tarjeta, copia una línea completa de la lista existente y cambia su contenido. Los testimonios actuales son texto de ejemplo; deben sustituirse por testimonios reales antes de publicar.

## Cambiar enlaces y contactos

- Los botones de contacto final están en `components/CTA.tsx`.
- El correo actual es `hola@premiumwork.es`. Busca ese texto para reemplazarlo por el correo definitivo.
- Los enlaces de LinkedIn e Instagram están en `components/Footer.tsx`. Ahora tienen `href="#"`, que es un enlace vacío. Sustituye `#` por la URL completa de cada perfil, por ejemplo `https://www.linkedin.com/company/tuempresa`.

## Cambiar colores

Los colores principales están al principio de `app/globals.css`:

```css
--navy: #0B1F3A;
--gold: #C9A227;
--cream: #F8F7F4;
```

En los componentes también verás estos valores en clases como `bg-[#0B1F3A]` (fondo azul marino) y `text-[#C9A227]` (texto dorado). Si cambias la identidad de color, modifica primero `globals.css` y después busca esos códigos en `components/`.

## Cambiar la imagen del hero

Por ahora la primera pantalla usa un fondo visual creado con CSS en `app/globals.css`, con el nombre `.hero-photo-placeholder`. Cuando tengas una foto:

1. Guarda la fotografía en `public/images/`, por ejemplo `public/images/hero-hospitality.jpg`.
2. En `components/Hero.tsx`, añade la imagen como fondo o pide ayuda para integrarla bien.
3. Mantén una capa oscura por encima para que el texto blanco se lea bien.

## Cómo están organizadas las carpetas

```text
app/                 La base de la página y los estilos globales
components/          Cada bloque visible de la landing
public/brand/        Logos e imágenes de marca que se muestran en la web
public/images/       Lugar recomendado para futuras fotografías
package.json         Comandos y librerías del proyecto
```

## Antes de publicar cambios

1. Guarda los archivos.
2. Mira la web en ordenador y móvil usando el navegador.
3. Ejecuta `npm.cmd run build`.
4. Si el comando termina con éxito, la web está lista para desplegarse.

## Pequeño diccionario

- **Componente:** una pieza de la web, por ejemplo el menú o el footer.
- **CTA:** un botón que invita a hacer algo, como “Busco personal”.
- **`className`:** estilos de un elemento. No es texto visible.
- **`href`:** la dirección a la que lleva un enlace.
- **`public/`:** archivos públicos, como logos e imágenes. Se usan en la web escribiendo una ruta que comienza por `/`.

