import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({
  channel: 'chromium',
  executablePath:
    process.env.UI_CHROMIUM_PATH ??
    (!process.env.CI && existsSync('/usr/bin/google-chrome')
      ? '/usr/bin/google-chrome'
      : undefined),
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1050 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  await page.addInitScript(() => {
    localStorage.setItem('unlikely-ui:appearance', 'dark');
  });
  await page.goto('https://ui.kreoniz.ru/#overview');
  await page.locator('.catalog-grid').waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode()));
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
  });
  await mkdir('docs/images', { recursive: true });
  await page.screenshot({
    path: 'docs/images/showcase-dark.png',
    animations: 'disabled',
  });
  console.log(
    'Captured the live dark showcase at 1440×1050, 2× pixel density.',
  );
} finally {
  await browser.close();
}
