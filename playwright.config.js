import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'replica/evidence/results.json' }], ['html', { open: 'never' }]],
  outputDir: 'replica/evidence/playwright',
  use: {
    baseURL: 'http://127.0.0.1:5174',
    viewport: { width: 1280, height: 900 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    acceptDownloads: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'python3 -m http.server 5174 --bind 127.0.0.1 --protocol HTTP/1.1',
    url: 'http://127.0.0.1:5174',
    reuseExistingServer: false,
    timeout: 15_000,
  },
});
