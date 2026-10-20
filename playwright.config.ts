import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const executablePath =
  process.env.UI_CHROMIUM_PATH ??
  (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  outputDir: process.env.UI_CONSUMER_URL
    ? 'test-results/consumer'
    : 'test-results/showcase',
  use: {
    browserName: 'chromium',
    launchOptions: { executablePath },
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'showcase',
      testMatch: ['showcase.spec.ts', 'calendar-mobile.spec.ts'],
      use: { baseURL: 'http://127.0.0.1:5177' },
    },
    {
      name: 'consumer',
      testMatch: 'consumer.spec.ts',
      use: { baseURL: process.env.UI_CONSUMER_URL ?? 'http://127.0.0.1:5181' },
    },
  ],
  webServer: process.env.UI_CONSUMER_URL
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://127.0.0.1:5177',
        reuseExistingServer: !process.env.CI,
      },
});
