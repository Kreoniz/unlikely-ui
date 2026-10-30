import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('shadcn named compositions keep their appearance and sizing at narrow and wide widths', async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const appearance of ['light', 'dark']) {
      await page.goto('/#components/button');
      const toggle = page.getByRole('button', {
        name: `Switch to ${appearance} appearance`,
      });
      if (await toggle.count()) await toggle.click();
      await expect(
        page.getByRole('link', { name: 'Explore devspace', exact: true }),
      ).toHaveCSS('min-block-size', '40px');
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `.local/shadcn-button-${appearance}-${width}.png`,
      });
      await page.goto('/#components/card');
      await page.getByRole('checkbox', { name: 'Compact panel' }).check();
      await expect(page.locator('.u-card-header').first()).toHaveCSS(
        'padding',
        '12px',
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `.local/shadcn-card-${appearance}-${width}.png`,
      });
      await page.goto('/#components/dialog');
      await page
        .getByRole('region', { name: 'Overlay playground' })
        .getByRole('button', { name: 'New project', exact: true })
        .click();
      const dialog = page.getByRole('dialog', {
        name: 'Create project',
        exact: true,
      });
      await expect(
        dialog.getByRole('button', { name: 'Close', exact: true }),
      ).toBeVisible();
      const box = await dialog.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      await page.screenshot({
        path: `.local/shadcn-dialog-${appearance}-${width}.png`,
      });
      await page.keyboard.press('Escape');
    }
  }
});

test('showcase preserves component spacing and renders actual typography roles', async ({
  page,
}) => {
  await page.goto('/#components/dialog');
  await page
    .getByRole('region', { name: 'Overlay playground' })
    .getByRole('button', { name: 'New project', exact: true })
    .click();
  const description = page
    .getByRole('dialog')
    .locator('.u-overlay-description');
  await expect(description).toHaveCSS('margin-top', '8px');
  await expect(description).toHaveCSS('margin-bottom', '20px');
  await page.keyboard.press('Escape');
  await page.goto('/#components/card');
  await expect(page.locator('.u-card-description').first()).toHaveCSS(
    'margin-top',
    '8px',
  );
  await page.goto('/#foundations');
  for (const [role, size, leading] of [
    ['body', '16px', '24px'],
    ['small', '14px', '20px'],
    ['caption', '12px', '16px'],
  ]) {
    await expect(page.locator(`.type-${role}-role`)).toHaveCSS(
      'font-size',
      size!,
    );
    await expect(page.locator(`.type-${role}-role`)).toHaveCSS(
      'line-height',
      leading!,
    );
  }
  await page
    .getByRole('checkbox', { name: 'Loading actions', exact: true })
    .check();
  await expect(
    page.getByRole('button', { name: 'Create project (light)', exact: true }),
  ).toHaveAttribute('aria-busy', 'true');
  await expect(
    page.getByRole('button', { name: 'Create project (dark)', exact: true }),
  ).toHaveAttribute('aria-busy', 'true');
  await page.goto('/#components/tabs');
  await expect(
    page.getByRole('tab', { name: 'Account', exact: true }),
  ).toHaveCSS('font-size', '14px');
});

test('discovery, API links, and mobile property reading retain useful state', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Find components' }).fill('empty');
  await expect(
    page.locator('.component-link:visible').filter({ hasText: /^Card$/ }),
  ).toBeVisible();
  await page.getByRole('textbox', { name: 'Find components' }).fill('modal');
  await expect(page.locator('.component-link:visible')).toHaveText(['Dialog']);
  await page.locator('.component-link').filter({ hasText: 'Dialog' }).click();
  await page.getByRole('link', { name: 'API reference', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Filter API properties' })
    .fill('initialFocus');
  await page.getByRole('link', { name: 'Dialog.Content', exact: true }).click();
  await expect(page).toHaveURL(/part=Dialog.Content/);
  await page.reload();
  await expect(
    page.getByRole('combobox', { name: 'Component part or function' }),
  ).toHaveText('Dialog.Content');
  const row = page.getByRole('row', { name: /^initialFocus Optional/ });
  await expect(row).toBeVisible();
  const widths = await row.evaluate((element) =>
    [...element.children].map((child) => child.getBoundingClientRect().width),
  );
  expect(Math.min(...widths)).toBeGreaterThan(300);
  await page.getByRole('link', { name: 'initialFocus', exact: true }).click();
  await expect(page).toHaveURL(/prop=initialFocus/);
  await page.getByRole('button', { name: 'Components', exact: true }).click();
  await expect(
    page.locator('.component-link').filter({ hasText: /^Button/ }),
  ).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test('quick start, complete source, and example links lead to working compositions', async ({
  page,
}) => {
  await page.goto('/#quick-start');
  await expect(
    page.getByRole('heading', { name: 'Start using unlikely ui' }),
  ).toBeVisible();
  await expect(page.locator('main')).toContainText(
    'pnpm add -E unlikely-ui@0.1.0-alpha.3',
  );
  await page.goto('/#components/dialog');
  await page
    .getByRole('radio', { name: 'Complete example', exact: true })
    .check();
  const code = page.locator('.example-code pre');
  await expect(code).toContainText('function ProjectForm');
  await expect(code).toContainText('function ProjectDialog');
  await expect(code).not.toContainText('../../src/');
  await expect(code).not.toContainText('Form content');
  await expect(code).toContainText("display: 'grid'");
  await expect(page.getByRole('note')).toContainText(
    'API version: 0.1.0-alpha.3',
  );
  await page.goto('/#components/dialog/api?part=DialogContent');
  await expect(page.locator('.api-intro .code-block').first()).toContainText(
    "import { DialogContent } from 'unlikely-ui/dialog'",
  );
  await page.goto('/#components/button/api?part=buttonVariants');
  await expect(page.locator('.api-intro .code-block').first()).toContainText(
    "import { buttonVariants } from 'unlikely-ui/button'",
  );
  await page.goto('/#components/button?example=example-icon-only-buttons');
  await expect(page.locator('#example-icon-only-buttons')).toBeFocused();
  await page.goto('/#components/card');
  await page
    .getByRole('radio', { name: 'Complete example', exact: true })
    .check();
  await expect(page.locator('.example-code pre')).toContainText(
    'function EmptyState',
  );
  await expect(page.locator('.example-code pre')).not.toContainText(
    '../../src/',
  );
});

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`example links scroll, focus, and work again with ${reducedMotion} motion`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1000, height: 700 });
    await page.emulateMedia({ reducedMotion });
    await page.goto('/#components/combobox');
    await page.evaluate(() => document.fonts.ready);
    const link = page
      .getByRole('navigation', { name: 'On this page' })
      .getByRole('link', { name: 'Search in a dialog', exact: true });
    await expect(link).toBeVisible();
    const heading = page.locator('#example-search-in-a-dialog');
    const destination = await heading.evaluate((element) =>
      Math.min(
        element.getBoundingClientRect().top +
          scrollY -
          parseFloat(getComputedStyle(element).scrollMarginTop),
        document.documentElement.scrollHeight - innerHeight,
      ),
    );
    const samples = await page.evaluateHandle(() => {
      const positions: number[] = [];
      document.addEventListener('scroll', () => positions.push(scrollY));
      return positions;
    });
    await link.click();
    await expect(page).toHaveURL(/example=example-search-in-a-dialog/);
    await expect(heading).toBeFocused();
    await expect
      .poll(async () =>
        Math.abs((await page.evaluate(() => scrollY)) - destination),
      )
      .toBeLessThan(2);
    const intermediatePositions = (await samples.jsonValue()).filter(
      (position) => position > 1 && position < destination - 2,
    );
    if (reducedMotion === 'reduce') {
      expect(intermediatePositions).toEqual([]);
    } else {
      expect(intermediatePositions.length).toBeGreaterThan(1);
    }
    await samples.dispose();

    // A current URL must still work after scrolling away from its destination.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await link.click();
    await expect(heading).toBeFocused();
    await expect
      .poll(async () =>
        Math.abs((await page.evaluate(() => scrollY)) - destination),
      )
      .toBeLessThan(2);
  });
}

test('a failed asynchronous save retains the draft, retry succeeds, and later edits become dirty', async ({
  page,
}) => {
  await page.goto('/#recipes');
  const form = page.getByRole('form', { name: 'Recoverable settings' });
  await form
    .getByRole('textbox', { name: 'Workspace name' })
    .fill('A useful draft');
  await form
    .getByRole('textbox', { name: 'Workspace notes' })
    .fill('Preserve this note.');
  const save = form.getByRole('button', { name: 'Save changes', exact: true });
  await save.click();
  await expect(save).toHaveAttribute('aria-busy', 'true');
  await expect(
    form.getByRole('textbox', { name: 'Workspace notes' }),
  ).toHaveAttribute('readonly');
  const notes = form.getByRole('textbox', { name: 'Workspace notes' });
  await notes.focus();
  await expect(form.getByRole('alert')).toContainText(
    'Your draft is still here.',
  );
  await expect(notes).toBeFocused();
  await expect(
    form.getByRole('textbox', { name: 'Workspace name' }),
  ).toHaveValue('A useful draft');
  await form.getByRole('button', { name: 'Try again' }).click();
  await expect(save).toBeFocused();
  await notes.focus();
  await expect(form.getByRole('status')).toHaveText('Saved A useful draft.');
  await expect(notes).toBeFocused();
  await form
    .getByRole('textbox', { name: 'Workspace name' })
    .fill('Unwanted edit');
  await expect(form.getByRole('status')).toHaveText('Unsaved changes.');
  await form.getByRole('button', { name: 'Discard changes' }).click();
  await expect(
    form.getByRole('textbox', { name: 'Workspace name' }),
  ).toHaveValue('A useful draft');
  await expect(form.getByRole('status')).toHaveText('Restored saved values.');
  await form
    .getByRole('textbox', { name: 'Workspace notes' })
    .fill('Another unsaved note.');
  await expect(form.getByRole('status')).toHaveText('Unsaved changes.');
});

test('required DatePicker recipe submits a local value, clears, and resets', async ({
  page,
}) => {
  await page.goto('/#recipes?recipe=due-date-recipe');
  const form = page.getByRole('form', { name: 'Project due date' });
  await form
    .getByRole('textbox', { name: 'Project name', exact: true })
    .fill('Garden journal');
  await form.getByRole('button', { name: 'Submit project' }).click();
  const trigger = form.getByRole('button', { name: /^Due date:/ });
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-invalid', 'true');
  await expect(form).toContainText('Choose a due date.');
  await trigger.click();
  await page.getByRole('button', { name: 'Today', exact: true }).click();
  await form.getByRole('button', { name: 'Submit project' }).click();
  await expect(form.getByRole('status')).toHaveText(
    'Last submitted: Garden journal, due 2026-10-19.',
  );
  await page.setViewportSize({ width: 320, height: 800 });
  const longName = 'X'.repeat(200);
  await form
    .getByRole('textbox', { name: 'Project name', exact: true })
    .fill(longName);
  await form.getByRole('button', { name: 'Submit project' }).click();
  await expect(form.getByRole('status')).toHaveText(
    `Last submitted: ${longName}, due 2026-10-19.`,
  );
  expect(
    await form
      .getByRole('status')
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await form.getByRole('button', { name: 'Clear due date' }).click();
  await expect(form.locator('input[name="dueDate"]')).toHaveValue('');
  await form.getByRole('button', { name: 'Reset form' }).click();
  await expect(
    form.getByRole('textbox', { name: 'Project name', exact: true }),
  ).toHaveValue('');
  await expect(trigger).not.toHaveAttribute('aria-invalid', 'true');
});

test('Switch preserves controlled state, native form participation, read-only, and reset', async ({
  page,
}) => {
  await page.goto('/#components/switch');
  const control = page.getByRole('switch', {
    name: 'Auto-save drafts',
    exact: true,
  });
  await control.focus();
  await page.keyboard.press('Space');
  await expect(control).not.toBeChecked();
  const readOnly = page.getByRole('switch', { name: 'Read-only preference' });
  await readOnly.click();
  await expect(readOnly).toBeChecked();
  const invalid = page.getByRole('switch', {
    name: 'Required setting',
    exact: true,
  });
  await expect(invalid).toHaveAttribute('aria-invalid', 'true');
  await expect(invalid).toHaveAccessibleDescription(
    'Turn on this setting to continue.',
  );
  expect(
    await invalid.evaluate(
      (element) => getComputedStyle(element, '::before').borderTopColor,
    ),
  ).toBe('rgb(172, 39, 51)');
  const form = page.getByRole('region', { name: 'Switch form participation' });
  await form.getByRole('switch', { name: 'Weekly digest' }).click();
  await form.getByRole('button', { name: 'Submit preferences' }).click();
  await expect(form.getByRole('status')).toHaveText('Digest: disabled.');
  await form.getByRole('button', { name: 'Reset switches' }).click();
  await expect(
    form.getByRole('switch', { name: 'Weekly digest' }),
  ).toBeChecked();
});

test('Tabs associates panels and preserves manual and automatic keyboard activation', async ({
  page,
}) => {
  await page.goto('/#components/tabs');
  const account = page.getByRole('tab', { name: 'Account', exact: true });
  const notifications = page.getByRole('tab', {
    name: 'Notifications',
    exact: true,
  });
  await account.focus();
  await page.keyboard.press('ArrowRight');
  await expect(notifications).toBeFocused();
  await expect(account).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('tabpanel', { name: 'Notifications' }),
  ).toBeVisible();
  await page
    .getByRole('checkbox', { name: 'Activate on arrow-key focus' })
    .check();
  await notifications.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(account).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel', { name: 'Account' })).toBeVisible();
  await expect(
    page.getByRole('tab', { name: 'Access', exact: true }),
  ).toBeDisabled();
});

test('Menu supports keyboard actions, dialog handoff, and inherited portal themes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#components/menu');
  const example = page.getByRole('region', {
    name: 'Project action menu',
    exact: true,
  });
  const trigger = example.getByRole('button', {
    name: 'Project actions',
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('menuitem', { name: 'Rename', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Rename project' });
  await expect(
    dialog.getByRole('textbox', { name: 'Project title' }),
  ).toBeFocused();
  await dialog.getByRole('textbox', { name: 'Project title' }).fill('New name');
  await dialog.getByRole('button', { name: 'Save name' }).click();
  await expect(trigger).toBeFocused();
  await expect(example).toContainText('New name');
  const nested = page.getByRole('region', { name: 'Nested menu theme' });
  await nested
    .getByRole('button', { name: 'Project actions', exact: true })
    .click();
  const menu = page.getByRole('menu');
  await expect(menu).toHaveCSS('direction', 'rtl');
  await expect(menu).toHaveCSS('background-color', 'rgb(53, 60, 51)');
  expect(
    (
      await new AxeBuilder({ page })
        .include('.u-menu')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole('menuitem', { name: 'Duplicate', exact: true }).focus();
  await expect(
    page.getByRole('menuitem', { name: 'Duplicate', exact: true }),
  ).toHaveCSS('color', 'rgb(174, 207, 255)');
  await page.keyboard.press('Escape');
  await expect(
    nested.getByRole('button', { name: 'Project actions', exact: true }),
  ).toBeFocused();
});

test('new controls retain touch targets and the switch follows RTL geometry', async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: process.env.UI_SHOWCASE_URL ?? 'http://127.0.0.1:5177',
    viewport: { width: 320, height: 850 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('/#components/switch');
  const control = page.getByRole('switch', {
    name: 'Auto-save drafts',
    exact: true,
  });
  expect((await control.boundingBox())!.width).toBeGreaterThanOrEqual(44);
  expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await page
    .locator('.workspace')
    .evaluate((element) => element.setAttribute('dir', 'rtl'));
  const thumb = control.locator('.u-switch-thumb');
  const checkedX = await thumb.evaluate(
    (element) => element.getBoundingClientRect().x,
  );
  await control.tap();
  await expect(control).not.toBeChecked();
  await expect
    .poll(() => thumb.evaluate((element) => element.getBoundingClientRect().x))
    .toBeGreaterThan(checkedX);
  await page.goto('/#components/tabs');
  expect(
    (await page
      .getByRole('tab', { name: 'Account', exact: true })
      .boundingBox())!.height,
  ).toBeGreaterThanOrEqual(44);
  await page.goto('/#components/menu');
  await page
    .getByRole('region', { name: 'Project action menu', exact: true })
    .getByRole('button', { name: 'Project actions', exact: true })
    .tap();
  expect(
    (await page
      .getByRole('menuitem', { name: 'Rename', exact: true })
      .boundingBox())!.height,
  ).toBeGreaterThanOrEqual(44);
  await context.close();
});

test('new pages fit narrow and wide layouts and new controls remain accessible in both appearances', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of [
    'quick-start',
    'recipes',
    'components/switch',
    'components/tabs',
    'components/menu',
    'foundations',
  ]) {
    await page.goto(`/#${route}`);
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth - innerWidth,
          ),
        )
        .toBeLessThanOrEqual(1);
    }
    if (route.startsWith('components/')) {
      for (const appearance of ['light', 'dark']) {
        const label = `Switch to ${appearance} appearance`;
        if (await page.getByRole('button', { name: label }).count())
          await page.getByRole('button', { name: label }).click();
        expect(
          (
            await new AxeBuilder({ page })
              .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
              .analyze()
          ).violations,
        ).toEqual([]);
      }
    }
  }
});
