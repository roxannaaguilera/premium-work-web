import { defineConfig } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT || 3107);

export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  use: { baseURL: `http://127.0.0.1:${port}`, browserName: "chromium", channel: process.platform === "win32" ? "msedge" : undefined, headless: true },
  webServer: { command: `node node_modules/next/dist/bin/next start -p ${port}`, url: `http://127.0.0.1:${port}`, reuseExistingServer: false, timeout: 60000 },
});
