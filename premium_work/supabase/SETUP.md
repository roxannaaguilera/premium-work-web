# Candidaturas en Supabase

1. Crea el proyecto Supabase y ejecuta `supabase/candidates.sql` en su SQL Editor.
2. En `.env.local` (desarrollo) y en las variables privadas del alojamiento (producción), configura:

```dotenv
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=TU_CLAVE_PRIVADA_DEL_SERVIDOR
CANDIDATE_ADMIN_TOKEN=UNA_CLAVE_ALEATORIA_DE_AL_MENOS_32_CARACTERES
```

No uses el prefijo `NEXT_PUBLIC_` para estas claves. Nunca compartas la clave de servicio en el navegador. Genera una clave administrativa independiente con un gestor de contraseñas. Reinicia el servidor después de configurar las variables.

3. Envía una candidatura de prueba desde `/registro`, con un PDF de hasta 5 MB. El mensaje de éxito solo aparece después de guardar los datos y el archivo.
4. Abre `/admin/candidatos` e introduce **CANDIDATE_ADMIN_TOKEN**, no la clave de Supabase. Filtra por experiencia, sector o empresa y descarga el PDF. La clave se conserva solo en memoria hasta cerrar o recargar la página.
5. Comprueba desde una sesión sin clave que `/api/candidatos` y las descargas devuelven 401. El bucket debe permanecer privado.

El panel muestra hasta 200 coincidencias; utiliza los filtros para acotar la búsqueda. Los CV se guardan con UUID, sin nombres de personas en las rutas. Si falla la inserción de datos, se intenta eliminar el archivo recién subido; comprueba posibles archivos huérfanos si Storage no responde durante esa limpieza.

El formulario comercial también guarda solicitudes en Supabase: ejecuta además `supabase/clients.sql` y consulta `/admin/clientes` con la misma clave administrativa. Consulta `IMPLEMENTACION_CLIENTES.md` para los filtros y el flujo completo. Para producción, utiliza HTTPS y configura límites de peticiones en el alojamiento para los envíos y el acceso administrativo. La clave compartida del panel puede sustituirse por Supabase Auth con cuentas individuales cuando se defina el equipo autorizado.

Antes de recoger candidaturas reales, incorpora el aviso de privacidad definitivo y define el plazo de conservación y el procedimiento de eliminación de datos y CV. No se han inventado textos legales ni plazos.

Documentación: https://supabase.com/docs/guides/storage/uploads/standard-uploads y https://supabase.com/docs/guides/api/securing-your-api
