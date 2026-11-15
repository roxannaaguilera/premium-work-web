import { test, expect } from "@playwright/test";

// Regresión de los dos arreglos móviles del detalle (2026-11-15):
// 1) la fila de Otros servicios avanza de una en una con el gesto táctil
//    (snap-stop + áreas de snap estables + salto del bucle solo al asentarse)
// 2) el objeto del héroe termina centrado en el medio de las letras
test("otros servicios avanza una tarjeta por gesto y el objeto queda en el medio del titular", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/servicios/festivales");
  await page.waitForTimeout(2500);

  // Bajar a la sección para que las tarjetas entren en vista y su
  // animación de entrada termine (antes de eso su área de snap no es final).
  await page.evaluate(() => document.getElementById("otros-servicios")?.scrollIntoView({ behavior: "instant" as ScrollBehavior }));
  await page.waitForTimeout(1800);

  const row = page.locator("#otros-servicios > div").last();
  await expect(row).toBeVisible();

  const read = () => row.evaluate((el) => ({
    left: Math.round(el.scrollLeft),
    step: (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft,
  }));
  const { step } = await read();
  expect(step).toBeGreaterThan(200);

  // Deslizar táctil de verdad (un scrollTo programático no es el gesto de
  // la usuaria: Chrome lo deja volar hasta el final sin pasar por el snap).
  const cdp = await page.context().newCDPSession(page);
  const swipe = async (fromX: number, toX: number) => {
    const box = (await row.boundingBox())!;
    const y = box.y + box.height / 2;
    const points = Array.from({ length: 9 }, (_, i) => ({
      x: fromX + ((toX - fromX) * i) / 8,
      y,
    }));
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [points[0]] });
    for (let i = 1; i < points.length; i++) {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [points[i]] });
      await new Promise((r) => setTimeout(r, 12));
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  };

  const s0 = await read();
  await swipe(320, 60);
  await page.waitForTimeout(1800);
  const s1 = await read();
  expect(s1.left - s0.left).toBe(step);

  await swipe(60, 320);
  await page.waitForTimeout(1800);
  const s2 = await read();
  expect(s2.left - s1.left).toBe(-step);

  // Héroe: al completar la subida, el centro del objeto coincide con el
  // centro del titular, y el sticky mide lo mismo que el viewport.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }));
  await page.waitForTimeout(600);
  const stickyH = await page.evaluate(() => {
    const sticky = document.querySelector("section[aria-label] > div.sticky") as HTMLElement | null;
    return sticky ? sticky.clientHeight : -1;
  });
  expect(Math.abs(stickyH - 844)).toBeLessThan(4);

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.4, behavior: "instant" as ScrollBehavior }));
  await page.waitForTimeout(900);
  const centers = await page.evaluate(() => {
    const title = document.querySelector("section[aria-label] h1") as HTMLElement | null;
    const img = document.querySelector("section[aria-label] img[alt]") as HTMLImageElement | null;
    if (!title || !img) return null;
    const t = title.getBoundingClientRect();
    const i = img.getBoundingClientRect();
    return { titleMid: t.top + t.height / 2, imgMid: i.top + i.height / 2 };
  });
  expect(centers).not.toBeNull();
  // El objeto encoge hasta la altura del titular, así que su centro debe
  // caer en el medio de las letras (margen de 12 px por el recorte de tinta).
  expect(Math.abs(centers!.imgMid - centers!.titleMid)).toBeLessThan(12);
});
