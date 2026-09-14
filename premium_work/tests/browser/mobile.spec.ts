import { test, expect } from "@playwright/test";

const professions = ["camareros", "maitres", "office-y-housekeeping", "hostess", "personal-de-cocina", "supervisores"];
test("mobile profession links reach visible sections and retain the correct request form", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("region", { name: "Aviso de cookies y almacenamiento" }).getByRole("button", { name: "Rechazar", exact: true }).click();
  for (const slug of professions) {
    await page.getByRole("button", { name: "Abrir menú", exact: true }).click();
    await page.locator(`#mobile-navigation a[href="/#${slug}"]`).click();
    await expect(page.locator("#mobile-navigation")).toHaveCount(0);
    await expect(page).toHaveURL(new RegExp(`#${slug}$`));
    const section = page.locator(`article#${slug}`);
    await expect(section).toBeVisible();
    await expect.poll(async () => Math.round((await section.boundingBox())!.y)).toBeGreaterThanOrEqual(79);
    await expect.poll(async () => Math.round((await section.boundingBox())!.y)).toBeLessThanOrEqual(83);
    await expect(section.getByRole("link", { name: "Solicitar este servicio" })).toHaveAttribute("href", `/solicitar-servicio?servicio=${slug}`);
    await expect(page.locator(`.gold-marquee a[href="/#${slug}"]`).first()).toHaveAttribute("href", `/#${slug}`);
  }
  await page.locator("#supervisores").getByRole("link", { name: "Solicitar este servicio" }).click();
  await expect(page.locator('select[name="service"]')).toHaveValue("supervisores");
});

test("small mobile footer stays within the screen and separates its title lines", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/#contacto");
  await page.getByRole("region", { name: "Aviso de cookies y almacenamiento" }).getByRole("button", { name: "Rechazar", exact: true }).click();
  const footer = page.locator("footer");
  await expect(footer.getByRole("heading", { level: 2 })).toBeVisible();
  const typography = await footer.locator("h2").evaluate(element => ({ size: parseFloat(getComputedStyle(element).fontSize), line: parseFloat(getComputedStyle(element).lineHeight), emDisplay: getComputedStyle(element.querySelector("em")!).display }));
  expect(typography.line / typography.size).toBeGreaterThan(1.1);
  expect(typography.emDisplay).toBe("block");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  for (const slug of professions) await expect(footer.locator(`a[href="/#${slug}"]`)).toBeVisible();
  await expect(footer.locator('a[href="/solicitar-servicio"]')).toBeVisible();
  for (const path of ["/aviso-legal", "/politica-de-privacidad", "/politica-de-cookies"]) await expect(footer.locator(`a[href="${path}"]`)).toBeVisible();
});
