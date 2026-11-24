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

  const row = page.locator("#otros-servicios [class*='snap-x']");
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

  // En móvil el titular sale centrado en el medio de la pantalla al abrir
  // la página, no abajo del todo.
  const titleAtRest = await page.evaluate(() => {
    const title = document.querySelector("section[aria-label] h1") as HTMLElement | null;
    if (!title) return null;
    const t = title.getBoundingClientRect();
    return { cx: t.left + t.width / 2, cy: t.top + t.height / 2 };
  });
  expect(titleAtRest).not.toBeNull();
  expect(Math.abs(titleAtRest!.cx - 195)).toBeLessThan(4);
  expect(Math.abs(titleAtRest!.cy - 422)).toBeLessThan(30);

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

// Regresión de los arreglos del 15/11 por la noche:
// 3) las filas de características respiran en móvil (icono y letra más
//    pequeños, columna de texto más ancha, el texto no toca el borde)
// 4) Otros servicios aparece al llegar a la sección, sin quedarse pegado
//    invisible (la entrada se dispara al entrar en el viewport).
test("las características respiran y otros servicios aparece al llegar", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/servicios/eventos-corporativos");
  await page.waitForTimeout(2500);

  const feat = await page.evaluate(() => {
    const rows = [...document.querySelectorAll("ul li.flex")].map((li) => {
      const h3 = li.querySelector("h3") as HTMLElement;
      const img = li.querySelector("img") as HTMLImageElement;
      const range = document.createRange();
      range.selectNodeContents(h3);
      const maxLineRight = Math.max(...[...range.getClientRects()].map((r) => r.right));
      return {
        imgW: img.getBoundingClientRect().width,
        fontPx: parseFloat(getComputedStyle(h3).fontSize),
        maxLineRight: Math.round(maxLineRight),
      };
    });
    return rows;
  });
  expect(feat.length).toBeGreaterThanOrEqual(4);
  for (const r of feat) {
    expect(r.imgW).toBeLessThanOrEqual(97);
    expect(r.fontPx).toBeLessThanOrEqual(22);
    // El texto queda dentro del panel con su margen: nunca llega al borde
    // del panel (378) ni al borde de la pantalla (390).
    expect(r.maxLineRight).toBeLessThanOrEqual(360);
  }

  // Otros servicios: al llegar, el encabezado y la primera tarjeta visible
  // ya están a la vista (opacidad 1) sin quedarse pegados en 0.
  await page.evaluate(() => document.getElementById("otros-servicios")?.scrollIntoView({ behavior: "instant" as ScrollBehavior }));
  await page.waitForTimeout(1800);
  const otros = await page.evaluate(() => {
    const row = document.querySelector("#otros-servicios [class*='snap-x']") as HTMLElement;
    const vis = row.children[6] as HTMLElement;
    const h2 = document.querySelector("#otros-servicios h2 span") as HTMLElement;
    return {
      cardOpacity: getComputedStyle(vis).opacity,
      h2Opacity: getComputedStyle(h2).opacity,
    };
  });
  expect(otros.cardOpacity).toBe("1");
  expect(otros.h2Opacity).toBe("1");
});
