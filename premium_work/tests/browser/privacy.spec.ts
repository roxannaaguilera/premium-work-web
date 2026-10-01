import { test, expect } from "@playwright/test";

test("no cookie banner is shown and only local resources load", async ({ page }) => {
  const remote: string[] = [];
  page.on("request", request => { if (/^https?:/.test(request.url()) && new URL(request.url()).hostname !== "127.0.0.1") remote.push(request.url()); });
  await page.goto("/");
  const banner = page.getByRole("region", { name: "Aviso de cookies y almacenamiento" });
  await expect(banner).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("pw_cookie_preferences"))).toBeNull();
  await page.reload();
  await expect(banner).toHaveCount(0);
  // Let the hero advance: neither hydration nor carousel timers may show a notice or write storage.
  await page.waitForTimeout(6500);
  await expect(banner).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("pw_cookie_preferences"))).toBeNull();
  expect(remote).toEqual([]);
});

test("no cookie preferences UI is shown and no storage is used on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/politica-de-cookies");
  await expect(page.getByRole("region", { name: "Aviso de cookies y almacenamiento" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Preferencias de cookies", exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("pw_cookie_preferences"))).toBeNull();
  await page.reload();
  await expect(page.getByRole("region", { name: "Aviso de cookies y almacenamiento" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Preferencias de cookies", exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("pw_cookie_preferences"))).toBeNull();
});

test("legal routes exist, forms link to privacy and production validates submissions", async ({ page, request }) => {
  for (const [route, title] of [["/aviso-legal", "Aviso legal"], ["/politica-de-privacidad", "Política de privacidad"], ["/politica-de-cookies", "Política de cookies"]]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  }
  for (const route of ["/registro", "/solicitar-servicio"]) {
    await page.goto(route);
    await expect(page.getByRole("region", { name: "Aviso de cookies y almacenamiento" })).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole("region", { name: "Aviso de cookies y almacenamiento" })).toHaveCount(0);
    await expect(page.locator('form a[href="/politica-de-privacidad"]')).toBeVisible();
  }
  for (const route of ["/api/clientes", "/api/candidatos"]) {
    const response = route.endsWith("candidatos") ? await request.post(route, { multipart: { name: "" } }) : await request.post(route, { data: {} });
    expect(response.status()).toBe(400);
    expect((await request.get(route)).status()).toBe(401);
  }
});
