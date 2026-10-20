import { test, expect } from '@playwright/test';

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
  await expect(page.locator('.u-dialog-theme')).toHaveAttribute(
    'data-appearance',
    'light',
  );
  await expect(page.locator('.u-dialog-theme')).toHaveAttribute('dir', 'rtl');
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
