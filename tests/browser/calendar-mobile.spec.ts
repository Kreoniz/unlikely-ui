import { test, expect } from '@playwright/test';

for (const width of [320, 390]) {
  for (const appearance of ['light', 'dark']) {
    test(`inline calendar shows every day at ${width}px in ${appearance} appearance on touch screens`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        hasTouch: true,
        isMobile: true,
        viewport: { width, height: 740 },
        baseURL: 'http://127.0.0.1:5177',
      });
      const page = await context.newPage();
      await page.goto('/#components/calendar');
      if (appearance === 'dark')
        await page
          .getByRole('button', { name: 'Switch to dark appearance' })
          .click();

      const calendar = page.locator('.u-calendar');
      await calendar.scrollIntoViewIfNeeded();
      const weekdays = calendar.getByRole('columnheader', {
        includeHidden: true,
      });
      await expect(weekdays).toHaveCount(7);
      const lastDay = calendar
        .locator('tbody tr')
        .last()
        .locator('td')
        .last()
        .getByRole('button');
      await expect(lastDay).toBeInViewport();

      const calendarBounds = (await calendar.boundingBox())!;
      for (const lastColumn of [weekdays.last(), lastDay]) {
        const bounds = (await lastColumn.boundingBox())!;
        expect(bounds.x).toBeGreaterThanOrEqual(calendarBounds.x);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(
          calendarBounds.x + calendarBounds.width + 0.5,
        );
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      }
      expect(
        await calendar.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
      const targetSizes = await calendar
        .locator('.u-cal-day_button')
        .evaluateAll((buttons) =>
          buttons.map((button) => {
            const { width, height } = button.getBoundingClientRect();
            return { width, height };
          }),
        );
      for (const size of targetSizes) {
        expect(size.width).toBeGreaterThanOrEqual(44);
        expect(size.height).toBeGreaterThanOrEqual(44);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await context.close();
    });
  }
}
