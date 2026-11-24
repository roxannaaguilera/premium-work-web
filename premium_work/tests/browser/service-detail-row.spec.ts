import { test, expect } from "@playwright/test";

// Flechas de escritorio de «Otros servicios» (2026-11-24): en escritorio
// la rueda del ratón no mueve una fila horizontal y la barra está oculta,
// así que la fila lleva flechas que avanzan exactamente una tarjeta por
// clic. En móvil no existen: ahí el gesto es deslizar.
// Avance automático y lento (2026-11-24): la fila se mueve sola una
// tarjeta cada pocos segundos, y se queda quieta al pasar el cursor.
test("las flechas de escritorio avanzan una tarjeta por clic", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/servicios/festivales");
  await page.waitForTimeout(2500);

  // Bajar a la sección para que las tarjetas entren en vista y su
  // animación de entrada termine (antes de eso su área de snap no es final).
  await page.evaluate(() => document.getElementById("otros-servicios")?.scrollIntoView({ behavior: "instant" as ScrollBehavior }));
  await page.waitForTimeout(1800);

  const row = page.locator("#otros-servicios [class*='snap-x']");
  await expect(row).toBeVisible();
  const next = page.getByRole("button", { name: "Ver el servicio siguiente" });
  const prev = page.getByRole("button", { name: "Ver el servicio anterior" });
  await expect(next).toBeVisible();
  await expect(prev).toBeVisible();

  const read = () => row.evaluate((el) => ({
    left: Math.round(el.scrollLeft),
    step: (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft,
  }));
  const { step } = await read();
  expect(step).toBeGreaterThan(300);

  const s0 = await read();
  await next.click();
  await page.waitForTimeout(1500);
  const s1 = await read();
  expect(s1.left - s0.left).toBe(step);

  await prev.click();
  await page.waitForTimeout(1500);
  const s2 = await read();
  expect(s2.left - s1.left).toBe(-step);
});

test("en móvil no hay flechas en otros servicios", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/servicios/festivales");
  await page.waitForTimeout(2500);

  await page.evaluate(() => document.getElementById("otros-servicios")?.scrollIntoView({ behavior: "instant" as ScrollBehavior }));
  await page.waitForTimeout(1800);
  await expect(page.getByRole("button", { name: "Ver el servicio siguiente" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Ver el servicio anterior" })).toBeHidden();
});

test("la fila avanza sola y se pausa al pasar el cursor", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/servicios/festivales");
  await page.waitForTimeout(2500);

  await page.evaluate(() => document.getElementById("otros-servicios")?.scrollIntoView({ behavior: "instant" as ScrollBehavior }));
  await page.waitForTimeout(1800);

  const row = page.locator("#otros-servicios [class*='snap-x']");
  await expect(row).toBeVisible();

  const read = () => row.evaluate((el) => ({
    left: Math.round(el.scrollLeft),
    step: (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft,
  }));
  const { step } = await read();
  const s0 = await read();
  // La fila avanza sola: esperar a que complete al menos una tarjeta.
  await expect.poll(async () => (await read()).left, { timeout: 15000 }).toBeGreaterThanOrEqual(s0.left + step);
  await page.waitForTimeout(1500);
  const s1 = await read();
  expect(s1.left - s0.left).toBeGreaterThanOrEqual(step);
  expect((s1.left - s0.left) % step).toBe(0);

  // Con el cursor encima, la fila se queda quieta: dejar que se asiente
  // cualquier desplazamiento en curso y luego comprobar que no se mueve.
  await row.hover();
  await page.waitForTimeout(1500);
  const s2 = await read();
  await page.waitForTimeout(7000);
  const s3 = await read();
  expect(s3.left).toBe(s2.left);
});
