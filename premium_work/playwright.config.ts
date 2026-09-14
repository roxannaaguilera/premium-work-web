import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  use: { baseURL: "http://127.0.0.1:3107", browserName: "chromium", channel: process.platform === "win32" ? "msedge" : undefined, headless: true },
  webServer: { command: "node node_modules/next/dist/bin/next start -p 3107", url: "http://127.0.0.1:3107", reuseExistingServer: false, timeout: 60000 },
});
