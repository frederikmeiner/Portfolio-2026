import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const MOCK_PORT = 54999;

/**
 * Browser-testen kører mod et rigtigt produktionsbuild, men med en falsk
 * Supabase. NEXT_PUBLIC_-variabler bages ind ved build, så build'et skal være
 * lavet med de samme værdier — `npm run test:e2e` sørger for det.
 */
export const E2E_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${MOCK_PORT}`,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_e2e",
};

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL: `http://127.0.0.1:${PORT}`, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "node e2e/mock-supabase.mjs",
      url: `http://127.0.0.1:${MOCK_PORT}/health`,
      env: { MOCK_SUPABASE_PORT: String(MOCK_PORT) },
      reuseExistingServer: false,
    },
    {
      command: `npx next start -p ${PORT}`,
      url: `http://127.0.0.1:${PORT}/robots.txt`,
      env: E2E_ENV,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
