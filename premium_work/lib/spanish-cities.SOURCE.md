La lista `spanish-cities.json` procede de la relación de municipios del INE a 1 de enero de 2026:
https://www.ine.es/daco/daco42/codmun/26codmun.xlsx

Descargada el 14 de septiembre de 2026. Contiene 8.132 municipios, con 8.115 denominaciones distintas. Se conservan los nombres oficiales y se eliminan únicamente las denominaciones idénticas, porque el formulario guarda el nombre de la localidad.

Los alias sin tildes, las denominaciones bilingües y los artículos invertidos se resuelven en `contact-options.ts` al importar un CV. Los datos se incluyen localmente y el formulario no consulta servicios externos.
