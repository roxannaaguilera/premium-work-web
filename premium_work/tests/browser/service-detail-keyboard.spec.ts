import { test, expect } from "@playwright/test";

// Navegación con las flechas del teclado (2026-11-24): sin botones en
// pantalla, la fila se pasa con ← → cuando tiene el foco (o una de sus
// tarjetas). Cada pulsación avanza exactamente una tarjeta.
test("las flechas del teclado pasan la fila una tarjeta", async ({ page }) => {
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

  // Con el foco en la fila: → avanza una tarjeta, ← vuelve.
  await row.focus();
  const s0 = await read();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(1200);
  const s1 = await read();
  expect(s1.left - s0.left).toBe(step);
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(1200);
  const s2 = await read();
  expect(s2.left).toBe(s0.left);
});

test("las flechas del teclado también funcionan con una tarjeta enfocada", async ({ page }) => {
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

  // La primera tarjeta enfocable pertenece al juego clonado de la
  // izquierda, fuera de la pantalla: enfocarla desplazaría la fila y
  // dispararía el recentrado del bucle. Se enfoca la primera tarjeta del
  // juego central, que es la visible.
  await row.locator("a").nth(6).focus();
  const s0 = await read();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(1200);
  const s1 = await read();
  expect(s1.left - s0.left).toBe(step);
});
