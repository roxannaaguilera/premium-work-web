import { test, expect } from "@playwright/test";

test("banner respects rejection and only loads local resources", async ({ page }) => {
  const remote: string[] = [];
  page.on("request", request => { if (/^https?:/.test(request.url()) && new URL(request.url()).hostname !== "127.0.0.1") remote.push(request.url()); });
  await page.goto("/");
  const banner = page.getByRole("region", { name: "Aviso de cookies y almacenamiento" });
  await expect(banner).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("pw_cookie_preferences"))).toBeNull();
  await banner.getByRole("button", { name: "Rechazar", exact: true }).click();
  await expect(banner).toHaveCount(0);
  await page.reload();
  await expect(banner).toBeVisible();
  // Let the hero advance: neither hydration nor carousel timers dismiss the notice.
  await page.waitForTimeout(6500);
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Rechazar", exact: true }).click();
  await expect(banner).toHaveCount(0);
  expect(JSON.parse((await page.evaluate(() => localStorage.getItem("pw_cookie_preferences")))!).choice).toBe("reject");
  expect(remote).toEqual([]);
});

test("preferences can be reopened, changed, and applied without storage on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/politica-de-cookies");
  await page.getByRole("region", { name: "Aviso de cookies y almacenamiento" }).getByRole("button", { name: "Configurar", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("checkbox").uncheck();
  await dialog.getByRole("button", { name: "Guardar preferencias" }).click();
  expect(await page.evaluate(() => localStorage.getItem("pw_cookie_preferences"))).toBeNull();
  await page.reload();
  await expect(page.getByRole("region", { name: "Aviso de cookies y almacenamiento" })).toBeVisible();
  await page.getByRole("region", { name: "Aviso de cookies y almacenamiento" }).getByRole("button", { name: "Aceptar", exact: true }).click();
  await page.getByRole("button", { name: "Preferencias de cookies", exact: true }).click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("legal routes exist, forms link to privacy, production is blocked while details are missing", async ({ page, request }) => {
  for (const [route, title] of [["/aviso-legal", "Aviso legal"], ["/politica-de-privacidad", "Política de privacidad"], ["/politica-de-cookies", "Política de cookies"]]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  }
  for (const route of ["/registro", "/solicitar-servicio"]) {
    await page.goto(route);
    await expect(page.locator('form a[href="/politica-de-privacidad"]')).toBeVisible();
  }
  for (const route of ["/api/clientes", "/api/candidatos"]) {
    expect((await request.post(route, { data: {} })).status()).toBe(503);
    expect((await request.get(route)).status()).toBe(401);
  }
});
