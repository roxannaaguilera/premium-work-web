import { test, expect } from "@playwright/test";

for (const path of ["/registro", "/solicitar-servicio"]) {
  test(`${path}: validates fields, focuses errors and submits corrected data`, async ({ page }) => {
    let submissions = 0;
    await page.route("**/api/*", async route => {
      if (path === "/solicitar-servicio") {
        const data = route.request().postDataJSON();
        expect(data.phone_country).toBe("DE");
        expect(data.phone).toBe("15123456789");
      }
      submissions++;
      await route.fulfill({ status: 201, contentType: "application/json", body: '{"ok":true}' });
    });
    await page.goto(path);
    const form = page.locator("form.integrated-form");
    await expect(form.locator('select[name="city"] option')).toHaveCount(8116);
    await form.locator('button[type="submit"]').click();
    await expect(form.locator('[name="name"]')).toBeFocused();
    await expect(form.locator('[name="name"]')).toHaveAttribute("aria-invalid", "true");
    expect(submissions).toBe(0);
    for (const [name, value] of Object.entries({ name: "Ana", email: "invalid", phone: "abcdef" })) await form.locator(`[name="${name}"]`).fill(value);
    await form.locator('button[type="submit"]').click();
    for (const name of ["name", "email", "phone"]) await expect(form.locator(`[name="${name}"]`)).toHaveAttribute("aria-invalid", "true");
    expect(submissions).toBe(0);
    await form.locator('[name="city"]').selectOption("Madrid");
    await form.locator('[name="name"]').fill("María García");
    await form.locator('[name="email"]').fill("maria@example.com");
    await form.locator('[name="phone"]').fill("+34 600 123 456");
    if (path === "/registro") {
      await expect(form.locator('[name="years"]')).toHaveAttribute("type", "text");
      await expect(form.locator('[name="years"]')).toHaveAttribute("inputmode", "decimal");
      await expect(form.getByRole("textbox", { name: /^Indica cuántos años tienes de experiencia/ })).toBeVisible();
      await form.locator('[name="years"]').fill("1.5");
      await form.locator('[name="sector"]').selectOption("Hoteles");
      await form.locator('[name="companies"]').fill("Hotel de prueba");
      await form.locator('[name="availability"]').fill("Fines de semana");
      await form.locator('[name="cv"]').setInputFiles({ name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("not a PDF") });
      await form.locator('[name="consent"]').check();
      await form.locator('button[type="submit"]').click();
      await expect(form.locator('[name="cv"]')).toHaveAttribute("aria-invalid", "true");
      expect(submissions).toBe(0);
      await form.locator('[name="cv"]').setInputFiles({ name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.7\nTest") });
    } else {
      await form.getByRole("button", { name: "País del teléfono: España +34", exact: true }).click();
      const countries = form.getByRole("dialog", { name: "Selecciona el país del teléfono" });
      await countries.getByRole("searchbox").fill("Alemania");
      await expect(countries.getByRole("button", { name: "Alemania +49" }).locator("svg")).toBeVisible();
      await countries.getByRole("button", { name: "Alemania +49" }).click();
      await form.locator('[name="phone"]').fill("15123456789");
      await form.locator('[name="company"]').fill("Hotel de prueba");
      await form.locator('[name="sector"]').selectOption("hoteles");
      await form.locator('[name="service"]').selectOption("camareros");
      await form.locator('[name="message"]').fill("Necesitamos personal para un evento.");
      await form.locator('[name="consent"]').check();
      await form.locator('[name="staff_count"]').fill("1.5");
      await form.locator('button[type="submit"]').click();
      await expect(form.locator('[name="staff_count"]')).toHaveAttribute("aria-invalid", "true");
      expect(submissions).toBe(0);
      await form.locator('[name="staff_count"]').fill("2");
    }
    await expect(form.locator('button[type="submit"]')).toBeEnabled();
    expect(await form.evaluate(element => new FormData(element as HTMLFormElement).get("city"))).toBe("Madrid");
    await form.locator('button[type="submit"]').click();
    await expect(form.getByRole("status").filter({ hasText: "Hemos recibido" })).toBeVisible();
    expect(submissions).toBe(1);
    await expect(form.locator('[aria-invalid="true"]')).toHaveCount(0);
  });
}
