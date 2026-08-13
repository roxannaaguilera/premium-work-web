# PREMIUM WORK

Web de PREMIUM WORK, desarrollada con Next.js, React y Tailwind CSS.

Este documento sirve como guía para entender la estructura del proyecto, realizar cambios y preparar la web para producción.

## Tecnologías

* Next.js
* React
* Tailwind CSS
* TypeScript
* Node.js

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/roxannaaguilera/premium-work-web.git
```

Entra en la carpeta:

```bash
cd premium-work-web
```

Instala las dependencias:

```bash
npm install
```

## Arrancar la web en local

Abre una terminal dentro de la carpeta del proyecto y ejecuta:

```powershell
npm.cmd run dev
```

Después abre en el navegador la dirección que aparezca en la terminal, normalmente:

```text
http://localhost:3000
```

Para detener el servidor:

```text
Ctrl + C
```

## Comprobar la versión de producción

Antes de publicar cambios, comprueba que el proyecto puede compilar correctamente:

```powershell
npm.cmd run build
```

Si el comando termina sin errores, el proyecto está preparado para generar la versión de producción.

## Mapa rápido del proyecto

| Quiero cambiar...                           | Archivo                       |
| ------------------------------------------- | ----------------------------- |
| Título del navegador, Google y al compartir | `app/layout.tsx`              |
| Colores, tipografías y estilos globales     | `app/globals.css`             |
| Orden de las secciones                      | `app/page.tsx`                |
| Menú superior                               | `components/Navbar.tsx`       |
| Pantalla principal                          | `components/Hero.tsx`         |
| Texto "No somos una agencia más"            | `components/Problem.tsx`      |
| Misión y valores                            | `components/Solution.tsx`     |
| Servicios                                   | `components/Features.tsx`     |
| Proceso de trabajo                          | `components/Timeline.tsx`     |
| Maqueta de tecnología / perfil              | `components/Dashboard.tsx`    |
| Comparativa y diferencial                   | `components/Differences.tsx`  |
| Testimonios                                 | `components/Testimonials.tsx` |
| Bloque final y contacto                     | `components/CTA.tsx`          |
| Pie de página, enlaces y redes              | `components/Footer.tsx`       |
| Animaciones de aparición                    | `components/Reveal.tsx`       |

## Cambiar el logo

El logo principal se encuentra en:

```text
public/brand/premium-work-logo.png
```

Es un PNG con fondo transparente.

Para reemplazarlo:

1. Conserva el formato PNG con transparencia.
2. Coloca el nuevo archivo dentro de `public/brand/`.
3. Si mantienes el nombre `premium-work-logo.png`, no necesitas modificar el código.
4. Si cambias el nombre, busca `premium-work-logo.png` dentro de `components/` y actualiza las referencias.

Actualmente el logo aparece en:

* `Navbar.tsx`
* `CTA.tsx`
* `Footer.tsx`

## Cambiar textos

Abre el componente correspondiente según el mapa anterior.

Por ejemplo, para cambiar el título principal:

```text
components/Hero.tsx
```

Busca el texto correspondiente y modifica únicamente el contenido.

Ejemplo:

```tsx
Profesionales que <em>representan</em> tu imagen.
```

Evita eliminar etiquetas como:

```tsx
<em>
<p>
<h2>
```

si no sabes exactamente qué función cumplen.

## Cambiar servicios, pasos y testimonios

Estas secciones utilizan listas de datos.

### Servicios

Archivo:

```text
components/Features.tsx
```

Busca la lista:

```text
services
```

### Proceso

Archivo:

```text
components/Timeline.tsx
```

Busca:

```text
steps
```

### Testimonios

Archivo:

```text
components/Testimonials.tsx
```

Busca:

```text
quotes
```

Los testimonios actuales son textos de ejemplo y deben sustituirse por testimonios reales antes de publicar la web.

## Cambiar contactos

Los botones principales de contacto están en:

```text
components/CTA.tsx
```

El correo actual es:

```text
hola@premiumwork.es
```

Para cambiarlo, busca ese texto dentro del proyecto y sustitúyelo por el correo definitivo.

## Cambiar redes sociales

Los enlaces de LinkedIn e Instagram están en:

```text
components/Footer.tsx
```

Actualmente utilizan:

```tsx
href="#"
```

Sustituye `#` por la URL correspondiente.

Ejemplo:

```tsx
href="https://www.linkedin.com/company/tuempresa"
```

## Cambiar colores

Los principales colores de la marca están definidos al principio de:

```text
app/globals.css
```

Actualmente:

```css
--navy: #0B1F3A;
--gold: #C9A227;
--cream: #F8F7F4;
```

También encontrarás estos colores directamente en algunos componentes mediante clases como:

```text
bg-[#0B1F3A]
text-[#C9A227]
```

Si se modifica la identidad visual, conviene actualizar primero `globals.css` y después buscar los códigos antiguos dentro de `components/`.

## Cambiar la imagen del Hero

Actualmente la primera pantalla utiliza un fondo visual creado mediante CSS en:

```text
app/globals.css
```

La clase correspondiente es:

```text
.hero-photo-placeholder
```

Cuando exista una fotografía definitiva:

1. Guarda la imagen en:

```text
public/images/
```

2. Por ejemplo:

```text
public/images/hero-hospitality.jpg
```

3. Integra la imagen desde:

```text
components/Hero.tsx
```

4. Mantén una capa oscura sobre la fotografía para garantizar la legibilidad del texto.

## Estructura principal

```text
premium-work-web/
│
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Problem.tsx
│   ├── Solution.tsx
│   ├── Features.tsx
│   ├── Timeline.tsx
│   ├── Dashboard.tsx
│   ├── Differences.tsx
│   ├── Testimonials.tsx
│   ├── CTA.tsx
│   ├── Footer.tsx
│   └── Reveal.tsx
│
├── public/
│   ├── brand/
│   └── images/
│
├── package.json
├── package-lock.json
├── README.md
└── ...
```

## Deployment

El proyecto está preparado para desplegarse en Vercel.

El flujo recomendado es:

```text
Código local
    ↓
GitHub
    ↓
Vercel
    ↓
Web publicada
```

Cada vez que se haga `push` al repositorio, Vercel puede generar automáticamente un nuevo deployment.

Durante la fase de revisión con el cliente se puede utilizar la URL temporal proporcionada por Vercel.

Una vez aprobada la web, se puede conectar el dominio definitivo de PREMIUM WORK.

## Antes de publicar cambios

Antes de hacer `push`:

1. Guarda todos los archivos.
2. Comprueba la web en ordenador.
3. Comprueba la versión móvil.
4. Revisa enlaces y botones.
5. Ejecuta:

```powershell
npm.cmd run build
```

6. Si el build termina correctamente, sube los cambios:

```bash
git add .
git commit -m "Update website"
git push
```

## Pequeño diccionario

**Componente**

Una pieza independiente de la web, como el menú, el Hero o el footer.

**CTA**

Call To Action. Un botón o elemento que invita al usuario a realizar una acción.

**`className`**

Propiedad utilizada para aplicar estilos a un elemento.

**`href`**

Dirección a la que apunta un enlace.

**`public/`**

Carpeta destinada a archivos públicos como imágenes, logos y otros recursos.

## Proyecto

PREMIUM WORK

Web corporativa desarrollada con Next.js, React y Tailwind CSS.
