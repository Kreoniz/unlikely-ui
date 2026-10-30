import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('receipt issues only after preparing a real selectable export, and downloads its contents', async ({
  page,
}) => {
  await page.goto('/#devspace');
  const study = page.getByRole('region', {
    name: 'Receipt study',
    exact: true,
  });
  const receipt = study.getByRole('article', { name: 'Export receipt' });
  await expect(
    receipt.getByRole('heading', { name: 'Export ready' }),
  ).toHaveCount(0);
  await expect(study.getByRole('link', { name: 'Download .md' })).toHaveCount(
    0,
  );

  const prepare = study.getByRole('button', {
    name: 'Prepare export',
    exact: true,
  });
  await prepare.focus();
  await page.keyboard.press('Enter');
  await expect(
    receipt.getByRole('heading', { name: 'Export ready' }),
  ).toBeVisible();
  await expect(receipt).toContainText('3 notes');
  await expect(
    study.getByRole('button', { name: 'Prepare again' }),
  ).toBeFocused();

  const firstDownload = page.waitForEvent('download');
  await study.getByRole('link', { name: 'Download .md' }).click();
  const allNotes = await firstDownload;
  expect(allNotes.suggestedFilename()).toBe('studio-notes.md');
  const allText = await readFile((await allNotes.path())!, 'utf8');
  expect(allText).toContain('# Studio notes');
  expect(allText).toContain('## Launch checklist');
  expect(allText).toContain('## Type notes');
  expect(allText).toContain('## Release sketch');
  await expect(study.getByRole('status')).toHaveText(
    'Download requested: studio-notes.md.',
  );

  await study.getByRole('checkbox', { name: 'Type notes' }).uncheck();
  await expect(
    receipt.getByRole('heading', { name: 'Export ready' }),
  ).toHaveCount(0);
  await expect(study.getByRole('link', { name: 'Download .md' })).toHaveCount(
    0,
  );
  await study
    .getByRole('button', { name: 'Prepare export', exact: true })
    .click();
  await expect(receipt).toContainText('2 notes');
  const nextDownload = page.waitForEvent('download');
  await study.getByRole('link', { name: 'Download .md' }).click();
  const selectedText = await readFile(
    (await (await nextDownload).path())!,
    'utf8',
  );
  expect(selectedText).toContain('## Launch checklist');
  expect(selectedText).not.toContain('## Type notes');
  expect(selectedText).toContain('## Release sketch');

  await study.getByRole('checkbox', { name: 'Launch checklist' }).uncheck();
  await study.getByRole('checkbox', { name: 'Release sketch' }).uncheck();
  await expect(
    study.getByRole('button', { name: 'Prepare export', exact: true }),
  ).toBeDisabled();
});

test('receipt copies actual export contents and reports clipboard rejection truthfully', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#devspace');
  const study = page.getByRole('region', {
    name: 'Receipt study',
    exact: true,
  });
  await study
    .getByRole('button', { name: 'Prepare export', exact: true })
    .click();
  await study
    .getByRole('button', { name: 'Copy contents', exact: true })
    .click();
  await expect(study.getByRole('status')).toHaveText(
    'Export contents copied to the clipboard.',
  );
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    '## Launch checklist',
  );

  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, 'writeText', {
      configurable: true,
      value: async () => {
        throw new DOMException('Clipboard denied', 'NotAllowedError');
      },
    });
  });
  await study
    .getByRole('button', { name: 'Copy contents', exact: true })
    .click();
  await expect(study.getByRole('status')).toHaveText(
    'Could not copy to the clipboard. You can download the file.',
  );
  await expect(study.getByRole('link', { name: 'Download .md' })).toBeVisible();
});

test('receipt preparation failure leaves the slot empty and offers a retry', async ({
  page,
}) => {
  await page.goto('/#devspace');
  const study = page.getByRole('region', {
    name: 'Receipt study',
    exact: true,
  });
  await page.evaluate(() => {
    URL.createObjectURL = () => {
      throw new Error('Cannot allocate output');
    };
  });
  await study
    .getByRole('button', { name: 'Prepare export', exact: true })
    .click();
  await expect(study.getByRole('status')).toHaveText(
    'Could not prepare the export. Please try again.',
  );
  await expect(
    study.getByRole('heading', { name: 'Export ready' }),
  ).toHaveCount(0);
  await expect(study.getByRole('link', { name: 'Download .md' })).toHaveCount(
    0,
  );
  await expect(
    study.getByRole('button', { name: 'Prepare export', exact: true }),
  ).toBeEnabled();
});

test('split-flap provides one complete reading, bounded edits and LTR cells in narrow RTL', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#devspace');
  const study = page.getByRole('region', {
    name: 'Split-flap study',
    exact: true,
  });
  const readout = study.getByRole('status', { name: 'Completed notes' });
  await expect(readout).toMatchAriaSnapshot(
    '- status "Completed notes": "042"',
  );
  const add = study.getByRole('button', { name: 'Add completion' });
  await add.focus();
  await page.keyboard.press('Enter');
  await expect(readout).toMatchAriaSnapshot(
    '- status "Completed notes": "043"',
  );
  await expect(add).toBeFocused();
  await study.getByRole('button', { name: 'Undo one' }).click();
  await expect(readout).toMatchAriaSnapshot(
    '- status "Completed notes": "042"',
  );
  await page.getByRole('checkbox', { name: 'RTL layout', exact: true }).check();
  const digits = readout.locator('.signature-data-cell');
  const first = (await digits.nth(0).boundingBox())!;
  const second = (await digits.nth(1).boundingBox())!;
  expect(first.x).toBeLessThan(second.x);
  expect(await readout.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
    true,
  );
  expect(
    await readout.evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);

  const input = study.getByRole('spinbutton', { name: 'Completion count' });
  await input.fill('999');
  await expect(readout).toMatchAriaSnapshot(
    '- status "Completed notes": "999"',
  );
  await expect(add).toBeDisabled();
  await input.fill('0');
  await expect(study.getByRole('button', { name: 'Undo one' })).toBeDisabled();
  await input.fill('');
  await input.blur();
  await expect(input).toHaveValue('0');
});

test('counter editing preserves an empty draft, replaces the old value, and normalizes on blur', async ({
  page,
}) => {
  await page.goto('/#devspace?study=split-flap-study');
  const study = page.getByRole('region', {
    name: 'Split-flap study',
    exact: true,
  });
  const input = study.getByRole('spinbutton', { name: 'Completion count' });
  await input.fill('45');
  await input.press('ControlOrMeta+A');
  await input.press('Backspace');
  await expect(input).toHaveValue('');
  await input.press('9');
  await expect(input).toHaveValue('9');
  await expect(
    study.getByRole('status', { name: 'Completed notes' }),
  ).toMatchAriaSnapshot('- status "Completed notes": "009"');
  await input.fill('');
  await input.blur();
  await expect(input).toHaveValue('9');
  await input.fill('9999');
  await input.blur();
  await expect(input).toHaveValue('999');
  await study.getByRole('button', { name: 'Undo one', exact: true }).click();
  await expect(input).toHaveValue('998');
});
