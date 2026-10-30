import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/#devspace');
});

test('allocation dividers and every exact field redistribute one conserved total', async ({
  page,
}) => {
  const study = page.getByRole('region', { name: 'Allocation bar study' });
  const input = (name: string) =>
    study.getByRole('spinbutton', { name, exact: true });
  const divider = study.getByRole('slider', { name: 'Build / Study divider' });
  await expect(input('Build')).toHaveValue('45');
  await expect(input('Study')).toHaveValue('35');
  await expect(input('Rest')).toHaveValue('20');
  await divider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(input('Build')).toHaveValue('46');
  await expect(input('Study')).toHaveValue('34');
  await input('Build').fill('40');
  await input('Build').press('Tab');
  await expect(input('Study')).toHaveValue('40');
  await input('Rest').fill('30');
  await input('Rest').press('Tab');
  await expect(input('Study')).toHaveValue('30');
  await input('Study').fill('100');
  await input('Study').press('Tab');
  await expect(input('Study')).toHaveValue('60');
  await expect(input('Rest')).toHaveValue('0');
  await input('Rest').fill('20');
  await input('Rest').press('Tab');
  await expect(input('Study')).toHaveValue('40');
  const track = study.locator('.allocation-track');
  const grip = study.locator('.allocation-grip').first();
  await track.scrollIntoViewIfNeeded();
  const box = (await track.boundingBox())!,
    handle = (await grip.boundingBox())!;
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.5, handle.y + handle.height / 2, {
    steps: 10,
  });
  await page.mouse.up();
  await expect(input('Build')).toHaveValue('50');
  await expect(input('Study')).toHaveValue('30');
  await expect(
    study.getByRole('group', { name: 'Allocation total' }),
  ).toContainText('100%');
});

test('a middle lock preserves its amount while other segments and its position change', async ({
  page,
}) => {
  const study = page.getByRole('region', { name: 'Allocation bar study' });
  const input = (name: string) =>
    study.getByRole('spinbutton', { name, exact: true });
  const segment = study.locator('.allocation-segment').nth(1);
  await segment.scrollIntoViewIfNeeded();
  const before = (await segment.boundingBox())!;
  await study.getByRole('button', { name: 'Lock Study', exact: true }).click();
  await expect(input('Study')).toHaveAttribute('readonly');
  const divider = study.getByRole('slider', { name: 'Build / Study divider' });
  await divider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(input('Build')).toHaveValue('46');
  await expect(input('Study')).toHaveValue('35');
  await expect(input('Rest')).toHaveValue('19');
  await input('Rest').fill('30');
  await input('Rest').press('Tab');
  await expect(input('Build')).toHaveValue('35');
  const after = (await segment.boundingBox())!;
  expect(after.width).toBeCloseTo(before.width, 0);
  expect(after.x).toBeLessThan(before.x);
  await study.getByRole('button', { name: 'Lock Build', exact: true }).click();
  await study.getByRole('button', { name: 'Lock Rest', exact: true }).click();
  await expect(study.getByRole('slider')).toHaveCount(0);
  for (const name of ['Build', 'Study', 'Rest'])
    await expect(input(name)).toHaveAttribute('readonly');
  await study.getByRole('button', { name: 'Lock Study', exact: true }).click();
  await study.getByRole('button', { name: 'Lock Build', exact: true }).click();
  await expect(
    study.getByRole('slider', { name: 'Build / Study divider' }),
  ).toBeVisible();
  await expect(
    study.getByRole('group', { name: 'Allocation total' }),
  ).toContainText('100%');
});

test('a phone touch drag changes the division without scrolling or losing the total', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  try {
    const page = await context.newPage();
    await page.goto(
      (test.info().project.use.baseURL as string) +
        '/#devspace?study=allocation-bar-study',
    );
    const study = page.getByRole('region', {
      name: 'Allocation bar study',
      exact: true,
    });
    const track = study.locator('.allocation-track');
    await track.scrollIntoViewIfNeeded();
    const box = (await track.boundingBox())!;
    const grip = (await study
      .locator('.allocation-grip')
      .first()
      .boundingBox())!;
    const x = grip.x + grip.width / 2,
      y = grip.y + grip.height / 2;
    const target = box.x + 5 + (box.width - 10) * 0.6;
    const start = await page.evaluate(() => scrollY);
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ id: 1, x, y }],
    });
    for (let i = 1; i <= 12; i++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ id: 1, x: x + ((target - x) * i) / 12, y }],
      });
      await page.evaluate(() => new Promise(requestAnimationFrame));
    }
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    const values = await study
      .getByRole('spinbutton')
      .evaluateAll((inputs) =>
        inputs.map((el) => (el as HTMLInputElement).valueAsNumber),
      );
    expect(values[0]).toBeGreaterThanOrEqual(59);
    expect(values[0]).toBeLessThanOrEqual(61);
    expect(values[2]).toBe(20);
    expect(values.reduce((sum, value) => sum + value, 0)).toBe(100);
    expect(await page.evaluate(() => scrollY)).toBeCloseTo(start, 0);
    await cdp.detach();
  } finally {
    await context.close();
  }
});

test('hour and percentage examples retain separate values and physical keyboard direction in RTL', async ({
  page,
}) => {
  const study = page.getByRole('region', { name: 'Allocation bar study' });
  await study.getByRole('radio', { name: 'Weekly hours' }).check();
  const build = study.getByRole('spinbutton', { name: 'Build', exact: true });
  await expect(build).toHaveValue('18');
  await build.fill('20');
  await build.press('Tab');
  await expect(
    study.getByRole('spinbutton', { name: 'Study', exact: true }),
  ).toHaveValue('12');
  await page.getByRole('checkbox', { name: 'RTL layout', exact: true }).check();
  const divider = study.getByRole('slider', { name: 'Build / Study divider' });
  await divider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(build).toHaveValue('21');
  await expect(
    study.getByRole('group', { name: 'Allocation total' }),
  ).toContainText('40 h');
  await study.getByRole('radio', { name: 'Percentages' }).check();
  await expect(build).toHaveValue('45');
  await study.getByRole('radio', { name: 'Weekly hours' }).check();
  await expect(build).toHaveValue('21');
  await study.getByRole('button', { name: 'Reset allocation' }).click();
  await expect(build).toHaveValue('18');
});

test('studies reflow on a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const name of ['Allocation bar study', 'XY pad study']) {
    const study = page.getByRole('region', { name });
    await expect(study).toBeVisible();
    expect(
      await study.evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBeTruthy();
  }
});

test('a narrow allocation amount is wholly readable or hidden, with its exact value retained', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  const study = page.getByRole('region', {
    name: 'Allocation bar study',
    exact: true,
  });
  const rest = study.locator('.allocation-segment').nth(2);
  const fit = await rest.evaluate((el) => {
    const amount = el.querySelector('.allocation-segment-value')!;
    const range = document.createRange();
    range.selectNodeContents(amount);
    const text = range.getBoundingClientRect(),
      segment = el.getBoundingClientRect();
    return (
      getComputedStyle(amount).visibility === 'hidden' ||
      (text.left >= segment.left && text.right <= segment.right)
    );
  });
  expect(fit).toBe(true);
  await expect(
    study.getByRole('spinbutton', { name: 'Rest', exact: true }),
  ).toHaveValue('20');
});
