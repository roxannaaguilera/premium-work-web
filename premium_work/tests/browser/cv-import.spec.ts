import { test, expect } from "@playwright/test";

// A real PDF with a text layer, avoiding external documents or personal data.
function pdf(lines: string[]) {
  const stream = `BT /F1 12 Tf 50 780 Td 18 TL ${lines.map((line, i) => `${i ? "T* " : ""}(${line.replace(/[\\()]/g, "\\$&")}) Tj`).join("\n")} ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];
  let document = "%PDF-1.4\n";
  const offsets = [0];
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(document));
    document += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }
  const xref = Buffer.byteLength(document);
  document += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return { name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from(document) };
}

test("CV comes first, fills fields locally and preserves manual corrections on replacement", async ({ page }) => {
  let requests = 0;
  page.on("request", request => { if (request.url().includes("/api/")) requests++; });
  await page.goto("/registro");
  const form = page.locator("form.integrated-form");
  await expect(form.locator("input").first()).toHaveAttribute("name", "cv");
  await form.locator('[name="cv"]').setInputFiles(pdf([
    "Nombre: Maria Garcia", "maria@example.com", "Telefono: +34 600 123 456", "Ciudad: Toledo",
    "Perfil profesional", "4 years of experience", "Experiencia laboral", "Hotel Central - camarera",
    "Disponibilidad", "Fines de semana",
  ]));
  await expect(form.getByRole("status").filter({ hasText: "Hemos completado" })).toBeVisible();
  for (const [key, value] of Object.entries({ name: "Maria Garcia", email: "maria@example.com", phone: "600123456", city: "Toledo", years: "4", sector: "Hoteles", companies: "Hotel Central - camarera", availability: "4 years of experience\n\nFines de semana" })) {
    await expect(form.locator(`[name="${key}"]`)).toHaveValue(value);
  }
  await expect(form.locator('[name="consent"]')).not.toBeChecked();
  expect(requests).toBe(0);
  await form.locator('[name="city"]').selectOption("Cuenca");
  await form.locator('[name="cv"]').setInputFiles(pdf(["Nombre: Ana Garcia", "ana@example.com", "Ciudad: Madrid"]));
  await expect(form.locator('[name="email"]')).toHaveValue("ana@example.com");
  await expect(form.locator('[name="city"]')).toHaveValue("Cuenca");
  await expect(form.locator('[name="companies"]')).toHaveValue("");
  expect(requests).toBe(0);
  await form.locator('[name="cv"]').setInputFiles({ name: "broken.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-invalid") });
  await expect(form.getByRole("status").filter({ hasText: "No hemos podido leer" })).toBeVisible();
  await expect(form.locator('[name="email"]')).toHaveValue("");
  await expect(form.locator('[name="city"]')).toHaveValue("Cuenca");
});

test("PDF without text leaves the form available for manual completion", async ({ page }) => {
  await page.goto("/registro");
  const form = page.locator("form.integrated-form");
  await form.locator('[name="cv"]').setInputFiles(pdf([]));
  await expect(form.getByRole("status").filter({ hasText: "rellena los campos manualmente" })).toBeVisible();
  await expect(form.locator('[name="name"]')).toBeEnabled();
  await form.locator('[name="name"]').fill("Ana Garcia");
  await expect(form.locator('[name="name"]')).toHaveValue("Ana Garcia");
});
