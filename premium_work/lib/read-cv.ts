import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { fieldsFromCv } from "./cv-fields";

GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

export async function readCv(file: File) {
  if (!file.size || file.size > 4 * 1024 * 1024 || !file.name.toLowerCase().endsWith(".pdf")) throw new Error("Selecciona un PDF no vacío de hasta 4 MB.");
  const data = new Uint8Array(await file.arrayBuffer());
  if (new TextDecoder().decode(data.subarray(0, 5)) !== "%PDF-") throw new Error("El archivo no es un PDF válido.");
  const task = getDocument({ data, useSystemFonts: true });
  // Keep very complex files from leaving the form indefinitely busy.
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      (async () => {
        const pdf = await task.promise;
        if (pdf.numPages > 20) throw new Error("La lectura automática admite hasta 20 páginas. Puedes completar los datos manualmente.");
        let text = "";
        for (let number = 1; number <= pdf.numPages; number++) {
          const page = await pdf.getPage(number);
          const content = await page.getTextContent();
          let lastY: number | undefined;
          for (const item of content.items) {
            if (!("str" in item)) continue;
            const y = item.transform[5];
            if (lastY !== undefined && Math.abs(y - lastY) > 3) text += "\n";
            text += item.str + (item.hasEOL ? "\n" : " ");
            lastY = y;
          }
          text += "\n";
          page.cleanup();
          if (text.length > 100000) break;
        }
        return fieldsFromCv(text);
      })(),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error("La lectura está tardando demasiado. Puedes completar los datos manualmente.")), 15000);
      }),
    ]);
  } finally {
    clearTimeout(timeout);
    await task.destroy();
  }
}
