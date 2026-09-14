# Premium Work

Web corporativa de Premium Work con Next.js, React, TypeScript, Tailwind CSS y Framer Motion. Incluye formularios y paneles privados preparados para Supabase.

La documentación principal, actualizada el 11 de septiembre de 2026, está en **[GUIA_DEL_PROYECTO.md](GUIA_DEL_PROYECTO.md)**. Recoge todos los cambios de diseño, animaciones, navegación, formularios y administración, junto con el estado de configuración y las tareas pendientes.

## Desarrollo

Requiere Node.js 24.x.

```powershell
npm.cmd run dev
```

La aplicación estará disponible normalmente en `http://localhost:3000`.

## Cambios incorporados

- Tipografía y colores de marca, banda dorada sólida con reflejo blanco y diseño adaptable.
- Carrusel de sectores cada 3 segundos, tarjetas redondeadas y luz dorada en el fondo.
- Features sin luz, textos con entrada lateral y tarjetas móviles con texto blanco sobre la foto.
- ServicesIntro con fundido repetible y animaciones de scroll que se repiten en las secciones actualizadas.
- Corrección del ancla «Acerca de nosotros» para respetar el navbar fijo.
- Formularios integrados en un fondo de degradado vertical azul con toque dorado y tira separadora luminosa.
- Botones conectados a formularios, preselección de servicio/sector y enlaces provisionales a las páginas principales de redes sociales.
- Candidatos con CV privado y filtros profesionales; solicitudes comerciales con filtros y paginación.
- Scripts SQL, documentación de las integraciones y 16 pruebas con Supabase simulado.

## Paneles

- [Clientes y solicitudes](http://localhost:3000/admin/clientes).
- [Candidaturas](http://localhost:3000/admin/candidatos).

Ambos requieren `CANDIDATE_ADMIN_TOKEN` para consultar datos. **La conexión real sigue pendiente de crear/configurar Supabase y ejecutar los scripts SQL.**

## Documentación

- [Guía principal del proyecto](GUIA_DEL_PROYECTO.md).
- [Implementación de candidatos](IMPLEMENTACION_CANDIDATOS.md).
- [Implementación de clientes](IMPLEMENTACION_CLIENTES.md).
- [Configuración de Supabase](supabase/SETUP.md).

## Verificación

```powershell
node --test tests/candidates.test.cjs tests/clients.test.cjs tests/privacy.test.cjs
npx.cmd tsc --noEmit
npm.cmd run build
```

`npm.cmd run start` sirve la compilación de producción. `npm.cmd run lint` ejecuta ESLint; existe una incompatibilidad previa documentada en la guía principal. Las pruebas con Supabase simulado no sustituyen la validación de una conexión real.
## Cookies y páginas legales

Ya existen aviso legal, privacidad y cookies, un aviso de preferencias configurable y fuentes de marca locales. No hay herramientas de analítica ni publicidad instaladas. Los textos son borradores hasta completar los datos del titular y proveedores en `lib/legal.ts`; los formularios de producción permanecen bloqueados hasta esa revisión.

Ver [PUESTA_EN_MARCHA_LEGAL.md](PUESTA_EN_MARCHA_LEGAL.md) para completar la configuración, aplicar la migración de privacidad y revisar las obligaciones pendientes. Hay 20 pruebas de lógica y una suite de 3 pruebas de navegador (`npx.cmd playwright test`, tras compilar).