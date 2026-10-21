import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function recordRuntimeErrors(page: Page) {
  await page.addInitScript(() => {
    const errors: string[] = [];
    Object.assign(window, { runtimeErrors: errors });
    window.addEventListener('error', (event) => errors.push(event.message));
  });
  return () =>
    page.evaluate(
      () => (window as unknown as { runtimeErrors: string[] }).runtimeErrors,
    );
}

test('scroll area keeps native wheel, keyboard and thumb dragging with dynamic overflow', async ({
  page,
}) => {
  const readErrors = await recordRuntimeErrors(page);
  await page.goto('/#components/scroll-area');
  const viewport = page.getByRole('region', {
    name: 'Resource list',
    exact: true,
  });
  const area = page.getByTestId('vertical-scroll-area');
  const thumb = area.locator('.u-scroll-thumb');
  await expect(thumb).toBeVisible();
  await viewport.focus();
  const scrollEnd = viewport.evaluate(
    (element) =>
      new Promise<void>((resolve) =>
        element.addEventListener('scrollend', () => resolve(), { once: true }),
      ),
  );
  await page.keyboard.press('PageDown');
  await scrollEnd;
  await expect
    .poll(() => viewport.evaluate((e) => e.scrollTop))
    .toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Back to start' }).click();
  await expect.poll(() => viewport.evaluate((e) => e.scrollTop)).toBe(0);
  await viewport.hover();
  await page.mouse.wheel(0, 300);
  await expect
    .poll(() => viewport.evaluate((e) => e.scrollTop))
    .toBeGreaterThan(0);
  const before = await viewport.evaluate((e) => e.scrollTop);
  const box = await thumb.boundingBox();
  if (!box) throw new Error('Missing scrollbar thumb');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 60, {
    steps: 6,
  });
  await page.mouse.up();
  await expect
    .poll(() => viewport.evaluate((e) => e.scrollTop))
    .toBeGreaterThan(before);
  await page.getByRole('checkbox', { name: 'Long list' }).uncheck();
  await expect(area.locator('.u-scrollbar')).not.toBeAttached();
  await expect(viewport).toHaveAttribute('tabindex', '-1');
  await page.getByRole('checkbox', { name: 'Long list' }).check();
  await expect(thumb).toBeVisible();
  await expect(viewport).toHaveAttribute('tabindex', '0');
  expect(await readErrors()).toEqual([]);
});

test('scroll area fits narrow layouts, handles RTL, and remains accessible in both themes', async ({
  page,
}) => {
  const readErrors = await recordRuntimeErrors(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#components/scroll-area');
  const area = page.getByTestId('both-scroll-area');
  const viewport = page.getByRole('region', { name: 'Wide resource table' });
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
      )
      .toBeLessThanOrEqual(1);
    await expect(area.locator('.u-scrollbar')).toHaveCount(2);
    await viewport.focus();
    await page.keyboard.press('ArrowRight');
    await expect
      .poll(() => viewport.evaluate((e) => e.scrollLeft))
      .toBeGreaterThan(0);
    if (width === 320) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: '.local/scroll-area-mobile.png',
        fullPage: true,
      });
    }
  }
  await page.getByRole('checkbox', { name: 'Right-to-left' }).check();
  await viewport.evaluate((e) => {
    e.scrollLeft = 0;
  });
  await viewport.focus();
  await page.keyboard.press('ArrowLeft');
  await expect
    .poll(() => viewport.evaluate((e) => e.scrollLeft))
    .toBeLessThan(0);
  const track = area.locator('.u-scrollbar[data-orientation="vertical"]');
  const [trackBox, areaBox] = await Promise.all([
    track.boundingBox(),
    area.boundingBox(),
  ]);
  if (!trackBox || !areaBox) throw new Error('Missing RTL scroll area bounds');
  expect(Math.abs(trackBox.x - areaBox.x)).toBeLessThan(3);
  for (const appearance of ['light', 'dark']) {
    if (appearance === 'dark')
      await page
        .getByRole('button', { name: 'Switch to dark appearance' })
        .click();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `.local/scroll-area-${appearance}.png`,
      fullPage: true,
    });
  }
  await page.emulateMedia({ forcedColors: 'active' });
  await expect
    .poll(() =>
      track
        .locator('.u-scroll-thumb')
        .evaluate((e) => getComputedStyle(e, '::before').borderTopStyle),
    )
    .toBe('solid');
  expect(await readErrors()).toEqual([]);
});

test('button actions, loading names, native link composition and preview controls', async ({
  page,
}) => {
  await page.goto('/#components/button');
  const stage = page.getByRole('region', {
    name: 'Interactive button playground',
  });
  const action = stage.getByRole('button', { name: 'Create project' });
  await action.click();
  await expect(stage.getByRole('status')).toContainText('1 time');
  await stage.getByRole('checkbox', { name: 'Loading', exact: true }).check();
  await expect(action).toHaveAttribute('aria-busy', 'true');
  await expect(action).toHaveAttribute('aria-disabled', 'true');
  await stage.getByRole('checkbox', { name: 'Loading', exact: true }).uncheck();
  await stage.getByRole('checkbox', { name: 'Disabled', exact: true }).check();
  await expect(action).toBeDisabled();
  await expect(action).toHaveCSS('background-color', 'rgb(238, 234, 225)');
  await stage
    .getByRole('checkbox', { name: 'Disabled', exact: true })
    .uncheck();
  await stage.getByRole('combobox', { name: 'Variant' }).click();
  await page.getByRole('option', { name: 'danger', exact: true }).click();
  await expect(action).toHaveAttribute('data-variant', 'danger');
  await stage.getByRole('radio', { name: 'sm', exact: true }).check();
  await expect(action).toHaveCSS('min-block-size', '32px');
  await page.getByRole('button', { name: 'Switch to dark appearance' }).click();
  await expect(page.locator('.workspace')).toHaveAttribute(
    'data-appearance',
    'dark',
  );
  await page
    .getByRole('link', { name: 'Explore devspace', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Experiments' }),
  ).toBeVisible();
});

test('portal inherits nested appearance, token overrides and direction, then returns focus', async ({
  page,
}) => {
  await page.goto('/#devspace');
  for (const appearance of ['light', 'dark']) {
    if (appearance === 'dark')
      await page.getByRole('button', { name: 'Reverse appearances' }).click();
    await page
      .getByRole('checkbox', { name: 'Inner RTL', exact: true })
      .check();
    const trigger = page.getByRole('button', { name: 'Open themed popover' });
    await trigger.click();
    const portal = page.getByTestId('portal-theme');
    await expect(portal).toHaveAttribute('data-appearance', appearance);

    await expect(portal).toHaveAttribute('dir', 'rtl');
    const close = portal.getByRole('button', { name: 'Got it' });
    await expect(close).toHaveCSS('border-radius', '9999px');
    await expect(close).toHaveCSS('background-color', 'rgb(247, 214, 172)');
    await expect(close).toHaveCSS('min-block-size', '32px');
    await page.keyboard.press('Escape');
    await expect(portal).not.toBeAttached();
    await expect(trigger).toBeFocused();
  }
});

test('catalog search and responsive pages remain usable', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Find components' }).fill('input');
  await page
    .locator('.component-link')
    .filter({ hasText: /^Input$/ })
    .click();
  await expect(
    page.getByRole('region', { name: 'Field playground' }),
  ).toBeVisible();
  await page.getByRole('textbox', { name: 'Find components' }).fill('');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      'overview',
      'foundations',
      'components/button',
      'components/physical-button',
      'components/input',
      'components/textarea',
      'components/dialog',
      'components/popover',
      'components/tooltip',
      'components/select',
      'components/radio-group',
      'components/checkbox',
      'components/combobox',
      'components/calendar',
      'components/date-picker',
      'components/toast',
      'components/badge',
      'components/alert',
      'components/spinner',
      'components/skeleton',
      'components/card',
      'devspace',
    ]) {
      await page.goto(`/#${route}`);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});

test('representative showcase pages and the open popup pass automated accessibility checks', async ({
  page,
}) => {
  test.setTimeout(90_000);
  for (const appearance of ['light', 'dark']) {
    for (const route of [
      'overview',
      'components/button',
      'components/physical-button',
      'components/input',
      'components/dialog',
      'components/popover',
      'components/tooltip',
      'components/select',
      'components/radio-group',
      'components/checkbox',
      'components/combobox',
      'components/calendar',
      'components/date-picker',
      'components/toast',
      'components/badge',
      'components/alert',
      'components/spinner',
      'components/skeleton',
      'components/card',
      'devspace',
    ]) {
      await page.goto(`/#${route}`);
      const changeAppearance = page.getByRole('button', {
        name:
          appearance === 'dark'
            ? 'Switch to dark appearance'
            : 'Switch to light appearance',
      });
      if (await changeAppearance.count()) await changeAppearance.click();
      if (route === 'devspace')
        await page.getByRole('button', { name: 'Open themed popover' }).click();
      if (route === 'components/dialog')
        await page
          .getByRole('region', { name: 'Overlay playground' })
          .getByRole('button', { name: 'New project' })
          .click();
      if (route === 'components/popover')
        await page
          .getByRole('region', { name: 'Overlay playground' })
          .getByRole('button', { name: 'Edit display name' })
          .click();
      if (route === 'components/combobox') {
        // Base UI hides outside content for virtual-cursor navigation while the
        // input owns focus. Audit the full page closed, then its open listbox.
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual(
          [],
        );
        await page.getByRole('combobox', { name: 'Group name' }).fill('CS');
        await expect(page.getByRole('option').first()).toBeVisible();
      }
      if (route === 'components/date-picker')
        await page.getByRole('button', { name: /^Дата расписания:/ }).click();
      if (route === 'components/toast')
        await page.getByRole('button', { name: 'Show stack' }).click();
      let scan = new AxeBuilder({ page });
      if (route === 'components/combobox')
        scan = scan
          .include('.u-combobox-popup')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']);
      const result = await scan.analyze();
      expect.soft(result.violations, `${appearance}: ${route}`).toEqual([]);
      if (route === 'components/toast') {
        await page.keyboard.press('F6');
        expect
          .soft(
            (await new AxeBuilder({ page }).analyze()).violations,
            `${appearance}: expanded toast stack`,
          )
          .toEqual([]);
      }
    }
  }
});

test('mobile navigation exposes every component and closes after choosing one', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Components', exact: true });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.component-link:visible')).toHaveCount(22);
  await expect(
    page.locator('.component-link').filter({ hasText: /^ScrollArea$/ }),
  ).toBeVisible();
  await page
    .locator('.component-link')
    .filter({ hasText: /^Textarea$/ })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Textarea', exact: true }),
  ).toBeVisible();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('textbox', { name: 'Find components' }).fill('popover');
  await page
    .locator('.component-link')
    .filter({ hasText: /^Popover$/ })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Popover', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('textbox', { name: 'Find components' }),
  ).toHaveValue('');
});

test('field associations, controlled editing, native validation, disabled and read-only states', async ({
  page,
}) => {
  for (const kind of ['input', 'textarea']) {
    await page.goto(`/#components/${kind}`);
    const stage = page.getByRole('region', { name: 'Field playground' });
    const control = stage.getByRole('textbox');
    await control.fill('Campus');
    await expect(stage.getByRole('status')).toHaveText('6 characters');
    await expect(control).toHaveAccessibleDescription(
      kind === 'input'
        ? 'Shown in your project list.'
        : 'Context for the people working on this project.',
    );
    await stage.getByRole('checkbox', { name: 'Invalid', exact: true }).check();
    await expect(control).toHaveAttribute('aria-invalid', 'true');
    await expect(control).toHaveAccessibleDescription(
      /(already in use|more detail)/,
    );
    await stage
      .getByRole('checkbox', { name: 'Read-only', exact: true })
      .check();
    await expect(control).not.toBeEditable();
    await control.focus();
    await page.keyboard.type('ignored');
    await expect(control).toHaveValue('Campus');
    await stage
      .getByRole('checkbox', { name: 'Disabled', exact: true })
      .check();
    await expect(control).toBeDisabled();
    const validation = page.getByRole('region', {
      name: 'Validation examples',
    });
    const email = validation.getByRole('textbox', { name: 'Email address' });
    await email.fill('invalid');
    await email.press('Tab');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAccessibleDescription(/Enter a valid email/);
    const summary = validation.getByRole('textbox', { name: 'Summary' });
    // Base UI defers required errors on untouched empty fields.
    await summary.fill('Draft');
    await summary.fill('');
    await summary.press('Tab');
    await expect(summary).toHaveAccessibleDescription(/Enter a summary/);
    await summary.fill('Valid summary');
    await summary.press('Tab');
    await expect(summary).not.toHaveAttribute('aria-invalid', 'true');
  }
});

test('dialog form validates, contains focus, supports nested popovers and returns focus', async ({
  page,
}) => {
  await page.goto('/#components/dialog');
  const trigger = page
    .getByRole('region', { name: 'Overlay playground' })
    .getByRole('button', { name: 'New project' });
  await trigger.focus();
  await trigger.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Create project' });
  const name = dialog.getByRole('textbox', {
    name: 'Project name',
    exact: true,
  });
  await expect(name).toBeFocused();
  await dialog
    .getByRole('button', { name: 'Create project', exact: true })
    .click();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(name).toHaveAccessibleDescription(/Enter a project name/);
  await expect(name).toBeFocused();
  await dialog.getByRole('button', { name: 'Project visibility' }).click();
  const details = page.getByRole('dialog', { name: 'Private by default' });
  await expect(details).toBeVisible();
  await details.getByRole('button', { name: 'Close details' }).click();
  await expect(
    dialog.getByRole('button', { name: 'Project visibility' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(name).toBeFocused();
  await name.fill('Campus');
  await dialog.getByRole('textbox', { name: 'Notes' }).fill('Shared schedule');
  await dialog
    .getByRole('button', { name: 'Create project', exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(
    page
      .getByRole('region', { name: 'Overlay playground' })
      .getByRole('status'),
  ).toHaveText('Created Campus.');
});

test('public overlays inherit nested themes and work on small touch screens', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 320, height: 568 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5177/#components/dialog');
  for (const appearance of ['light', 'dark']) {
    const trigger = page
      .getByTestId(`overlay-${appearance}`)
      .getByRole('button', { name: 'New project' });
    await trigger.tap();
    const dialog = page.getByRole('dialog', { name: 'Create project' });
    const scope = page.locator('.u-dialog-theme');
    await expect(scope).toHaveAttribute('data-appearance', appearance);

    await expect(scope).toHaveAttribute(
      'dir',
      appearance === 'dark' ? 'rtl' : 'ltr',
    );
    const input = dialog.getByRole('textbox', {
      name: 'Project name',
      exact: true,
    });
    await expect(input).toHaveCSS('border-radius', '16px');
    await expect(input).toHaveCSS('font-size', '16px');
    await expect(dialog).toHaveCSS('transform', 'none');
    expect((await input.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    const rect = (await dialog.boundingBox())!;
    expect(rect.x).toBeGreaterThanOrEqual(16);
    expect(rect.x + rect.width).toBeLessThanOrEqual(304);
    expect(rect.height).toBeLessThanOrEqual(536);
    await dialog.getByRole('button', { name: 'Project visibility' }).tap();
    const popover = page.getByRole('dialog', { name: 'Private by default' });
    await expect(page.locator('.u-popover-theme')).toHaveAttribute(
      'data-appearance',
      appearance,
    );
    const popoverRect = (await popover.boundingBox())!;
    expect(popoverRect.x).toBeGreaterThanOrEqual(0);
    expect(popoverRect.x + popoverRect.width).toBeLessThanOrEqual(320);
    await popover.getByRole('button', { name: 'Close details' }).tap();
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).tap();
    await expect(dialog).not.toBeVisible();
  }
  await context.close();
});

test('popover edits and dismisses, tooltip supplements a named keyboard action', async ({
  page,
}) => {
  await page.goto('/#components/popover');
  const stage = page.getByRole('region', { name: 'Overlay playground' });
  const trigger = stage.getByRole('button', { name: 'Edit display name' });
  await trigger.click();
  const popup = page.getByRole('dialog', { name: 'Display name', exact: true });
  await popup.getByRole('textbox', { name: 'Your name' }).fill('Alex Chen');
  await popup.getByRole('button', { name: 'Save name' }).click();
  await expect(stage.getByRole('status')).toHaveText(
    'Display name saved: Alex Chen.',
  );
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('heading', { name: 'Popover', exact: true }).click();
  await expect(popup).not.toBeVisible();
  await page.goto('/#components/tooltip');
  const action = page.getByRole('button', { name: 'Add project', exact: true });
  await page.getByRole('link', { name: 'API reference', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(action).toBeFocused();
  await expect(page.getByRole('tooltip')).toHaveText('Create a new project');
  await expect(action).toHaveAccessibleDescription('Create a new project');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).not.toBeVisible();
  await expect(action).toBeFocused();
  await action.press('Enter');
  await expect(page.getByRole('status').first()).toHaveText('Added 1 project.');
  await expect(
    page.getByRole('button', { name: 'Unavailable action' }),
  ).toBeDisabled();
});

test('touch sizing and reduced motion work with explicit control sizes', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5177/#components/button');
  const stage = page.getByRole('region', {
    name: 'Interactive button playground',
  });
  await stage.getByRole('radio', { name: 'sm', exact: true }).check();
  const action = stage.getByRole('button', { name: 'Create project' });
  expect((await action.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await stage.getByRole('radio', { name: 'lg', exact: true }).check();
  expect((await action.boundingBox())!.height).toBeGreaterThanOrEqual(48);
  await stage.getByRole('checkbox', { name: 'Loading', exact: true }).check();
  await expect(stage.locator('.u-button-spinner')).toHaveCSS(
    'animation-name',
    'none',
  );
  await context.close();
});

test('select, radio and checkbox support keyboard selection, disabled states and form values', async ({
  page,
}) => {
  await page.goto('/#components/select');
  const stage = page.getByRole('region', { name: 'Selection playground' });
  const language = stage.getByRole('combobox', { name: 'Language' });
  await language.focus();
  await language.press('Enter');
  await expect(page.getByRole('option', { name: 'Français' })).toBeDisabled();
  await page.keyboard.press('e');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(language).toHaveText('Русский');
  await expect(language).toBeFocused();
  await stage.getByRole('button', { name: 'Read form values' }).click();
  await expect(stage.getByRole('status')).toContainText('"language":"ru"');
  await expect(
    page.getByRole('combobox', { name: 'Unavailable language' }),
  ).toBeDisabled();
  await page.goto('/#components/radio-group');
  const weekly = stage.getByRole('radio', { name: 'weekly', exact: true });
  await weekly.focus();
  await weekly.press('ArrowRight');
  await expect(
    stage.getByRole('radio', { name: 'monthly', exact: true }),
  ).toBeChecked();
  await expect(
    stage.getByRole('radio', { name: 'yearly (unavailable)' }),
  ).toBeDisabled();
  await stage.getByRole('button', { name: 'Read form values' }).click();
  await expect(stage.getByRole('status')).toContainText('"schedule":"monthly"');
  await page.goto('/#components/checkbox');
  const updates = stage.getByRole('checkbox', { name: 'Email updates' });
  await updates.focus();
  await updates.press('Space');
  await expect(updates).toBeChecked();
  await stage.getByRole('button', { name: 'Read form values' }).click();
  await expect(stage.getByRole('status')).toContainText('"updates":"on"');
  await expect(
    page.getByRole('checkbox', { name: 'Mixed selection' }),
  ).toHaveAttribute('aria-checked', 'mixed');
  await expect(
    page.getByRole('checkbox', { name: 'Disabled checkbox' }),
  ).toBeDisabled();
});

test('opening and closing a popover preserves page scroll and focus', async ({
  page,
}) => {
  await page.goto('/#components/popover');
  const trigger = page
    .getByRole('region', { name: 'Overlay playground' })
    .getByRole('button', { name: 'Edit display name' });
  const before = await page.evaluate(() => scrollY);
  await trigger.click();
  const popup = page.getByRole('dialog', { name: 'Display name', exact: true });
  await expect(popup.getByRole('textbox', { name: 'Your name' })).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBe(before);
  await page.keyboard.press('Escape');
  await expect(popup).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBe(before);
});

test('overlays animate on entry and exit, tooltip arrow follows its side, reduced motion disables transitions', async ({
  page,
}) => {
  await page.goto('/#components/popover');
  await page
    .getByRole('region', { name: 'Overlay playground' })
    .getByRole('button', { name: 'Edit display name' })
    .click();
  const popup = page.getByRole('dialog', { name: 'Display name', exact: true });
  expect(
    await popup.evaluate((el) =>
      getComputedStyle(el)
        .transitionDuration.split(',')
        .some((v) => parseFloat(v) > 0),
    ),
  ).toBe(true);
  await page.keyboard.press('Escape');
  await expect(popup).not.toBeVisible();
  await page.goto('/#components/tooltip');
  await page.getByRole('button', { name: 'Add project', exact: true }).hover();
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toBeVisible();
  const arrow = tooltip.locator('.u-tooltip-arrow');
  await expect(arrow).toBeVisible();
  await expect(arrow).toHaveAttribute(
    'data-side',
    (await tooltip.getAttribute('data-side')) as string,
  );
  const geometry = await arrow.evaluate((el) => ({
    rect: el.getBoundingClientRect().toJSON(),
    popup: el.parentElement!.getBoundingClientRect().toJSON(),
  }));
  expect(geometry.rect.bottom).toBeGreaterThan(geometry.popup.bottom);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(tooltip).toHaveCSS('transition-duration', '0s');
});

test('async combobox supports search, empty and error states, clearing, and dialog focus', async ({
  page,
}) => {
  await page.goto('/#components/combobox');
  const stage = page.getByRole('region', { name: 'Async group search' });
  const input = stage.getByRole('combobox', { name: 'Group name' });
  await input.fill('CS');
  await expect(page.getByRole('option')).toHaveCount(3);
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(stage.getByRole('status')).toContainText('Selected CS-101.');
  await expect(input).toBeFocused();
  await stage.getByRole('button', { name: 'Clear group search' }).click();
  await expect(input).toHaveValue('');
  await expect(stage.getByRole('status')).toContainText('No group selected.');
  await input.fill('ZZ');
  await expect(
    page.getByText('No groups found.', { exact: true }),
  ).toBeVisible();
  await input.press('Escape');
  await stage.getByRole('checkbox', { name: 'Simulate search error' }).check();
  await input.fill('CS');
  await expect(
    page.getByText('Group search is unavailable. Try again.'),
  ).toBeVisible();
  await input.press('Escape');
  const trigger = page.getByRole('button', {
    name: 'Find a group',
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Find a group' });
  const nestedInput = dialog.getByRole('combobox', { name: 'Group name' });
  await nestedInput.fill('DESIGN');
  await expect(page.getByRole('option', { name: /DESIGN-101/ })).toBeVisible();
  await nestedInput.press('ArrowDown');
  await nestedInput.press('Enter');
  await expect(dialog.getByRole('status')).toContainText(
    'Selected DESIGN-101.',
  );
  await expect(nestedInput).toBeFocused();
  await dialog.getByRole('button', { name: 'Close search' }).click();
  await expect(trigger).toBeFocused();
});

test('calendar localizes, navigates with the keyboard, highlights weeks and returns to today', async ({
  page,
}) => {
  await page.goto('/#components/calendar');
  const calendar = page.locator('.u-calendar');
  await expect(
    calendar.getByRole('columnheader', { includeHidden: true }).first(),
  ).toHaveText('пн');
  const selected = calendar.locator('[aria-selected="true"] button');
  await selected.focus();
  await selected.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.locator('.playground-feedback')).toHaveText('2026-10-20');
  await expect(calendar.locator('.u-cal-selected-week')).toHaveCount(7);
  await page
    .getByRole('checkbox', { name: 'Highlight selected week' })
    .uncheck();
  await expect(calendar.locator('.u-cal-selected-week')).toHaveCount(0);
  await page.getByRole('radio', { name: 'English', exact: true }).check();
  await expect(
    calendar.getByRole('columnheader', { includeHidden: true }).first(),
  ).toHaveText('Mo');
  await expect(
    calendar.getByRole('button', { name: /Thursday, October 1st/ }),
  ).toBeDisabled();
  await calendar.getByRole('button', { name: /next month/i }).click();
  await expect(calendar.getByRole('grid')).toHaveAccessibleName(
    'November 2026',
  );
  await page.getByRole('button', { name: 'Today', exact: true }).click();
  await expect(calendar.getByRole('grid')).toHaveAccessibleName('October 2026');
  await expect(page.locator('.playground-feedback')).toHaveText('2026-10-19');
});

test('selected calendar dates retain readable accent colors on hover in both themes and popup views', async ({
  page,
}) => {
  for (const appearance of ['light', 'dark']) {
    for (const component of ['calendar', 'date-picker']) {
      await page.goto(`/#components/${component}`);
      const appearanceButton = page.getByRole('button', {
        name: `Switch to ${appearance} appearance`,
      });
      if (await appearanceButton.count()) await appearanceButton.click();
      if (component === 'date-picker')
        await page.getByRole('button', { name: /^Дата расписания:/ }).click();
      const calendar = page.locator('.u-calendar');
      const selected = calendar.locator('[aria-selected="true"] button');
      await page.mouse.move(0, 0);
      await expect(selected).toHaveCSS(
        'background-color',
        'rgb(136, 241, 158)',
      );
      await selected.hover();
      await expect(selected).toHaveCSS(
        'background-color',
        'rgb(109, 229, 132)',
      );
      await expect(selected).toHaveCSS('color', 'rgb(16, 40, 24)');
      await expect(calendar.locator('[aria-selected="true"]')).toHaveCount(1);
      await page.mouse.move(0, 0);
      await expect(selected).toHaveCSS(
        'background-color',
        'rgb(136, 241, 158)',
      );
    }
  }
});

test('date picker fits a narrow touch viewport, closes on selection and restores focus without scrolling', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 320, height: 740 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5177/#components/date-picker');
  const trigger = page.getByRole('button', { name: /^Дата расписания:/ });
  await trigger.scrollIntoViewIfNeeded();
  const scrollBefore = await page.evaluate(() => scrollY);
  await trigger.tap();
  const popup = page.getByRole('dialog', {
    name: 'Дата расписания',
    exact: true,
  });
  await expect(popup).toBeVisible();
  await expect(popup).toHaveCSS('transform', 'none');
  expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
  const rect = (await popup.boundingBox())!;
  expect(rect.x).toBeGreaterThanOrEqual(0);
  expect(rect.x + rect.width).toBeLessThanOrEqual(320);
  const days = popup.locator('.u-cal-day_button');
  expect((await days.nth(15).boundingBox())!.height).toBeGreaterThanOrEqual(44);
  expect(await popup.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
    true,
  );
  await popup.locator('[aria-selected="true"] button').tap();
  await expect(popup).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.tap();
  await popup.getByRole('button', { name: 'Сегодня', exact: true }).tap();
  await expect(popup).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page
    .getByRole('checkbox', { name: 'Disable today', exact: true })
    .check();
  await trigger.tap();
  await expect(
    popup.getByRole('button', { name: 'Сегодня', exact: true }),
  ).toBeDisabled();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Clear date', exact: true }).tap();
  await expect(trigger).toHaveText('Выберите дату');
  await page.getByRole('checkbox', { name: 'Disabled', exact: true }).check();
  await expect(trigger).toBeDisabled();
  await page.goto('http://127.0.0.1:5177/#components/combobox');
  const input = page.getByRole('combobox', { name: 'Group name' });
  await input.fill('CS');
  const lastOption = page.getByRole('option', { name: /CS-201/ });
  await lastOption.scrollIntoViewIfNeeded();
  await lastOption.tap();
  await expect(input).toHaveValue('CS-201');
  await expect(input).toBeFocused();
  await context.close();
});

test('segmented radios skip disabled options and notifications support focus, actions, pause and dismissal', async ({
  page,
}) => {
  await page.goto('/#components/radio-group');
  const group = page.getByRole('radiogroup', { name: 'Schedule filter' });
  const free = group.getByRole('radio', { name: 'Free time' });
  await free.focus();
  await free.press('ArrowLeft');
  await expect(group.getByRole('radio', { name: 'On campus' })).toBeChecked();
  await expect(group.getByRole('radio', { name: 'Remote' })).toBeDisabled();
  await page.goto('/#components/toast');
  await page.getByRole('button', { name: 'Show persistent action' }).click();
  const notification = page
    .locator('.u-toast')
    .filter({ hasText: 'Update available' });
  await expect(notification).toBeVisible();
  await page.keyboard.press('F6');
  await expect(
    page.getByRole('region', { name: 'Notifications', exact: true }),
  ).toBeFocused();
  await notification
    .getByRole('button', { name: 'Update', exact: true })
    .click();
  await expect(notification).not.toBeVisible();
  await page.clock.install();
  await page.getByRole('button', { name: 'Show success' }).click();
  const success = page.locator('.u-toast').filter({ hasText: 'Link copied' });
  await success.hover();
  await page.clock.fastForward(6000);
  await expect(success).toBeVisible();
  await page.mouse.move(0, 0);
  await page.clock.fastForward(5000);
  await expect(success).not.toBeVisible();
});

test('loading, retry and empty-state examples expose meaningful states and respect reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#components/spinner');
  await expect(
    page.getByRole('status', { name: 'Loading schedules' }),
  ).toBeVisible();
  await expect(
    page.getByRole('status', { name: 'Loading schedules' }),
  ).toHaveCSS('animation-name', 'none');
  await page.goto('/#components/skeleton');
  await expect(page.locator('.u-card')).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('.u-skeleton').first()).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await expect(page.locator('.u-skeleton').first()).toHaveCSS(
    'animation-name',
    'none',
  );
  await page.getByRole('checkbox', { name: 'Loading example' }).uncheck();
  await expect(
    page.getByText('Schedule loaded', { exact: true }),
  ).toBeVisible();
  await page.goto('/#components/alert');
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Retry requested' }),
  ).toBeVisible();
  await page.goto('/#components/card');
  await page.getByRole('button', { name: 'Add a group', exact: true }).click();
  await expect(page.getByText('Group added', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset example' }).click();
  await expect(
    page.getByRole('heading', { name: 'No groups selected' }),
  ).toBeVisible();
});

test('mixed-height toast stacks settle without resize errors when expanded, collapsed and resized', async ({
  page,
}) => {
  const readErrors = await recordRuntimeErrors(page);
  await page.goto('/#components/toast');
  await page.getByRole('button', { name: 'Show stack', exact: true }).click();
  const front = page.locator('.u-toast').filter({ hasText: 'Groups saved' });
  const back = page.locator('.u-toast').filter({ hasText: 'Schedule updated' });
  const settle = () =>
    page.evaluate(async () => {
      await Promise.all(
        document
          .getAnimations()
          .map((animation) => animation.finished.catch(() => {})),
      );
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
    });
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 900 });
    if (width === 320)
      await page
        .getByRole('button', { name: 'Switch to dark appearance' })
        .click();
    for (let i = 0; i < 3; i++) {
      await front.hover();
      await expect(back).toHaveAttribute('data-expanded', '');
      await settle();
      for (const card of await page.locator('.u-toast').all()) {
        const { available, content } = await card.evaluate((element) => ({
          available: element.clientHeight,
          content: (element.querySelector('.u-toast-content') as HTMLElement)
            .offsetHeight,
        }));
        expect(content - available).toBeLessThanOrEqual(1);
      }
      if (i === 0)
        await page.screenshot({ path: `.local/toast-expanded-${width}.png` });
      await page.mouse.move(0, 0);
      await expect(back).not.toHaveAttribute('data-expanded', '');
      await settle();
    }
  }
  expect(await readErrors()).toEqual([]);
});

test('toast cards overlap by default, expand on hover and keyboard focus, and dismiss individually', async ({
  page,
}) => {
  await page.goto('/#components/toast');
  await page.getByRole('button', { name: 'Show stack', exact: true }).click();
  const front = page.locator('.u-toast').filter({ hasText: 'Groups saved' });
  const middle = page
    .locator('.u-toast')
    .filter({ hasText: 'Comparison link ready' });
  const back = page.locator('.u-toast').filter({ hasText: 'Schedule updated' });
  await expect(page.locator('.u-toast')).toHaveCount(3);
  await expect(back.locator('.u-toast-content')).toBeHidden();
  await expect(
    page.getByRole('button', { name: 'Dismiss notification' }),
  ).toHaveCount(1);
  await expect
    .poll(
      async () =>
        (await back.boundingBox())!.width / (await front.boundingBox())!.width,
    )
    .toBeLessThan(0.9);
  const frontRect = (await front.boundingBox())!;
  const backRect = (await back.boundingBox())!;
  expect(backRect.y).toBeLessThan(frontRect.y);
  expect(backRect.y + backRect.height).toBeGreaterThan(frontRect.y);
  expect(backRect.y + backRect.height).toBeLessThan(
    frontRect.y + frontRect.height,
  );
  await front.hover();
  await expect(back.locator('.u-toast-content')).toBeVisible();
  await expect
    .poll(async () => {
      const older = (await back.boundingBox())!;
      return older.y + older.height - (await middle.boundingBox())!.y;
    })
    .toBeLessThan(-10);
  // Crossing the gap must not collapse the cards underneath the pointer.
  const middleRect = (await middle.boundingBox())!;
  await page.mouse.move(
    middleRect.x + 30,
    middleRect.y + middleRect.height + 5,
  );
  await expect(back.locator('.u-toast-content')).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(back.locator('.u-toast-content')).toBeHidden();
  await page.keyboard.press('F6');
  await expect(back.locator('.u-toast-content')).toBeVisible();
  const dismiss = back.getByRole('button', { name: 'Dismiss notification' });
  await dismiss.focus();
  await dismiss.press('Space');
  await expect(back).not.toBeVisible();
  await expect(page.locator('.u-toast')).toHaveCount(2);
  await page.getByRole('button', { name: 'Dismiss all' }).click();
  await expect(page.locator('.u-toast')).toHaveCount(0);
  await page.getByRole('button', { name: 'Show persistent action' }).click();
  const swipeCard = page.locator('.u-toast');
  await expect(swipeCard).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  const swipeRect = (await swipeCard.boundingBox())!;
  await page.mouse.move(swipeRect.x + 30, swipeRect.y + 24);
  await page.mouse.down();
  await page.mouse.move(swipeRect.x + swipeRect.width + 60, swipeRect.y + 24, {
    steps: 8,
  });
  await page.mouse.up();
  await expect(swipeCard).not.toBeVisible();
});

test('toast stack expands on touch and stays within a narrow viewport with reduced motion', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
    viewport: { width: 320, height: 740 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5177/#components/toast');
  await page.getByRole('button', { name: 'Show stack', exact: true }).tap();
  const front = page.locator('.u-toast').filter({ hasText: 'Groups saved' });
  const back = page.locator('.u-toast').filter({ hasText: 'Schedule updated' });
  await expect(back.locator('.u-toast-content')).toBeHidden();
  await front.tap({ position: { x: 35, y: 24 } });
  await expect(back.locator('.u-toast-content')).toBeVisible();
  for (const card of await page.locator('.u-toast').all()) {
    const rect = (await card.boundingBox())!;
    expect(rect.x).toBeGreaterThanOrEqual(0);
    expect(rect.x + rect.width).toBeLessThanOrEqual(320);
    expect(rect.y).toBeGreaterThanOrEqual(0);
    expect(rect.y + rect.height).toBeLessThanOrEqual(740);
    await expect(card).toHaveCSS('transition-duration', '0s');
  }
  await back.getByRole('button', { name: 'Dismiss notification' }).tap();
  await expect(back).not.toBeVisible();
  await page.getByRole('heading', { name: 'Toast', exact: true }).tap();
  await expect(
    page.locator('.u-toast-content[data-behind]').first(),
  ).toBeHidden();
  await context.close();
});

test('showcase preserves appearance across reloads and navigation, updates portals, and tolerates unavailable storage', async ({
  page,
}) => {
  await page.goto('/#components/toast');
  await page.getByRole('button', { name: 'Show stack' }).click();
  await page.getByRole('button', { name: 'Switch to dark appearance' }).click();
  await expect(page.locator('.workspace')).toHaveAttribute(
    'data-appearance',
    'dark',
  );
  await expect(page.locator('.u-toast-theme')).toHaveAttribute(
    'data-appearance',
    'dark',
  );
  await page.reload();
  await expect(page.locator('.workspace')).toHaveAttribute(
    'data-appearance',
    'dark',
  );
  await page.goto('/#components/button');
  await expect(page.locator('.workspace')).toHaveAttribute(
    'data-appearance',
    'dark',
  );
  await page
    .getByRole('button', { name: 'Switch to light appearance' })
    .click();
  await page.reload();
  await expect(page.locator('.workspace')).toHaveAttribute(
    'data-appearance',
    'light',
  );
  await page.evaluate(() =>
    localStorage.setItem('unlikely-ui:appearance', 'invalid'),
  );
  await page.reload();
  await expect(page.locator('.workspace')).toHaveAttribute(
    'data-appearance',
    'light',
  );
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException('Storage is unavailable', 'SecurityError');
    };
    Storage.prototype.setItem = () => {
      throw new DOMException('Storage is unavailable', 'SecurityError');
    };
  });
  await page.reload();
  await expect(page.locator('.workspace')).toHaveAttribute(
    'data-appearance',
    'light',
  );
  await page.getByRole('button', { name: 'Switch to dark appearance' }).click();
  await expect(page.locator('.workspace')).toHaveAttribute(
    'data-appearance',
    'dark',
  );
});

test('physical button activates by keyboard and pointer, animates pressure, and supports live customization', async ({
  page,
}) => {
  await page.goto('/#components/physical-button');
  const stage = page.getByRole('region', {
    name: 'Physical button playground',
  });
  const button = stage.getByRole('button', { name: 'Push', exact: true });
  const cap = button.locator('.u-physical-cap');
  await button.focus();
  await button.press('Enter');
  await expect(stage.getByRole('status')).toHaveText('Activated 1 time.');
  await page.keyboard.down('Space');
  await expect
    .poll(() =>
      cap.evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42,
      ),
    )
    .toBeGreaterThan(-2);
  await expect(stage.getByRole('status')).toHaveText('Activated 1 time.');
  await page.keyboard.up('Space');
  await expect(stage.getByRole('status')).toHaveText('Activated 2 times.');
  await expect
    .poll(() =>
      cap.evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42,
      ),
    )
    .toBeLessThan(-7);
  await button.click();
  await expect(stage.getByRole('status')).toHaveText('Activated 3 times.');
  await stage.getByRole('combobox', { name: 'Preset' }).click();
  await page.getByRole('option', { name: 'Mint', exact: true }).click();
  await expect(button).toHaveCSS('color', 'rgb(16, 40, 24)');
  await expect(
    stage.getByRole('checkbox', { name: 'Hazard stripes' }),
  ).not.toBeChecked();
  await stage.getByRole('combobox', { name: 'Shape' }).click();
  await page.getByRole('option', { name: 'Square', exact: true }).click();
  await expect(cap).toHaveCSS('border-radius', '20px');
  await stage.getByRole('combobox', { name: 'Press depth' }).click();
  await page.getByRole('option', { name: 'High', exact: true }).click();
  await expect
    .poll(() =>
      cap.evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42,
      ),
    )
    .toBeLessThan(-11);
  await stage.getByRole('checkbox', { name: 'Disabled', exact: true }).check();
  await expect(button).toBeDisabled();
  await stage
    .getByRole('checkbox', { name: 'Disabled', exact: true })
    .uncheck();
  await stage.getByRole('textbox', { name: 'Cap label' }).fill('Launch');
  await expect(
    stage.getByRole('button', { name: 'Launch', exact: true }),
  ).toBeVisible();
  await stage.getByRole('checkbox', { name: 'Icon only' }).check();
  await stage.getByRole('button', { name: 'Activate physical button' }).click();
  await expect(stage.getByRole('status')).toHaveText('Activated 4 times.');
  await stage.getByRole('checkbox', { name: 'Icon only' }).uncheck();
  await stage.getByRole('textbox', { name: 'Cap label' }).fill('');
  await expect(stage.locator('.u-physical-label')).toBeEmpty();
  await stage.getByRole('button', { name: 'Activate physical button' }).click();
  await expect(stage.getByRole('status')).toHaveText('Activated 5 times.');
  const power = page.getByRole('button', { name: 'Power', exact: true });
  await power.click();
  await expect(power).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByRole('status').filter({ hasText: /^Power on$/ }),
  ).toBeVisible();
});

test('physical button fits mobile at every size, supports touch and respects reduced motion', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
    viewport: { width: 320, height: 740 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5177/#components/physical-button');
  const stage = page.getByRole('region', {
    name: 'Physical button playground',
  });
  const button = stage.getByRole('button', { name: 'Push', exact: true });
  for (const size of ['sm', 'md', 'lg']) {
    await stage.getByRole('radio', { name: size, exact: true }).check();
    await button.scrollIntoViewIfNeeded();
    const rect = (await button.boundingBox())!;
    expect(rect.x).toBeGreaterThanOrEqual(0);
    expect(rect.x + rect.width).toBeLessThanOrEqual(320);
    expect(rect.width).toBeGreaterThanOrEqual(44);
    expect(
      await button
        .locator('.u-physical-indicator')
        .evaluate((el) => parseFloat(getComputedStyle(el, '::after').height)),
    ).toBeGreaterThan(0);
    await button.tap();
  }
  await expect(stage.getByRole('status')).toHaveText('Activated 3 times.');
  await expect(button.locator('.u-physical-cap')).toHaveCSS(
    'transition-duration',
    '0s',
  );
  await expect
    .poll(() =>
      button
        .locator('.u-physical-indicator')
        .evaluate((el) => getComputedStyle(el, '::after').transitionDuration),
    )
    .toBe('0s');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});

test('physical front light follows momentary pressure and committed toggle state', async ({
  page,
}) => {
  await page.goto('/#components/physical-button');
  const stage = page.getByRole('region', {
    name: 'Physical button playground',
  });
  const button = stage.getByRole('button', { name: 'Push', exact: true });
  const light = button.locator('.u-physical-indicator');
  const brightness = () =>
    light.evaluate((el) => getComputedStyle(el, '::after').opacity);
  await expect.poll(brightness).toBe('0');
  await button.focus();
  await page.keyboard.down('Space');
  await expect.poll(brightness).toBe('1');
  await page.keyboard.up('Space');
  await expect.poll(brightness).toBe('0');
  await stage.getByRole('checkbox', { name: 'Toggle mode' }).check();
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await button.focus();
  await page.keyboard.down('Space');
  await expect.poll(brightness).toBe('0');
  await page.keyboard.up('Space');
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(stage.getByRole('status')).toHaveText('On');
  await expect.poll(brightness).toBe('1');
  await stage.getByLabel('Light color', { exact: true }).fill('#f4c66a');
  await expect(light).toHaveCSS('--u-physical-indicator', '#f4c66a');
  await stage.getByRole('checkbox', { name: 'Disabled', exact: true }).check();
  await button.click({ force: true });
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(brightness).toBe('1');
  await stage
    .getByRole('checkbox', { name: 'Disabled', exact: true })
    .uncheck();
  await button.press('Enter');
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await expect(stage.getByRole('status')).toHaveText('Off');
  await expect.poll(brightness).toBe('0');
  await stage.getByRole('checkbox', { name: 'Front light' }).uncheck();
  await expect(light).toHaveCount(0);
});

test('every catalogue component has a generated API view and compound parts expose searchable props', async ({
  page,
}) => {
  await page.goto('/');
  const components = await page.locator('.catalog-item').evaluateAll((links) =>
    links.map((link) => ({
      href: link.getAttribute('href')!,
      name: link.querySelector('strong')!.textContent!,
    })),
  );
  for (const component of components) {
    await page.goto(`/${component.href}/api`);
    await expect(
      page.getByRole('region', {
        name: `${component.name} API reference`,
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'API reference', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
  }
  await page.goto('/#components/dialog/api');
  await page
    .getByRole('combobox', { name: 'Component part or function' })
    .click();
  await page
    .getByRole('option', { name: 'Dialog.Content', exact: true })
    .click();
  await page
    .getByRole('textbox', { name: 'Filter API properties' })
    .fill('portalProps');
  const table = page.getByRole('table', {
    name: 'Dialog.Content component properties',
  });
  await expect(table).toContainText('Props for the Base UI portal');
  await page
    .getByRole('textbox', { name: 'Filter API properties' })
    .fill('onPaste');
  await page.getByText(/React and DOM properties \(\d+\)/).click();
  await expect(
    page.getByRole('table', {
      name: 'Dialog.Content React and DOM properties',
    }),
  ).toContainText('ClipboardEvent<HTMLDivElement>');
  await page.goto('/#components/button/api');
  await page
    .locator('.api-types summary')
    .filter({ hasText: /^ButtonProps$/ })
    .click();
  await expect(
    page.locator('.api-types .api-declaration[open] .code-block'),
  ).toContainText('aria-labelledby');
  await page.goto('/#components/toast/api');
  await page
    .getByRole('combobox', { name: 'Component part or function' })
    .click();
  await page
    .getByRole('option', { name: 'Toast.useToastManager', exact: true })
    .click();
  await expect(
    page.getByRole('table', { name: 'Toast.useToastManager return value' }),
  ).toContainText('ToastManagerAddOptions');
});

test('API references expose optional options, conditional defaults and complete declarations', async ({
  page,
}) => {
  await page.goto('/#components/combobox/api');
  await page
    .getByRole('combobox', { name: 'Component part or function' })
    .click();
  await page
    .getByRole('option', { name: 'Combobox.useFilter', exact: true })
    .click();
  const options = page.getByRole('table', {
    name: 'Combobox.useFilter component properties',
  });
  for (const name of ['locale', 'multiple', 'value']) {
    await expect(
      options.getByRole('row', { name: new RegExp(`^${name} Optional`) }),
    ).toBeVisible();
  }
  await page.goto('/#components/button/api');
  await page
    .getByRole('textbox', { name: 'Filter API properties' })
    .fill('focusableWhenDisabled');
  await expect(
    page.getByRole('row', { name: /^focusableWhenDisabled Optional/ }),
  ).toContainText('loading');
  await page.getByText('Full module declarations', { exact: true }).click();
  const declaration = page.getByRole('region', {
    name: 'Module declarations',
    exact: true,
  });
  await expect(declaration).toContainText('import { Button as BaseButton }');
  await expect(declaration).toContainText('interface ButtonBaseProps');
  await expect(page).toHaveURL(/#components\/button\/api$/);
});

test('complex inherited types keep public lookups readable with exact compiler output available', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/#components/dialog/api');
  await page
    .getByRole('combobox', { name: 'Component part or function' })
    .click();
  await page
    .getByRole('option', { name: 'Dialog.Trigger', exact: true })
    .click();
  await page
    .getByRole('textbox', { name: 'Filter API properties' })
    .fill('ref');
  const row = page.getByRole('row', { name: /^ref Optional/ });
  await expect(row.locator('.api-property-type')).toContainText(
    'Parameters<typeof Dialog.Trigger<Payload>>',
  );
  await expect(row.locator('.api-property-type')).not.toContainText(
    'DO_NOT_USE',
  );
  await row.getByText('Compiler expansion', { exact: true }).click();
  await expect(row.locator('.code-block')).toContainText(
    'DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);

  await page.goto('/#components/tooltip/api');
  await page
    .getByRole('combobox', { name: 'Component part or function' })
    .click();
  await page.getByRole('option', { name: 'Tooltip.Root', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Filter API properties' })
    .fill('children');
  await expect(page.locator('.api-property-type')).toHaveText(
    'TooltipRootProps<Payload>["children"]',
  );
});

test('typed API references fit mobile and remain accessible in both themes', async ({
  page,
}) => {
  for (const appearance of ['light', 'dark']) {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto('/#components/date-picker/api');
    const appearanceButton = page.getByRole('button', {
      name: `Switch to ${appearance} appearance`,
    });
    if (await appearanceButton.count()) await appearanceButton.click();
    const reference = page.getByRole('region', {
      name: 'DatePicker API reference',
      exact: true,
    });
    await expect(reference).toBeVisible();
    await expect(reference.locator('.api-intro pre')).toHaveAttribute(
      'data-highlighted',
      'true',
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole('textbox', { name: 'Filter API properties' })
      .fill('label');
    await expect(
      reference.getByRole('row', { name: /^label Required/ }),
    ).toContainText('accessible name');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
});

test('syntax coloring follows appearance, preserves copied source and safely handles editable snippets', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#components/button');
  const block = page.locator('.code-block').first();
  const code = block.locator('pre code');
  await expect(block.locator('pre')).toHaveAttribute(
    'data-highlighted',
    'true',
  );
  const source = await code.textContent();
  const colors = await code
    .locator('.syntax-token')
    .evaluateAll((tokens) => [
      ...new Set(tokens.map((token) => getComputedStyle(token).color)),
    ]);
  expect(colors.length).toBeGreaterThan(2);
  await block.getByRole('button', { name: 'Copy', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    source,
  );
  const token = code.locator('.syntax-token').first();
  const light = await token.evaluate((el) => getComputedStyle(el).color);
  await page.getByRole('button', { name: 'Switch to dark appearance' }).click();
  await expect
    .poll(() => token.evaluate((el) => getComputedStyle(el).color))
    .not.toBe(light);
  await expect(code).toHaveText(source!);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto('/#components/physical-button');
  await page.getByRole('textbox', { name: 'Cap label' }).fill('<b>Push</b>');
  await expect(page.locator('.code-block pre')).toHaveAttribute(
    'data-highlighted',
    'true',
  );
  await expect(page.locator('.code-block code')).toContainText('<b>Push</b>');
  await expect(page.locator('.code-block b')).toHaveCount(0);
});

test('tooltips honor the selected delay on every hover and open immediately for keyboard focus', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/#components/tooltip');
  const trigger = page.getByRole('button', {
    name: 'Add project',
    exact: true,
  });
  const settings = page.getByRole('button', {
    name: 'Project settings',
    exact: true,
  });
  const createTooltip = page
    .getByRole('tooltip')
    .filter({ hasText: 'Create a new project' });
  const settingsTooltip = page
    .getByRole('tooltip')
    .filter({ hasText: 'Manage project settings' });
  for (const delay of [300, 600]) {
    if (delay === 600) {
      await page.getByRole('combobox', { name: 'Hover delay' }).click();
      await page.getByRole('option', { name: '600 ms', exact: true }).click();
    }
    await trigger.hover();
    await page.clock.runFor(delay - 100);
    await expect(createTooltip).not.toBeVisible();
    await page.clock.runFor(150);
    await expect(createTooltip).toBeVisible();

    // Moving directly from an open tooltip must not bypass the next delay.
    await settings.hover();
    await page.clock.runFor(delay - 100);
    await expect(settingsTooltip).not.toBeVisible();
    await page.clock.runFor(150);
    await expect(settingsTooltip).toBeVisible();
    await expect(createTooltip).not.toBeVisible();

    // Re-enter during what used to be the Provider's instant-open phase.
    await page.mouse.move(0, 0);
    await page.clock.runFor(50);
    await expect(settingsTooltip).not.toBeVisible();
    await settings.hover();
    await page.clock.runFor(delay - 100);
    await expect(settingsTooltip).not.toBeVisible();
    await page.clock.runFor(150);
    await expect(settingsTooltip).toBeVisible();
    await page.keyboard.press('Escape');
    await page.mouse.move(0, 0);
  }
  // Focus bypasses the nonzero 600ms setting, independently of hover timing.
  await trigger.focus();
  await expect(createTooltip).toBeVisible({ timeout: 200 });
  await expect(trigger).toHaveAccessibleDescription('Create a new project');
  await page.keyboard.press('Escape');
  await page.getByRole('combobox', { name: 'Hover delay' }).click();
  await page.getByRole('option', { name: 'Instant', exact: true }).click();
  await trigger.hover();
  await page.clock.runFor(20);
  await expect(createTooltip).toBeVisible();
});
