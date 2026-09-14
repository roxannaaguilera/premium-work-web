# Desplegar los formularios en Vercel

1. En el proyecto de Vercel, abre **Settings → Environment Variables** y copia desde `.env.local` los valores de:
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY`
   - `CANDIDATE_ADMIN_TOKEN`
2. Marca **Production** y también **Preview** si vas a probar despliegues de vista previa. No añadas `NEXT_PUBLIC_` a las claves privadas.
3. Comprueba que **Root Directory** sea `premium_work`, el directorio que contiene `package.json`, y que el framework sea **Next.js**. El proyecto usa Node.js 24.x y el comando de compilación `npm run build`.
4. Publica los cambios de código en la rama conectada a Vercel. Después de cambiar variables, ejecuta **Redeploy** desde **Deployments**. Un despliegue anterior no recibe las variables nuevas.

No es necesario configurar una clave de IA ni un servicio de lectura de PDF. El autorrelleno se ejecuta localmente en el navegador, con PDF.js y su worker incluidos en la compilación. Los PDF escaneados o protegidos pueden necesitar completar los datos manualmente.

La carga admite PDF de hasta 4 MB para que el archivo y los campos del formulario quepan en el límite de 4,5 MB de las funciones de Vercel. El bucket de Supabase sigue siendo privado.

Los envíos ya no dependen de `legal.reviewed` ni de completar `lib/legal.ts`. Se mantienen las validaciones de campos y la casilla de consentimiento. Los documentos legales conservan su estado de borrador mientras falten datos.

Fuentes: [Variables de entorno](https://vercel.com/docs/environment-variables), [límites de funciones](https://vercel.com/docs/functions/limitations).
