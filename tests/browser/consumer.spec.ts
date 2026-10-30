import { test, expect } from '@playwright/test';

test('open DatePicker disabling prevents selection and reenabling keeps it closed', async ({
  page,
}) => {
  await page.goto('/');
  const probe = page.getByRole('region', { name: 'Live control changes' });
  const trigger = probe.getByRole('button', {
    name: 'Mutable date: Choose a date',
    exact: true,
  });
  await trigger.click();
  const popup = page.getByRole('dialog', { name: 'Mutable date', exact: true });
  await expect(popup).toBeVisible();
  const disable = probe.getByRole('button', {
    name: 'Disable picker',
    exact: true,
  });
  // Model an app state change without an outside pointer event dismissing the
  // popup first. The app establishes its enabled focus destination in advance.
  await disable.focus();
  await disable.evaluate((element) => (element as HTMLButtonElement).click());
  await expect(popup).toBeHidden();
  await expect(trigger).toBeDisabled();
  await expect(probe.getByLabel('Date changes')).toHaveText('0');
  await expect(
    probe.getByRole('button', { name: 'Enable picker', exact: true }),
  ).toBeFocused();
  await probe
    .getByRole('button', { name: 'Enable picker', exact: true })
    .click();
  await expect(popup).toBeHidden();
  await trigger.click();
  await page.getByRole('button', { name: 'Today', exact: true }).click();
  await expect(probe.getByLabel('Date changes')).toHaveText('1');
});

test('Theme direction changes refresh Tabs geometry and preserve selection and focus', async ({
  page,
}) => {
  await page.goto('/');
  const probe = page.getByRole('region', { name: 'Live control changes' });
  const list = probe.getByRole('tablist', { name: 'Live panels', exact: true });
  const selected = list.getByRole('tab', { name: 'Details', exact: true });
  await selected.click();
  const indicator = list.locator('.u-tabs-indicator');
  const aligned = async () => {
    const tabBox = await selected.boundingBox();
    const lineBox = await indicator.boundingBox();
    return (
      !!tabBox &&
      !!lineBox &&
      Math.abs(tabBox.x - lineBox.x) < 1 &&
      Math.abs(tabBox.width - lineBox.width) < 1
    );
  };
  await expect.poll(aligned).toBe(true);
  const vertical = probe
    .getByRole('tablist', { name: 'Vertical live panels', exact: true })
    .getByRole('tab', { name: 'Overview', exact: true });
  expect(
    await vertical.evaluate((el) =>
      parseFloat(getComputedStyle(el, '::after').left),
    ),
  ).toBe(0);
  await probe
    .getByRole('button', { name: 'Use LTR tabs', exact: true })
    .evaluate((element) => (element as HTMLButtonElement).click());
  await expect(selected).toHaveAttribute('aria-selected', 'true');
  await expect(selected).toBeFocused();
  await expect.poll(aligned).toBe(true);
  expect(
    await vertical.evaluate((el) =>
      parseFloat(getComputedStyle(el, '::after').right),
    ),
  ).toBe(0);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(vertical).toHaveCSS('text-decoration-line', 'underline');
});

test('closed retained Dialog allows page clicks and preserves its draft on reopening', async ({
  page,
}) => {
  await page.goto('/');
  const probe = page.getByRole('region', { name: 'Retained Dialog probe' });
  await probe
    .getByRole('button', { name: 'Outside clicks: 0', exact: true })
    .click();
  await probe
    .getByRole('button', { name: 'Open retained dialog', exact: true })
    .click();
  const dialog = page.getByRole('dialog', {
    name: 'Retained dialog',
    exact: true,
  });
  await dialog
    .getByRole('textbox', { name: 'Retained draft', exact: true })
    .fill('Keep this edit');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(
    probe.getByRole('button', { name: 'Open retained dialog', exact: true }),
  ).toBeFocused();
  await probe
    .getByRole('button', { name: 'Outside clicks: 1', exact: true })
    .click();
  await probe
    .getByRole('button', { name: 'Open retained dialog', exact: true })
    .click();
  await expect(
    dialog.getByRole('textbox', { name: 'Retained draft', exact: true }),
  ).toHaveValue('Keep this edit');
  await page.keyboard.press('Escape');
  await expect(
    probe.getByRole('button', { name: 'Outside clicks: 2', exact: true }),
  ).toBeVisible();
});

test('portal language inherits through Theme and nested overrides stay scoped', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Проверить язык', exact: true })
    .click();
  const dialog = page.getByRole('dialog', {
    name: 'Язык диалога',
    exact: true,
  });
  await expect(dialog).toBeVisible();
  expect(
    await dialog.evaluate((element) =>
      element.closest('[lang]')?.getAttribute('lang'),
    ),
  ).toBe('ru');
  await dialog.getByRole('combobox', { name: 'Проект', exact: true }).click();
  expect(
    await page
      .getByRole('listbox')
      .evaluate((element) => element.closest('[lang]')?.getAttribute('lang')),
  ).toBe('ru');
  await page.keyboard.press('Escape');
  await dialog
    .getByRole('button', { name: 'Open English panel', exact: true })
    .click();
  const english = page.getByRole('dialog', {
    name: 'English panel',
    exact: true,
  });
  expect(
    await english.evaluate((element) =>
      element.closest('[lang]')?.getAttribute('lang'),
    ),
  ).toBe('en');
  expect(
    await dialog.evaluate((element) =>
      element.closest('[lang]')?.getAttribute('lang'),
    ),
  ).toBe('ru');
  expect(await page.locator('html').getAttribute('lang')).toBe('en');
  await english
    .getByRole('button', { name: 'Close English panel', exact: true })
    .click();
  await dialog
    .getByRole('button', { name: 'Закрыть проверку', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Проверить язык', exact: true }),
  ).toBeFocused();
});

test('copied workflow carries its layout and compound consumers retain explicit composition', async ({
  page,
}) => {
  await page.goto('/');
  const copied = page.getByRole('region', { name: 'Copied project workflow' });
  await copied
    .getByRole('button', { name: 'New project', exact: true })
    .click();
  const dialog = page.getByRole('dialog', {
    name: 'Create project',
    exact: true,
  });
  await expect(dialog.locator('form')).toHaveCSS('display', 'grid');
  await expect(dialog.locator('form')).toHaveCSS('row-gap', '20px');
  await expect(dialog.locator('.example-actions')).toHaveCSS('display', 'flex');
  await dialog
    .getByRole('textbox', { name: 'Project name', exact: true })
    .fill('Copied workflow');
  await dialog
    .getByRole('button', { name: 'Create project', exact: true })
    .click();
  await expect(copied.getByRole('status')).toHaveText(
    'Created Copied workflow.',
  );
  const trigger = page.getByRole('button', {
    name: 'Legacy project',
    exact: true,
  });
  await trigger.click();
  const legacy = page.getByRole('dialog', {
    name: 'Legacy project form',
    exact: true,
  });
  await expect(
    legacy.getByRole('button', { name: 'Close', exact: true }),
  ).toHaveCount(0);
  await expect(
    legacy.getByRole('textbox', { name: 'Legacy project name' }),
  ).toHaveCSS('border-radius', '12px');
  const input = legacy.getByRole('combobox', { name: 'Legacy option' });
  await input.fill('Old');
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(input).toHaveValue('Old API');
  await legacy.getByRole('button', { name: 'Cancel legacy project' }).click();
  await expect(trigger).toBeFocused();
});

test('packed common controls submit, select panels, and restore nested themes through Menu portals', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const controls = page.getByRole('region', { name: 'Packed common controls' });
  const setting = controls.getByRole('switch', { name: 'Packed auto-save' });
  const checkedThumbX = await setting
    .locator('.u-switch-thumb')
    .evaluate((element) => element.getBoundingClientRect().x);
  await setting.focus();
  await page.keyboard.press('Space');
  await expect(setting).not.toBeChecked();
  await expect
    .poll(() =>
      setting
        .locator('.u-switch-thumb')
        .evaluate((element) => element.getBoundingClientRect().x),
    )
    .toBeGreaterThan(checkedThumbX);
  await controls
    .getByRole('button', { name: 'Submit packed preference' })
    .click();
  await expect(controls.getByRole('status')).toHaveText('Preference: off.');
  await controls
    .getByRole('button', { name: 'Reset packed preference' })
    .click();
  await expect(setting).toBeChecked();
  await controls.getByRole('tab', { name: 'Details', exact: true }).focus();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('Enter');
  await expect(
    controls.getByRole('tabpanel', { name: 'Activity' }),
  ).toContainText('Packed activity panel');
  const trigger = controls.getByRole('button', { name: 'Packed actions' });
  await trigger.click();
  await expect(page.locator('.u-menu-theme')).toHaveAttribute(
    'data-appearance',
    'light',
  );
  await expect(page.getByRole('menu')).toHaveCSS('direction', 'rtl');
  const duplicate = page.getByRole('menuitem', {
    name: 'Duplicate packed project',
  });
  await duplicate.focus();
  await expect(duplicate).toHaveCSS('background-color', 'rgb(214, 203, 238)');
  await expect(duplicate).toHaveCSS('color', 'rgb(20, 32, 22)');
  await page.keyboard.press('Enter');
  await expect(controls.getByRole('status')).toHaveText(
    'Packed duplicate selected.',
  );
  await expect(trigger).toBeFocused();
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { hydrationErrors: string[] }).hydrationErrors,
    ),
  ).toEqual([]);
});

test('packed scroll area has styled overflow and keyboard scrolling', async ({
  page,
}) => {
  await page.goto('/');
  const viewport = page.getByRole('region', { name: 'Packed resources' });
  const area = page.getByTestId('packed-scroll-area');
  await expect(area.locator('.u-scroll-thumb')).toBeVisible();
  await expect(area.locator('.u-scrollbar')).toHaveCSS('width', '12px');
  await viewport.focus();
  await page.keyboard.press('PageDown');
  await expect
    .poll(() => viewport.evaluate((e) => e.scrollTop))
    .toBeGreaterThan(0);
});

test('packed tooltip timing inherits Provider settings and honors Trigger overrides', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/');
  const overridden = page.getByRole('button', { name: 'Keyboard hint' });
  const inherited = page.getByRole('button', {
    name: 'Timed hint',
    exact: true,
  });
  const tooltip = page.getByRole('tooltip');
  // install() still advances with wall time; freeze it before measuring the
  // short Trigger override so actionability checks cannot consume its delay.
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
  await overridden.hover();
  await page.clock.runFor(50);
  await expect(tooltip).not.toBeVisible();
  await page.clock.runFor(75);
  await expect(tooltip).toHaveText('Packed tooltip');
  await page.mouse.move(0, 0);
  await page.clock.runFor(25);
  await expect(tooltip).not.toBeVisible();
  await inherited.hover();
  await page.clock.runFor(500);
  await expect(tooltip).not.toBeVisible();
  await page.clock.runFor(150);
  await expect(tooltip).toHaveText('Provider timing');
  await page.mouse.move(0, 0);
  await page.clock.runFor(100);
  await expect(tooltip).toBeVisible();
  await page.clock.runFor(150);
  await expect(tooltip).not.toBeVisible();
  await inherited.focus();
  await expect(tooltip).toHaveText('Provider timing', { timeout: 200 });
});

test('packed modules hydrate, respond, and share nested theme state with a portal', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByTestId('default-button').click();
  await expect(page.getByTestId('default-button')).toHaveText('Count 1');
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { hydrationErrors: string[] }).hydrationErrors,
    ),
  ).toEqual([]);
  await page.locator('#host-button').hover();
  await expect(page.getByTestId('default-button')).toHaveCSS(
    'background-color',
    'rgb(136, 241, 158)',
  );
  await page.getByRole('button', { name: 'Toggle portal probe' }).click();
  const portal = page.getByTestId('packed-portal');
  await expect(portal).toHaveAttribute('data-appearance', 'light');

  await expect(portal).toHaveAttribute('dir', 'rtl');
  await expect(portal.getByRole('button')).toHaveCSS('border-radius', '16px');
});

test('shadcn composition, editable selection chips and semantic utilities retain scoped portal themes', async ({
  page,
}) => {
  await page.goto('/');
  const groups = page.getByRole('combobox', { name: 'Migration groups' });
  await expect(
    page.getByRole('button', { name: 'Remove Engineering', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Remove Design', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Remove Engineering', exact: true })
    .click();
  await expect(
    page.getByRole('status').filter({ hasText: /^Migration groups:/ }),
  ).toHaveText('Migration groups: none');
  await groups.fill('Eng');
  await groups.press('ArrowDown');
  await groups.press('Enter');
  await expect(
    page.getByRole('button', { name: 'Remove Engineering', exact: true }),
  ).toBeVisible();
  await groups.press('Escape');
  const trigger = page.getByRole('button', { name: 'Open shadcn theme probe' });
  await trigger.click();
  const dialog = page.getByRole('dialog', {
    name: 'Shadcn theme probe',
    exact: true,
  });
  const probe = page.getByTestId('shadcn-portal-alias');
  await expect(probe).toHaveCSS('border-top-color', 'rgb(191, 220, 255)');
  if (process.env.UI_CONSUMER_MODE === 'tailwind') {
    await expect(probe).toHaveCSS('background-color', 'rgb(191, 220, 255)');
    await expect(probe).toHaveCSS('color', 'rgb(16, 40, 24)');
  }
  await expect(
    dialog.getByRole('button', { name: 'Dismiss theme probe' }),
  ).toBeVisible();
  await dialog.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('library styles are isolated; unprefixed consumer utilities win in the documented cascade', async ({
  page,
}) => {
  await page.goto('/');
  if (process.env.UI_CONSUMER_MODE === 'tailwind') {
    const reference = await page
      .locator('#utility-reference')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    await expect(page.getByTestId('override-button')).toHaveCSS(
      'background-color',
      reference,
    );
  } else {
    const result = await page.evaluate(() => {
      const element = document.getElementById('host-button')!;
      const read = () => {
        const s = getComputedStyle(element);
        return [
          s.backgroundColor,
          s.borderRadius,
          s.fontFamily,
          s.fontSize,
          s.padding,
          s.border,
        ];
      };
      const styled = read();
      const sheets = Array.from(document.styleSheets);
      sheets.forEach((sheet) => (sheet.disabled = true));
      const native = read();
      sheets.forEach((sheet) => (sheet.disabled = false));
      return { styled, native };
    });
    expect(result.styled).toEqual(result.native);
  }
});

test('packed fields and overlays validate, inherit themes and retain their interactions', async ({
  page,
}) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Open project form' });
  await trigger.click();
  const dialog = page.getByRole('dialog', {
    name: 'Project form',
    exact: true,
  });
  const dialogTheme = page.locator('.u-dialog-theme').filter({ has: dialog });
  await expect(dialogTheme).toHaveAttribute('data-appearance', 'light');
  await expect(dialogTheme).toHaveAttribute('dir', 'rtl');
  const input = dialog.getByRole('textbox', { name: 'Project name' });
  await expect(input).toHaveCSS('border-radius', '16px');
  const priority = dialog.getByRole('combobox', { name: 'Priority' });
  await priority.click();
  await expect(page.locator('.u-select-theme')).toHaveAttribute('dir', 'rtl');
  await page.getByRole('option', { name: 'High', exact: true }).click();
  await expect(priority).toHaveText('High');
  await expect(priority).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('listbox')).not.toBeVisible();
  await dialog.getByRole('checkbox', { name: 'Notify members' }).uncheck();
  await expect(
    dialog.getByRole('checkbox', { name: 'Notify members' }),
  ).not.toBeChecked();
  await dialog.getByRole('radio', { name: 'Shared', exact: true }).check();
  await expect(
    dialog.getByRole('radio', { name: 'Shared', exact: true }),
  ).toBeChecked();
  await dialog.getByRole('button', { name: 'Validate project' }).click();
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAccessibleDescription(/Enter a project name/);
  await input.fill('Campus');
  await dialog.getByRole('textbox', { name: 'Notes' }).fill('Packed textarea');
  await expect(dialog.getByRole('textbox', { name: 'Notes' })).toHaveValue(
    'Packed textarea',
  );
  await expect(page.getByTestId('native-notes')).toHaveText('Packed textarea');
  await expect(dialog.getByRole('textbox', { name: 'Notes' })).toHaveClass(
    /fixture-filled/,
  );
  await dialog.getByRole('button', { name: 'Focus notes' }).click();
  await expect(dialog.getByRole('textbox', { name: 'Notes' })).toBeFocused();
  await dialog.getByRole('button', { name: 'Project details' }).click();
  const popover = page.getByRole('dialog', { name: 'Packed popover' });
  await expect(page.locator('.u-popover-theme')).toHaveAttribute('dir', 'rtl');
  await popover.getByRole('button', { name: 'Close details' }).click();
  await expect(
    dialog.getByRole('button', { name: 'Project details' }),
  ).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  const hint = page.getByRole('button', { name: 'Keyboard hint' });
  await hint.hover();
  await expect(page.getByRole('tooltip')).toHaveText('Packed tooltip');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).not.toBeVisible();
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { hydrationErrors: string[] }).hydrationErrors,
    ),
  ).toEqual([]);
});

test('packed adoption components inherit nested themes and keep calendar, search and toast behavior', async ({
  page,
}) => {
  await page.goto('/');
  const search = page.getByRole('combobox', { name: 'Group search' });
  await expect(search).toHaveAccessibleName('Group search');
  await expect(search).toHaveAccessibleDescription('Find a group by name.');
  const options = page.getByRole('button', {
    name: 'Показать группы',
    exact: true,
  });
  await expect(options).toHaveAccessibleName('Показать группы');
  await options.click();
  const openTrigger = page
    .getByRole('region', { name: 'Adoption components' })
    .locator('[data-slot="combobox-trigger"]');
  await expect(openTrigger).toHaveAttribute('aria-expanded', 'true');
  await expect(openTrigger).toHaveAttribute(
    'aria-controls',
    (await page.getByRole('listbox').getAttribute('id')) ?? '',
  );
  await search.press('Escape');
  const physical = page.getByRole('button', { name: 'Power', exact: true });
  await expect(physical).toHaveCSS('width', '144px');
  await expect(physical.locator('.u-physical-cap')).toHaveCSS(
    'color',
    'rgb(16, 40, 24)',
  );
  await physical.focus();
  await physical.press('Space');
  await expect(physical).toHaveAttribute('aria-pressed', 'true');
  await expect
    .poll(() =>
      physical
        .locator('.u-physical-indicator')
        .evaluate((el) => getComputedStyle(el, '::after').opacity),
    )
    .toBe('1');
  await search.fill('CS-10');
  await expect(page.locator('.u-combobox-theme')).toHaveAttribute(
    'data-appearance',
    'light',
  );
  await expect(page.locator('.u-combobox-theme')).toHaveAttribute('dir', 'rtl');
  await expect(search).toHaveCSS('border-radius', '16px');
  await page.getByRole('option', { name: 'CS-102', exact: true }).click();
  await expect(search).toHaveValue('CS-102');
  const trigger = page.getByRole('button', { name: /^Schedule date:/ });
  await trigger.click();
  const picker = page.getByRole('dialog', { name: 'Schedule date' });
  await expect(page.locator('.u-popover-theme')).toHaveAttribute(
    'data-appearance',
    'light',
  );
  const selectedDate = picker.locator('[aria-selected="true"] button');
  await selectedDate.hover();
  await expect(selectedDate).toHaveCSS(
    'background-color',
    'rgb(109, 229, 132)',
  );
  await expect(selectedDate).toHaveCSS('color', 'rgb(16, 40, 24)');
  await picker.getByRole('button', { name: 'Сегодня', exact: true }).click();
  await expect(picker).not.toBeVisible();
  await expect(trigger).toBeFocused();
  const mode = page.getByRole('radiogroup', { name: 'Schedule mode' });
  await mode.getByRole('radio', { name: 'On campus' }).check();
  await expect(mode.getByRole('radio', { name: 'On campus' })).toBeChecked();
  await page.getByRole('button', { name: 'Notify', exact: true }).click();
  await expect(page.locator('.u-toast-theme')).toHaveAttribute(
    'data-appearance',
    'light',
  );
  await expect(page.locator('.u-toast-theme')).toHaveAttribute('dir', 'rtl');
  await expect(
    page.getByText('Packed notification', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(
    page.getByText('Packed notification', { exact: true }),
  ).not.toBeVisible();
  for (let index = 0; index < 3; index++)
    await page.getByRole('button', { name: 'Notify', exact: true }).click();
  const front = page.locator('.u-toast').first();
  const back = page.locator('.u-toast').last();
  await expect(page.locator('.u-toast')).toHaveCount(3);
  await expect(back.locator('.u-toast-content')).toBeHidden();
  await expect
    .poll(
      async () =>
        (await back.boundingBox())!.width / (await front.boundingBox())!.width,
    )
    .toBeLessThan(0.9);
  await page.keyboard.press('F6');
  await expect(back.locator('.u-toast-content')).toBeVisible();
  await expect
    .poll(async () => {
      const rect = (await back.boundingBox())!;
      return rect.y + rect.height - (await front.boundingBox())!.y;
    })
    .toBeLessThan(0);
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { hydrationErrors: string[] }).hydrationErrors,
    ),
  ).toEqual([]);
});
