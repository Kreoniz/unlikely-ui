import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const menuName = 'Open note actions';
const studyURL = '/#devspace?study=radial-menu-study';

async function select(menu: Locator, name: string) {
  // Each clipped wedge shares the popup rectangle. Activate its actual visible face.
  await menu
    .getByRole('menuitem', { name, exact: true })
    .locator('.radial-sector-content')
    .click();
}
async function fits(menu: Locator) {
  await expect(menu).toBeVisible();
  const b = (await menu.boundingBox())!;
  const v = menu.page().viewportSize()!;
  expect(b.x).toBeGreaterThanOrEqual(0);
  expect(b.y).toBeGreaterThanOrEqual(0);
  expect(b.x + b.width).toBeLessThanOrEqual(v.width + 1);
  expect(b.y + b.height).toBeLessThanOrEqual(v.height + 1);
}

test.beforeEach(async ({ page }) => {
  await page.goto(studyURL);
});

test('six real wedge targets surround the context point, highlight and duplicate the selected note', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const surface = page.locator('.radial-canvas');
  await surface.scrollIntoViewIfNeeded();
  const box = (await surface.boundingBox())!;
  await surface.click({ button: 'right', position: { x: 250, y: 140 } });
  const menu = page.getByRole('menu', { name: menuName, exact: true });
  await fits(menu);
  await expect(menu.getByRole('menuitem')).toHaveText([
    'Copy',
    'Duplicate',
    'Move',
    'Pin',
    'Delete',
    'More',
  ]);
  const fan = (await menu.boundingBox())!;
  expect(Math.abs(fan.x + fan.width / 2 - (box.x + 250))).toBeLessThanOrEqual(
    1,
  );
  expect(Math.abs(fan.y + fan.height / 2 - (box.y + 140))).toBeLessThanOrEqual(
    1,
  );
  const contents = await menu.locator('.radial-sector-content').all();
  for (let i = 0; i < contents.length; i++) {
    const content = contents[i]!;
    await content.hover();
    await expect(menu.getByRole('menuitem').nth(i)).toHaveAttribute(
      'data-highlighted',
      '',
    );
    // A 44px square centered on the sector's content stays within its real hit area.
    const c = (await content.boundingBox())!;
    for (const [dx, dy] of [
      [-21, -21],
      [21, -21],
      [-21, 21],
      [21, 21],
    ]) {
      const hit = await page.evaluate(
        ({ x, y }) =>
          document.elementFromPoint(x, y)?.closest('[role="menuitem"]')
            ?.textContent,
        { x: c.x + c.width / 2 + dx!, y: c.y + c.height / 2 + dy! },
      );
      expect(hit).toContain(
        ['Copy', 'Duplicate', 'Move', 'Pin', 'Delete', 'More'][i],
      );
    }
  }
  await select(menu, 'Duplicate');
  await expect(menu).not.toBeVisible();
  await expect(
    page.getByRole('group', { name: 'Workspace notes' }).getByRole('button'),
  ).toHaveCount(2);
  await page
    .getByRole('button', { name: 'Field notes copy', exact: true })
    .click();
  await expect(
    page.getByRole('article', { name: 'Selected note' }),
  ).toContainText('Field notes copy');
});

test('native menu keys, typeahead and focus return operate the same six actions', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: menuName, exact: true });
  const menu = page.getByRole('menu', { name: menuName, exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(
    menu.getByRole('menuitem', { name: 'Copy', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(
    menu.getByRole('menuitem', { name: 'Duplicate', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('p');
  await expect(
    menu.getByRole('menuitem', { name: 'Pin', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('article', { name: 'Selected note' }),
  ).toHaveAttribute('data-pinned', 'true');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Space');
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('copy writes actual note text, reports rejection, and Move becomes unavailable', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const trigger = page.getByRole('button', { name: menuName, exact: true });
  const menu = page.getByRole('menu', { name: menuName, exact: true });
  await trigger.click();
  await select(menu, 'Copy');
  await expect(page.locator('.radial-study-feedback')).toHaveText(
    'Note contents copied.',
  );
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'Morning light on the river.',
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, 'writeText', {
      configurable: true,
      value: async () => {
        throw new DOMException('Denied', 'NotAllowedError');
      },
    }),
  );
  await trigger.click();
  await select(menu, 'Copy');
  await expect(page.locator('.radial-study-feedback')).toContainText(
    'Copy failed.',
  );
  await trigger.click();
  await select(menu, 'Move');
  await expect(page.locator('.radial-document-meta')).toContainText('Studio');
  await trigger.click();
  const move = menu.getByRole('menuitem', { name: 'Move', exact: true });
  await expect(move).toHaveAttribute('aria-disabled', 'true');
  await move.locator('.radial-sector-content').click({ force: true });
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
});

test('Delete transfers focus to recovery, Undo restores the note, and More reveals actual details', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: menuName, exact: true });
  const menu = page.getByRole('menu', { name: menuName, exact: true });
  await trigger.click();
  await select(menu, 'Delete');
  const undo = page.getByRole('button', { name: 'Undo delete', exact: true });
  await expect(undo).toBeFocused();
  await expect(trigger).toBeDisabled();
  await undo.click();
  await expect(trigger).toBeEnabled();
  await trigger.click();
  await select(menu, 'More');
  await expect(page.locator('.radial-details')).toHaveAttribute('open', '');
  await expect(page.locator('.radial-details')).toContainText('words');
});

test('edge invocation stays in the viewport, and list preference retains the actions', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const surface = page.locator('.radial-canvas');
  await surface.scrollIntoViewIfNeeded();
  const box = (await surface.boundingBox())!;
  await surface.click({
    button: 'right',
    position: { x: box.width - 10, y: 10 },
  });
  const menu = page.getByRole('menu', { name: menuName, exact: true });
  await fits(menu);
  await page.keyboard.press('Escape');
  await page
    .getByRole('checkbox', { name: 'Use list layout', exact: true })
    .check();
  await page.getByRole('button', { name: menuName, exact: true }).click();
  await fits(menu);
  const rows = await menu.getByRole('menuitem').all();
  for (let i = 0; i < rows.length; i++) {
    const b = (await rows[i]!.boundingBox())!;
    expect(b.height).toBeGreaterThanOrEqual(44);
    if (i)
      expect(b.y).toBeGreaterThanOrEqual(
        (await rows[i - 1]!.boundingBox())!.y + 44,
      );
  }
  await menu.getByRole('menuitem', { name: 'Pin', exact: true }).click();
  await expect(page.locator('.radial-study-feedback')).toHaveText(
    'Note pinned.',
  );
});

test.describe('phone touch', () => {
  test.use({ viewport: { width: 320, height: 568 }, hasTouch: true });
  test('a tap opener and long press both expose six reachable sectors', async ({
    page,
  }) => {
    const trigger = page.getByRole('button', { name: menuName, exact: true });
    const menu = page.getByRole('menu', { name: menuName, exact: true });
    await trigger.tap();
    await fits(menu);
    await menu
      .getByRole('menuitem', { name: 'Duplicate', exact: true })
      .locator('.radial-sector-content')
      .tap();
    await expect(
      page.getByRole('group', { name: 'Workspace notes' }).getByRole('button'),
    ).toHaveCount(2);
    const canvas = page.locator('.radial-canvas');
    await canvas.scrollIntoViewIfNeeded();
    const b = (await canvas.boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ id: 1, x: b.x + b.width / 2, y: b.y + b.height / 2 }],
    });
    await expect(menu).toBeVisible();
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await fits(menu);
    await page.keyboard.press('Escape');
    await cdp.detach();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
});

for (const appearance of ['light', 'dark'])
  test(`${appearance} portal has scoped appearance, reduced motion and no scoped axe violations`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(
      (value) => localStorage.setItem('unlikely-ui:appearance', value),
      appearance,
    );
    await page.reload();
    await page.getByRole('button', { name: menuName, exact: true }).click();
    const menu = page.getByRole('menu', { name: menuName, exact: true });
    await expect(menu).toBeVisible();
    expect(
      await menu.evaluate((el) =>
        el.closest('[data-appearance]')?.getAttribute('data-appearance'),
      ),
    ).toBe(appearance);
    expect(
      (
        await new AxeBuilder({ page })
          .include('#radial-menu-study')
          .include('[role="menu"]')
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.emulateMedia({ forcedColors: 'active' });
    await page.keyboard.press('p');
    await page.keyboard.press('Enter');
    await expect(page.locator('.radial-study-feedback')).toHaveText(
      'Note pinned.',
    );
  });

test('immediate Escape after pointer opening dismisses consistently and preserves later keyboard use', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: menuName, exact: true });
  const menu = page.getByRole('menu', { name: menuName, exact: true });
  for (let attempt = 0; attempt < 8; attempt++) {
    await trigger.click();
    await page.keyboard.press('Escape');
    await expect(menu).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await page.keyboard.press('Enter');
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
