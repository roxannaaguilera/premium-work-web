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
- La sección de servicios se reorganizó en escritorio como franjas alternadas: texto a la izquierda e imagen a la derecha, invirtiendo el orden en cada profesión consecutiva.
- En móvil, el listado de profesiones se sustituye por un carrusel horizontal manual con el título «¿Qué necesitas?» y dos accesos: registro de candidatos y soluciones para empresas.
- El carrusel móvil usa desplazamiento nativo, *scroll snap* y no avanza automáticamente.
