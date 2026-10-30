import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#devspace?study=receipt-study');
});

test('receipt timing is controllable, and removing a result drops the retained paper while removing its accessible success', async ({
  page,
}) => {
  const study = page.getByRole('region', {
    name: 'Receipt study',
    exact: true,
  });
  const receipt = study.getByRole('article', { name: 'Export receipt' });
  const timing = study.getByRole('slider', {
    name: 'Receipt duration (ms)',
    exact: true,
  });
  await timing.press('End');
  await study
    .getByRole('button', { name: 'Prepare export', exact: true })
    .click();
  await expect(receipt).toHaveAttribute('data-phase', 'enter');
  const entering = await receipt
    .locator('.signature-data-slip')
    .evaluateHandle((el) => {
      const animation = el.getAnimations()[0]!;
      animation.pause();
      return animation;
    });
  expect(await entering.evaluate((a) => a.effect!.getTiming().duration)).toBe(
    1400,
  );
  await entering.evaluate((a) => a.finish());
  await expect(receipt).toHaveAttribute('data-phase', 'steady');
  const top = (await receipt.locator('.signature-data-slip').boundingBox())!.y;
  await study
    .getByRole('checkbox', { name: 'Type notes', exact: true })
    .uncheck();
  await expect(receipt).toHaveAttribute('data-phase', 'exit');
  await expect(
    receipt.getByRole('heading', { name: 'Export ready' }),
  ).toHaveCount(0);
  await expect(study.getByRole('link', { name: 'Download .md' })).toHaveCount(
    0,
  );
  const leaving = await receipt
    .locator('.signature-data-slip')
    .evaluateHandle((el) => {
      const animation = el.getAnimations()[0]!;
      animation.pause();
      animation.currentTime = 700;
      return animation;
    });
  expect(
    (await receipt.locator('.signature-data-slip').boundingBox())!.y,
  ).toBeGreaterThan(top + 10);
  await leaving.evaluate((a) => a.finish());
  await expect(receipt.locator('.signature-data-slip')).toHaveCount(0);
  await entering.dispose();
  await leaving.dispose();
});

test('rapid reissues keep a single paper and issue only the newest result after its predecessor leaves', async ({
  page,
}) => {
  const study = page.getByRole('region', {
    name: 'Receipt study',
    exact: true,
  });
  const receipt = study.getByRole('article', { name: 'Export receipt' });
  await study
    .getByRole('button', { name: 'Prepare export', exact: true })
    .click();
  await expect(receipt).toHaveAttribute('data-phase', 'steady');
  await study
    .getByRole('button', { name: 'Prepare again', exact: true })
    .click();
  await expect(receipt).toHaveAttribute('data-phase', 'exit');
  const leaving = await receipt
    .locator('.signature-data-slip')
    .evaluateHandle((el) => {
      const a = el.getAnimations()[0]!;
      a.pause();
      return a;
    });
  await study
    .getByRole('checkbox', { name: 'Type notes', exact: true })
    .uncheck();
  await study
    .getByRole('button', { name: 'Prepare export', exact: true })
    .click();
  await expect(receipt.locator('.signature-data-slip')).toHaveCount(1);
  await expect(receipt.locator('.signature-data-slip')).toContainText(
    '3 notes',
  );
  await leaving.evaluate((a) => a.finish());
  await expect(receipt).toHaveAttribute('data-phase', 'enter');
  await expect(receipt.locator('.signature-data-slip')).toContainText(
    '2 notes',
  );
  await expect(receipt).toHaveAttribute('data-phase', 'steady');
  await expect(receipt.locator('.signature-data-slip')).toHaveCount(1);
  expect(
    await receipt.evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await leaving.dispose();
});

test('zero duration or a mid-flight reduced-motion change settles to the current result immediately', async ({
  page,
}) => {
  const study = page.getByRole('region', {
    name: 'Receipt study',
    exact: true,
  });
  const receipt = study.getByRole('article', { name: 'Export receipt' });
  await study
    .getByRole('slider', { name: 'Receipt duration (ms)', exact: true })
    .press('End');
  await study
    .getByRole('button', { name: 'Prepare export', exact: true })
    .click();
  await receipt
    .locator('.signature-data-slip')
    .evaluate((el) => el.getAnimations().forEach((a) => a.pause()));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(receipt).toHaveAttribute('data-phase', 'steady');
  expect(
    await receipt.evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await study
    .getByRole('checkbox', { name: 'Type notes', exact: true })
    .uncheck();
  await expect(receipt.locator('.signature-data-slip')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await study
    .getByRole('slider', { name: 'Receipt duration (ms)', exact: true })
    .press('Home');
  await study
    .getByRole('button', { name: 'Prepare export', exact: true })
    .click();
  await expect(receipt).toHaveAttribute('data-phase', 'steady');
  expect(
    await receipt.evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
});

for (const width of [320, 390]) {
  test(`mobile receipt keeps controls stationary through issuance and removal at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    const study = page.getByRole('region', {
      name: 'Receipt study',
      exact: true,
    });
    const receipt = study.getByRole('article', { name: 'Export receipt' });
    const button = study.getByRole('button', {
      name: /^Prepare (export|again)$/,
    });
    const documentTop = () =>
      button.evaluate((el) => el.getBoundingClientRect().top + scrollY);
    const before = await documentTop();
    await button.click();
    await expect(receipt).toHaveAttribute('data-phase', 'enter');
    expect(Math.abs((await documentTop()) - before)).toBeLessThan(1);
    await expect(receipt).toHaveAttribute('data-phase', 'steady');
    expect(Math.abs((await documentTop()) - before)).toBeLessThan(1);
    await study
      .getByRole('checkbox', { name: 'Type notes', exact: true })
      .uncheck();
    await expect(receipt).toHaveAttribute('data-phase', 'exit');
    expect(Math.abs((await documentTop()) - before)).toBeLessThan(1);
    await expect(receipt).toHaveAttribute('data-phase', 'empty');
    expect(Math.abs((await documentTop()) - before)).toBeLessThan(1);
  });
}

test('the default receipt feed retains visible travel beyond its first 200 milliseconds', async ({
  page,
}) => {
  const study = page.getByRole('region', {
    name: 'Receipt study',
    exact: true,
  });
  await study
    .getByRole('button', { name: 'Prepare export', exact: true })
    .click();
  const feed = await study.locator('.signature-data-slip').evaluate((el) => {
    const animation = el.getAnimations()[0]!;
    animation.pause();
    animation.currentTime = 200;
    const offset = new DOMMatrix(getComputedStyle(el).transform).m42;
    return {
      duration: animation.effect!.getTiming().duration,
      progress: 1 + offset / el.getBoundingClientRect().height,
    };
  });
  expect(feed.duration).toBe(700);
  expect(feed.progress).toBeGreaterThan(0.15);
  expect(feed.progress).toBeLessThan(0.5);
});

for (const width of [320, 390]) {
  test(`mobile keyboard activation keeps the receipt slot visible and uses singular count at ${width}px`, async ({
    page,
  }) => {
    const height = width === 320 ? 568 : 844;
    await page.setViewportSize({ width, height });
    const study = page.getByRole('region', {
      name: 'Receipt study',
      exact: true,
    });
    await study
      .getByRole('checkbox', { name: 'Type notes', exact: true })
      .uncheck();
    await study
      .getByRole('checkbox', { name: 'Release sketch', exact: true })
      .uncheck();
    await study.getByRole('heading', { name: 'Receipt', exact: true }).focus();
    for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
    const prepare = study.getByRole('button', {
      name: 'Prepare export',
      exact: true,
    });
    await expect(prepare).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(
      study.getByRole('button', { name: 'Prepare again', exact: true }),
    ).toBeFocused();
    const slot = (await study
      .locator('.signature-data-printer-rim')
      .boundingBox())!;
    expect(slot.y).toBeGreaterThanOrEqual(64);
    expect(slot.y + slot.height).toBeLessThanOrEqual(height);
    await expect(
      study.locator('.signature-data-receipt-header > p'),
    ).toHaveText('1 note');
  });
}
