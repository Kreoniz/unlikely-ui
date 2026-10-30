import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const studyURL =
  process.env.UI_SIGNATURE_GUARDED_URL ??
  '/#devspace?study=guarded-action-study';
const initialNote =
  'Try the warmer paper theme. Keep the compact navigation. Review the new empty state.';

function guardStudy(page: import('@playwright/test').Page) {
  return page.getByRole('region', {
    name: 'Guarded action study',
    exact: true,
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto(studyURL);
  await expect(
    guardStudy(page).getByRole('textbox', { name: 'Draft note', exact: true }),
  ).toHaveValue(initialNote);
});

test('lifting the opaque cover and pressing the cap are separate keyboard actions', async ({
  page,
}) => {
  const study = guardStudy(page);
  const cover = study.getByRole('button', {
    name: /^(Lift|Close) cover: Reset sandbox$/,
  });
  const note = study.getByRole('textbox', { name: 'Draft note', exact: true });
  await expect(
    study.getByRole('button', { name: 'Reset sandbox', exact: true }),
  ).toHaveCount(0);
  await cover.focus();
  await page.keyboard.press('Enter');
  await expect(cover).toHaveAttribute('aria-expanded', 'true');
  await expect(cover).toBeFocused();
  await expect(note).toHaveValue(initialNote);
  await page.keyboard.press('Tab');
  const cap = study.getByRole('button', { name: 'Reset sandbox', exact: true });
  await expect(cap).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(cover).toHaveAttribute('aria-expanded', 'false');
  await expect(cover).toBeFocused();
  await expect(note).toHaveValue(initialNote);

  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await expect(cap).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(note).toHaveValue('');
  await expect(
    study.getByText('No changes queued.', { exact: true }),
  ).toBeVisible();
  await expect(study.getByRole('status')).toContainText('Sandbox reset.');
  await expect(cover).toBeFocused();
});

test('Cancel and the lifted cover close without changing the draft; reset preserves recovery', async ({
  page,
}) => {
  const study = guardStudy(page);
  const note = study.getByRole('textbox', { name: 'Draft note', exact: true });
  await note.fill('A note edited by the person using this sandbox.');
  await study
    .getByRole('button', { name: 'Add a trial change', exact: true })
    .click();
  await study
    .getByRole('button', { name: 'Lift cover: Reset sandbox', exact: true })
    .click();
  await study.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(note).toHaveValue(
    'A note edited by the person using this sandbox.',
  );
  await study
    .getByRole('button', { name: 'Lift cover: Reset sandbox', exact: true })
    .click();
  await study
    .getByRole('button', { name: 'Close cover: Reset sandbox', exact: true })
    .click();
  await expect(note).toHaveValue(
    'A note edited by the person using this sandbox.',
  );
  await study
    .getByRole('button', { name: 'Lift cover: Reset sandbox', exact: true })
    .click();
  await study
    .getByRole('button', { name: 'Reset sandbox', exact: true })
    .click();
  await expect(note).toHaveValue('');
  await study
    .getByRole('button', { name: 'Restore recovery copy', exact: true })
    .click();
  await expect(note).toHaveValue(
    'A note edited by the person using this sandbox.',
  );
  await expect(
    study.getByText('Trial change 4', { exact: true }),
  ).toBeVisible();
  await expect(study.getByRole('status')).toContainText(
    'Recovery copy restored',
  );
});

test('disabled prevents opening and confirming while ordinary closing stays available', async ({
  page,
}) => {
  const study = guardStudy(page);
  await study.getByText('Inspect action states', { exact: true }).click();
  const disabled = study.getByRole('checkbox', {
    name: 'Disable reset',
    exact: true,
  });
  await disabled.check();
  await expect(
    study.getByRole('button', {
      name: 'Lift cover: Reset sandbox',
      exact: true,
    }),
  ).toBeDisabled();
  await disabled.uncheck();
  await study
    .getByRole('button', { name: 'Lift cover: Reset sandbox', exact: true })
    .click();
  await disabled.check();
  await expect(
    study.getByRole('button', { name: 'Reset sandbox', exact: true }),
  ).toBeDisabled();
  await study.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(
    study.getByRole('button', {
      name: 'Lift cover: Reset sandbox',
      exact: true,
    }),
  ).toBeDisabled();
  await expect(
    study.getByRole('textbox', { name: 'Draft note', exact: true }),
  ).toHaveValue(initialNote);
  await expect(
    study.getByRole('heading', { name: 'Reset this sandbox?', exact: true }),
  ).toBeFocused();
});

test('app-owned failure retains the draft and open cover for a deliberate retry', async ({
  page,
}) => {
  const study = guardStudy(page);
  await study.getByText('Inspect action states', { exact: true }).click();
  await study
    .getByRole('checkbox', { name: 'Fail the next reset', exact: true })
    .check();
  await study
    .getByRole('button', { name: 'Lift cover: Reset sandbox', exact: true })
    .click();
  await study
    .getByRole('button', { name: 'Reset sandbox', exact: true })
    .click();
  await expect(study.getByRole('alert')).toContainText(
    'Your draft is unchanged',
  );
  await expect(
    study.getByRole('textbox', { name: 'Draft note', exact: true }),
  ).toHaveValue(initialNote);
  await expect(
    study.getByRole('button', {
      name: 'Close cover: Reset sandbox',
      exact: true,
    }),
  ).toHaveAttribute('aria-expanded', 'true');
  await study
    .getByRole('button', { name: 'Reset sandbox', exact: true })
    .click();
  await expect(
    study.getByRole('textbox', { name: 'Draft note', exact: true }),
  ).toHaveValue('');
  await expect(study.getByRole('alert')).toHaveCount(0);
});

test('pending blocks repeat presses; closing the cover does not cancel the app operation', async ({
  page,
}) => {
  const study = guardStudy(page);
  await study.getByText('Inspect action states', { exact: true }).click();
  await study
    .getByRole('checkbox', { name: 'Delay the local reset', exact: true })
    .check();
  await study
    .getByRole('button', { name: 'Lift cover: Reset sandbox', exact: true })
    .click();
  const cap = study.getByRole('button', { name: 'Reset sandbox', exact: true });
  await cap.click();
  await expect(cap).toBeDisabled();
  await expect(cap).toHaveAttribute('aria-busy', 'true');
  await expect(
    study.getByRole('textbox', { name: 'Draft note', exact: true }),
  ).toBeDisabled();
  await study.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(
    study.getByRole('button', {
      name: 'Lift cover: Reset sandbox',
      exact: true,
    }),
  ).toHaveAttribute('aria-expanded', 'false');
  await expect(study.getByRole('status')).toContainText('Sandbox reset.');
  await expect(
    study.getByRole('textbox', { name: 'Draft note', exact: true }),
  ).toHaveValue('');
});

for (const appearance of ['light', 'dark']) {
  test(`${appearance} closed and open guarded scene passes scoped accessibility checks`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(
      (value) => localStorage.setItem('unlikely-ui:appearance', value),
      appearance,
    );
    await page.reload();
    const study = guardStudy(page);
    await expect(study).toBeVisible();
    expect(
      await study.evaluate((element) =>
        element.closest('[data-appearance]')?.getAttribute('data-appearance'),
      ),
    ).toBe(appearance);
    expect(
      (
        await new AxeBuilder({ page })
          .include('#guarded-action-study')
          .analyze()
      ).violations,
    ).toEqual([]);
    await study
      .getByRole('button', { name: 'Lift cover: Reset sandbox', exact: true })
      .click();
    expect(
      (
        await new AxeBuilder({ page })
          .include('#guarded-action-study')
          .analyze()
      ).violations,
    ).toEqual([]);
  });
}

test.describe('narrow touch layout', () => {
  test.use({ viewport: { width: 320, height: 568 }, hasTouch: true });
  test('the cover reveals a separate reachable cap without horizontal overflow', async ({
    page,
  }) => {
    const study = guardStudy(page);
    await study
      .getByRole('button', { name: 'Lift cover: Reset sandbox', exact: true })
      .tap();
    const cap = study.getByRole('button', {
      name: 'Reset sandbox',
      exact: true,
    });
    const box = await cap.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(321);
    await cap.tap();
    await expect(
      study.getByRole('textbox', { name: 'Draft note', exact: true }),
    ).toHaveValue('');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
});

test('reduced motion and forced colors retain both explicit steps', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  const study = guardStudy(page);
  await study
    .getByRole('button', { name: 'Lift cover: Reset sandbox', exact: true })
    .click();
  const cap = study.getByRole('button', { name: 'Reset sandbox', exact: true });
  await cap.focus();
  await page.keyboard.press('Enter');
  await expect(study.getByRole('status')).toContainText('Sandbox reset.');
  await expect(
    study.getByRole('button', {
      name: 'Lift cover: Reset sandbox',
      exact: true,
    }),
  ).toBeFocused();
});

test('the complete lid stays inside its mechanism throughout the turn at narrow and wide sizes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    const study = guardStudy(page);
    const cover = study.getByRole('button', {
      name: /^(Lift|Close) cover: Reset sandbox$/,
    });
    const mechanism = study.locator('.signature-guarded-mechanism');
    await mechanism.scrollIntoViewIfNeeded();
    await cover.focus();
    await page.keyboard.press('Enter');
    await expect(cover).toHaveAttribute('aria-expanded', 'true');
    await expect
      .poll(() => cover.evaluate((el) => el.getAnimations().length))
      .toBeGreaterThan(0);
    await cover.evaluate((el) => el.getAnimations()[0]!.pause());
    for (const fraction of [0, 0.15, 0.35, 0.5, 0.7, 0.85, 1]) {
      await cover.evaluate((el, progress) => {
        const animation = el.getAnimations()[0]!;
        animation.currentTime =
          Number(animation.effect!.getTiming().duration) * progress;
      }, fraction);
      const lidBox = (await cover.boundingBox())!;
      const frame = (await mechanism.boundingBox())!;
      expect(lidBox.x).toBeGreaterThanOrEqual(frame.x - 1);
      expect(lidBox.x + lidBox.width).toBeLessThanOrEqual(
        frame.x + frame.width + 1,
      );
      expect(lidBox.y).toBeGreaterThanOrEqual(frame.y - 1);
      expect(lidBox.y + lidBox.height).toBeLessThanOrEqual(
        frame.y + frame.height + 1,
      );
    }
    await cover.evaluate((el) => {
      for (const animation of el.getAnimations()) animation.finish();
    });
    // The printed front never changes to another label during its travel.
    await expect(
      cover.locator('.signature-guarded-cover-face > span'),
    ).toHaveText('Reset sandbox');
    await page.keyboard.press('Escape');
    await cover.evaluate(async (el) => {
      await Promise.all(
        el.getAnimations().map((animation) => animation.finished),
      );
    });
    await expect(cover).toHaveAttribute('aria-expanded', 'false');
    const hit = await cover.evaluate((el) => {
      const label = el.querySelector('.signature-guarded-cover-face > span')!;
      const box = label.getBoundingClientRect();
      return (
        document
          .elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)
          ?.closest('button') === el
      );
    });
    expect(hit).toBe(true);
    await expect(cover).toBeFocused();
  }
});

test('a rapid reversal continues from the current cover position and settles with focus intact', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const study = guardStudy(page);
  await study.getByText('Inspect action states', { exact: true }).click();
  const timing = study.getByRole('slider', { name: 'Cover duration (ms)' });
  await timing.focus();
  await page.keyboard.press('End');
  const cover = study.getByRole('button', {
    name: /^(Lift|Close) cover: Reset sandbox$/,
  });
  await cover.focus();
  await page.keyboard.press('Enter');
  await expect
    .poll(() =>
      cover.evaluate((el) => {
        const progress = el
          .getAnimations()[0]
          ?.effect?.getComputedTiming().progress;
        return (
          typeof progress === 'number' && progress > 0.15 && progress < 0.8
        );
      }),
    )
    .toBe(true);
  const positions = await cover.evaluate((el) => {
    const before = new DOMMatrix(getComputedStyle(el).transform).m22;
    (el as HTMLButtonElement).click();
    const after = new DOMMatrix(getComputedStyle(el).transform).m22;
    return { before, after };
  });
  expect(Math.abs(positions.before - positions.after)).toBeLessThan(0.05);
  await expect(cover).toHaveAttribute('aria-expanded', 'false');
  await cover.evaluate(async (el) => {
    await Promise.all(
      el.getAnimations().map((animation) => animation.finished),
    );
  });
  expect(
    await cover.evaluate(
      (el) => new DOMMatrix(getComputedStyle(el).transform).m22,
    ),
  ).toBeCloseTo(1, 3);
  await expect(cover).toBeFocused();
  await expect(
    study.getByRole('textbox', { name: 'Draft note', exact: true }),
  ).toHaveValue(initialNote);
});

test('zero duration and a reduced-motion preference settle the cover without a running transition', async ({
  page,
}) => {
  const study = guardStudy(page);
  await study.getByText('Inspect action states', { exact: true }).click();
  const timing = study.getByRole('slider', { name: 'Cover duration (ms)' });
  await timing.focus();
  await page.keyboard.press('Home');
  const cover = study.getByRole('button', {
    name: /^(Lift|Close) cover: Reset sandbox$/,
  });
  await cover.focus();
  await page.keyboard.press('Enter');
  expect(await cover.evaluate((el) => el.getAnimations().length)).toBe(0);
  await page.keyboard.press('Escape');
  await timing.focus();
  await page.keyboard.press('End');
  await cover.focus();
  await page.keyboard.press('Enter');
  await expect
    .poll(() => cover.evaluate((el) => el.getAnimations().length))
    .toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() => cover.evaluate((el) => el.getAnimations().length))
    .toBe(0);
  await expect(cover).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(cover).toHaveAttribute('aria-expanded', 'false');
  await expect(cover).toBeFocused();
});

for (const width of [1440, 320]) {
  test(`delayed completion restores cover focus when Cancel is focused at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const study = guardStudy(page);
    await study.getByText('Inspect action states', { exact: true }).click();
    await study
      .getByRole('checkbox', { name: 'Delay the local reset', exact: true })
      .check();
    const cover = study.getByRole('button', { name: /^Lift cover:/ });
    await cover.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await expect(
      study.getByRole('button', { name: 'Cancel', exact: true }),
    ).toBeFocused();
    await expect(study.getByRole('status')).toContainText('Sandbox reset.');
    await expect(cover).toBeFocused();
  });
}

test('delayed completion preserves focus deliberately moved outside the guarded controls', async ({
  page,
}) => {
  const study = guardStudy(page);
  await study.getByText('Inspect action states', { exact: true }).click();
  await study
    .getByRole('checkbox', { name: 'Delay the local reset', exact: true })
    .check();
  await study.getByRole('button', { name: /^Lift cover:/ }).click();
  await study
    .getByRole('button', { name: 'Reset sandbox', exact: true })
    .click();
  const outside = study.getByRole('checkbox', {
    name: 'Disable reset',
    exact: true,
  });
  await outside.focus();
  await expect(study.getByRole('status')).toContainText('Sandbox reset.');
  await expect(outside).toBeFocused();
});

test('delayed completion uses the consequence heading when the closed cover is disabled', async ({
  page,
}) => {
  const study = guardStudy(page);
  await study.getByText('Inspect action states', { exact: true }).click();
  await study
    .getByRole('checkbox', { name: 'Delay the local reset', exact: true })
    .check();
  await study.getByRole('button', { name: /^Lift cover:/ }).click();
  await study
    .getByRole('button', { name: 'Reset sandbox', exact: true })
    .click();
  await study.getByRole('button', { name: 'Cancel', exact: true }).focus();
  await study
    .getByRole('checkbox', { name: 'Disable reset', exact: true })
    .evaluate((el) => (el as HTMLInputElement).click());
  await expect(study.getByRole('status')).toContainText('Sandbox reset.');
  await expect(
    study.getByRole('heading', { name: 'Reset this sandbox?', exact: true }),
  ).toBeFocused();
});
