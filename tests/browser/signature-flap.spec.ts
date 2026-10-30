import { expect, test } from '@playwright/test';
import type { JSHandle, Locator } from '@playwright/test';

type Cycle = { group: Element; animations: Animation[] };
const studyURL = '/#devspace?study=split-flap-study';

async function pauseCycle(readout: Locator): Promise<JSHandle<Cycle>> {
  await expect
    .poll(() =>
      readout.evaluate(
        (element) => element.getAnimations({ subtree: true }).length,
      ),
    )
    .toBeGreaterThan(0);
  return readout.evaluateHandle((element) => {
    const group = element.querySelector('.signature-data-cells')!;
    const animations = group.getAnimations({ subtree: true });
    animations.forEach((animation) => animation.pause());
    return { group, animations };
  });
}
async function finishCycle(cycle: JSHandle<Cycle>) {
  await cycle.evaluate(({ animations }) => {
    // Complete the actual leaves before their shared completion signal.
    const coordinator = animations.find(
      (animation) =>
        animation instanceof CSSAnimation &&
        animation.animationName === 'signature-flap-cycle',
    );
    animations
      .filter((animation) => animation !== coordinator)
      .forEach((animation) => animation.finish());
    coordinator!.finish();
  });
}

function controls(page: import('@playwright/test').Page) {
  const study = page.getByRole('region', {
    name: 'Split-flap study',
    exact: true,
  });
  return {
    study,
    input: study.getByRole('spinbutton', { name: 'Completion count' }),
    duration: study.getByRole('slider', {
      name: 'Flip duration (ms)',
      exact: true,
    }),
    readout: study.getByRole('status', { name: 'Completed notes' }),
  };
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(studyURL);
});

test('a burst completes its active flip and then animates only the latest requested reading', async ({
  page,
}) => {
  const { input, duration, readout } = controls(page);
  await duration.press('End');
  await input.fill('43');
  const active = await pauseCycle(readout);
  await input.fill('44');
  await input.fill('95');
  await input.fill('94');

  // The existing visual cycle survives; new requests do not restart its leaves.
  expect(await active.evaluate(({ group }) => group.isConnected)).toBe(true);
  expect(
    await active.evaluate(({ animations }) =>
      animations.every((animation) => animation.playState === 'paused'),
    ),
  ).toBe(true);
  await expect(readout.locator('.signature-data-cell-value')).toHaveText([
    '0',
    '4',
    '3',
  ]);
  await expect(readout).toMatchAriaSnapshot(
    '- status "Completed notes": "094"',
  );

  await finishCycle(active);
  await expect(readout.locator('.signature-data-cell-value')).toHaveText([
    '0',
    '9',
    '4',
  ]);
  const latest = await pauseCycle(readout);
  expect(await active.evaluate(({ group }) => group.isConnected)).toBe(false);
  await finishCycle(latest);
  await expect(readout.locator('.signature-data-new-leaf')).toHaveCount(0);
  expect(
    await readout.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await expect(readout.locator('.signature-data-cell-value')).toHaveText([
    '0',
    '9',
    '4',
  ]);
  await active.dispose();
  await latest.dispose();
});

test('positive duration changes affect the next cycle while zero settles all pending work immediately', async ({
  page,
}) => {
  const { input, duration, readout } = controls(page);
  await input.fill('43');
  const active = await pauseCycle(readout);
  expect(
    await active.evaluate(({ animations }) =>
      animations.every(
        (animation) => animation.effect!.getTiming().duration === 400,
      ),
    ),
  ).toBe(true);
  await duration.press('End');
  await input.fill('94');
  expect(
    await active.evaluate(({ animations }) =>
      animations.every(
        (animation) => animation.effect!.getTiming().duration === 400,
      ),
    ),
  ).toBe(true);
  await finishCycle(active);
  const latest = await pauseCycle(readout);
  expect(
    await latest.evaluate(({ animations }) =>
      animations.every(
        (animation) => animation.effect!.getTiming().duration === 1200,
      ),
    ),
  ).toBe(true);

  await input.fill('321');
  await duration.press('Home');
  await expect(readout.locator('.signature-data-cell-value')).toHaveText([
    '3',
    '2',
    '1',
  ]);
  await expect(readout.locator('.signature-data-new-leaf')).toHaveCount(0);
  expect(
    await readout.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await input.fill('987');
  await expect(readout.locator('.signature-data-cell-value')).toHaveText([
    '9',
    '8',
    '7',
  ]);
  expect(
    await readout.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await active.dispose();
  await latest.dispose();
});

test('enabling reduced motion mid-cycle settles the latest value and normal motion can resume', async ({
  page,
}) => {
  const { input, duration, readout } = controls(page);
  await duration.press('End');
  await input.fill('43');
  const active = await pauseCycle(readout);
  await input.fill('94');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(readout.locator('.signature-data-cell-value')).toHaveText([
    '0',
    '9',
    '4',
  ]);
  await expect(readout).toMatchAriaSnapshot(
    '- status "Completed notes": "094"',
  );
  await expect(readout.locator('.signature-data-new-leaf')).toHaveCount(0);
  expect(
    await readout.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await input.fill('95');
  const resumed = await pauseCycle(readout);
  await finishCycle(resumed);
  await expect(readout.locator('.signature-data-cell-value')).toHaveText([
    '0',
    '9',
    '5',
  ]);
  await expect(readout.locator('.signature-data-new-leaf')).toHaveCount(0);
  await active.dispose();
  await resumed.dispose();
});

test('unassisted animation completion advances the pending reading and clears its leaves', async ({
  page,
}) => {
  const { input, duration, readout } = controls(page);
  await duration.press('End');
  await input.fill('43');
  await expect(readout.locator('.signature-data-new-leaf')).toHaveCount(1);
  await input.fill('94');
  await expect(readout.locator('.signature-data-cell-value')).toHaveText([
    '0',
    '4',
    '3',
  ]);
  await expect(readout.locator('.signature-data-new-leaf')).toHaveCount(0, {
    timeout: 5000,
  });
  await expect(readout.locator('.signature-data-cell-value')).toHaveText([
    '0',
    '9',
    '4',
  ]);
  expect(
    await readout.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
});
