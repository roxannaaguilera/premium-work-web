type SubmissionResult = { ok?: boolean; error?: string; errors?: Record<string, string> };

// Never retry a POST automatically: a lost response does not mean it was not saved.
export async function submitForm(url: string, options: RequestInit): Promise<SubmissionResult> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new Error("No tienes conexión a Internet. Tus datos siguen en el formulario; recupera la conexión antes de enviarlos.");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);
  try {
    const response = await fetch(url, { ...options, credentials: "same-origin", signal: controller.signal });
    let result: SubmissionResult;
    try {
      result = await response.json();
    } catch {
      if (response.status === 413) throw new Error("El archivo es demasiado grande. Adjunta un PDF de hasta 4 MB.");
      throw new Error(`El servidor no ha devuelto una respuesta válida (${response.status}). Tus datos siguen en el formulario. Inténtalo más tarde.`);
    }
    if (!result || typeof result !== "object") throw new Error("No se ha podido confirmar el envío. Tus datos siguen en el formulario.");
    if (!response.ok) return { error: result.error || "No se ha podido guardar. Inténtalo más tarde.", errors: result.errors };
    if (result.ok !== true) throw new Error("No se ha podido confirmar el envío. Tus datos siguen en el formulario.");
    return result;
  } catch (error) {
    if (controller.signal.aborted || error instanceof TypeError) {
      throw new Error("Se ha interrumpido la conexión y no podemos confirmar si se guardó el envío. Tus datos siguen en el formulario. Comprueba tu conexión antes de volver a intentarlo.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
