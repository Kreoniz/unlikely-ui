import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

const planePoint = async (plane: Locator, x: number, y: number) =>
  plane.evaluate(
    (el, point) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + el.clientLeft + el.clientWidth * point.x,
        y: rect.top + el.clientTop + el.clientHeight * point.y,
      };
    },
    { x, y },
  );

test.beforeEach(async ({ page }) => {
  await page.goto('/#devspace?study=xy-pad-study');
});

test('signed native axes edit CSS offsets and keep unequal coordinate order in RTL', async ({
  page,
}) => {
  const study = page.getByRole('region', { name: 'XY pad study', exact: true });
  const x = study.getByRole('slider', { name: 'X offset', exact: true });
  const y = study.getByRole('slider', { name: 'Y offset', exact: true });
  await expect(x).toHaveValue('18');
  await expect(y).toHaveValue('-12');
  await page.getByRole('checkbox', { name: 'RTL layout', exact: true }).check();
  await x.focus();
  await page.keyboard.press('ArrowRight');
  await expect(x).toHaveValue('19');
  await expect(x).toBeFocused();
  await y.focus();
  await page.keyboard.press('ArrowRight');
  await expect(y).toHaveValue('-11');
  const exactX = study.getByRole('spinbutton', {
    name: 'X offset exact value',
  });
  const exactY = study.getByRole('spinbutton', {
    name: 'Y offset exact value',
  });
  await exactX.fill('-27');
  await exactX.press('Tab');
  await exactY.fill('13');
  await exactY.press('Tab');
  await expect(study.getByTestId('xy-applied-offset')).toHaveText(
    'X -27 · Y +13',
  );
  await expect(
    study.getByRole('img', { name: /Cream square/ }),
  ).toHaveAccessibleName('Cream square with shadow offset X -27, Y +13 pixels');
  await expect(study.getByTestId('xy-applied-offset')).toHaveAttribute(
    'dir',
    'ltr',
  );
  const readouts = study.locator('.signature-xy-readout');
  expect((await readouts.nth(0).boundingBox())!.x).toBe(
    (await readouts.nth(1).boundingBox())!.x,
  );
  expect((await readouts.nth(0).boundingBox())!.y).toBeLessThan(
    (await readouts.nth(1).boundingBox())!.y,
  );
  const shadow = await study
    .locator('.signature-xy-shadow-card')
    .evaluate((el) => getComputedStyle(el).boxShadow);
  expect(shadow).toContain('-27px 13px');
  await exactX.fill('');
  await exactX.press('Tab');
  await expect(exactX).toHaveValue('-27');
  await exactY.fill('90');
  await exactY.press('Tab');
  await expect(exactY).toHaveValue('40');
  await study
    .getByRole('button', { name: 'Center shadow', exact: true })
    .click();
  await expect(study.getByTestId('xy-applied-offset')).toHaveText('X 0 · Y 0');
  await expect(x).toHaveValue('0');
  await expect(y).toHaveValue('0');
});

test('shadow previews during drag, commits on release, and restores after cancel, lost capture or external reset', async ({
  page,
}) => {
  const study = page.getByRole('region', { name: 'XY pad study', exact: true });
  const applied = study.getByTestId('xy-applied-offset');
  const preview = study.getByRole('img', { name: /Cream square/ });
  const plane = study.getByTestId('xy-plane');
  await plane.scrollIntoViewIfNeeded();
  let point = await planePoint(plane, 0.75, 0.25);
  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await expect(preview).toHaveAccessibleName(
    'Cream square with shadow offset X +20, Y -20 pixels',
  );
  await expect(applied).toHaveText('X +18 · Y -12');
  point = await planePoint(plane, 0.1, 0.8);
  await page.mouse.move(point.x, point.y);
  await expect(preview).toHaveAccessibleName(
    'Cream square with shadow offset X -32, Y +24 pixels',
  );
  await plane.dispatchEvent('pointercancel', {
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
  });
  await page.mouse.up();
  await expect(preview).toHaveAccessibleName(
    'Cream square with shadow offset X +18, Y -12 pixels',
  );
  await expect(applied).toHaveText('X +18 · Y -12');
  point = await planePoint(plane, 0.25, 0.75);
  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await expect(preview).toHaveAccessibleName(
    'Cream square with shadow offset X -20, Y +20 pixels',
  );
  await plane.evaluate((el) => el.releasePointerCapture(1));
  // Browsers dispatch lostpointercapture on the next pointer event.
  await page.mouse.move(point.x + 1, point.y + 1);
  await page.mouse.up();
  await expect(applied).toHaveText('X +18 · Y -12');
  await expect(preview).toHaveAccessibleName(
    'Cream square with shadow offset X +18, Y -12 pixels',
  );
  point = await planePoint(plane, 0.75, 0.25);
  await page.mouse.click(point.x, point.y);
  await expect(applied).toHaveText('X +20 · Y -20');
  point = await planePoint(plane, 0.1, 0.8);
  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await study
    .getByRole('button', { name: 'Center shadow' })
    .evaluate((el) => (el as HTMLButtonElement).click());
  await expect(preview).toHaveAccessibleName(
    'Cream square with shadow offset X 0, Y 0 pixels',
  );
  await page.mouse.move(point.x + 2, point.y + 2);
  await page.mouse.up();
  await expect(applied).toHaveText('X 0 · Y 0');
});

test('read-only and disabled changes cancel a gesture and retain readable applied offsets', async ({
  page,
}) => {
  const study = page.getByRole('region', { name: 'XY pad study', exact: true });
  const plane = study.getByTestId('xy-plane');
  const applied = study.getByTestId('xy-applied-offset');
  const preview = study.getByRole('img', { name: /Cream square/ });
  for (const state of ['Read-only offsets', 'Disable offsets']) {
    await plane.scrollIntoViewIfNeeded();
    const point = await planePoint(plane, 0.75, 0.75);
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    await expect(preview).toHaveAccessibleName(
      'Cream square with shadow offset X +20, Y +20 pixels',
    );
    const toggle = study.getByRole('checkbox', { name: state, exact: true });
    await toggle.evaluate((el) => (el as HTMLInputElement).click());
    await page.mouse.up();
    await expect(applied).toHaveText('X +18 · Y -12');
    await expect(preview).toHaveAccessibleName(
      'Cream square with shadow offset X +18, Y -12 pixels',
    );
    await expect(
      study.getByRole('slider', { name: 'X offset', exact: true }),
    ).toBeDisabled();
    const exact = study.getByRole('spinbutton', {
      name: 'X offset exact value',
    });
    if (state === 'Read-only offsets')
      await expect(exact).toHaveAttribute('readonly');
    else await expect(exact).toBeDisabled();
    expect(await plane.evaluate((el) => getComputedStyle(el).touchAction)).toBe(
      'auto',
    );
    await plane.click();
    await expect(applied).toHaveText('X +18 · Y -12');
    await toggle.uncheck();
  }
});

test('touch edits both axes without scrolling; inactive surfaces permit native page scrolling', async ({
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
        '/#devspace?study=xy-pad-study',
    );
    const study = page.getByRole('region', {
      name: 'XY pad study',
      exact: true,
    });
    const plane = study.getByTestId('xy-plane');
    const cdp = await context.newCDPSession(page);
    await plane.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    const start = await page.evaluate(() => scrollY);
    const from = await planePoint(plane, 0.5, 0.5);
    const to = await planePoint(plane, 0.75, 0.25);
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ id: 1, ...from }],
    });
    for (let i = 1; i <= 8; i++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [
          {
            id: 1,
            x: from.x + ((to.x - from.x) * i) / 8,
            y: from.y + ((to.y - from.y) * i) / 8,
          },
        ],
      });
      await page.evaluate(() => new Promise(requestAnimationFrame));
    }
    await expect(
      study.getByRole('img', { name: /Cream square/ }),
    ).toHaveAccessibleName(
      'Cream square with shadow offset X +20, Y -20 pixels',
    );
    await expect(study.getByTestId('xy-applied-offset')).toHaveText(
      'X +18 · Y -12',
    );
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
    await expect(study.getByTestId('xy-applied-offset')).toHaveText(
      'X +20 · Y -20',
    );
    expect(await page.evaluate(() => scrollY)).toBeCloseTo(start, 0);
    for (const state of ['Read-only offsets', 'Disable offsets']) {
      const toggle = study.getByRole('checkbox', { name: state, exact: true });
      await toggle.check();
      await plane.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      const before = await page.evaluate(() => scrollY);
      const from = await planePoint(plane, 0.5, 0.85);
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ id: 1, ...from }],
      });
      for (let i = 1; i <= 12; i++) {
        await cdp.send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: [{ id: 1, x: from.x, y: from.y - i * 10 }],
        });
        await page.evaluate(() => new Promise(requestAnimationFrame));
      }
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: [],
      });
      await expect
        .poll(() => page.evaluate(() => scrollY))
        .toBeGreaterThan(before + 25);
      await expect(study.getByTestId('xy-applied-offset')).toHaveText(
        'X +20 · Y -20',
      );
      await toggle.uncheck();
    }
    await cdp.detach();
  } finally {
    await context.close();
  }
});

test('the material stays stable across appearances and the signed surface reflows without overflow', async ({
  page,
}) => {
  const study = page.getByRole('region', { name: 'XY pad study', exact: true });
  const plane = study.getByTestId('xy-plane');
  const material = await plane.evaluate(
    (el) => getComputedStyle(el).backgroundColor,
  );
  await page.getByRole('button', { name: 'Switch to dark appearance' }).click();
  expect(
    await plane.evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe(material);
  for (const width of [900, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await study.evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBeTruthy();
    const box = (await plane.boundingBox())!;
    expect(box.width).toBeCloseTo(box.height, 0);
  }
  const results = await new AxeBuilder({ page })
    .include('#xy-pad-study')
    .analyze();
  expect(results.violations).toEqual([]);
  // Axe's contrast sampling does not model this emulated system palette.
  // Check its regular appearance above, then exercise the forced-color UI.
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  const center = study.getByRole('button', { name: 'Center shadow' });
  await expect(center).toBeVisible();
  await center.focus();
  await page.keyboard.press('Enter');
  await expect(study.getByTestId('xy-applied-offset')).toHaveText('X 0 · Y 0');
  await expect(center).toBeFocused();
});

test('forced colors preserves a visible offset silhouette that follows the applied coordinates', async ({
  page,
}) => {
  const study = page.getByRole('region', { name: 'XY pad study', exact: true });
  await study
    .getByRole('spinbutton', { name: 'X offset exact value' })
    .fill('-40');
  await study
    .getByRole('spinbutton', { name: 'X offset exact value' })
    .press('Tab');
  await study
    .getByRole('spinbutton', { name: 'Y offset exact value' })
    .fill('-32');
  await study
    .getByRole('spinbutton', { name: 'Y offset exact value' })
    .press('Tab');
  await page.emulateMedia({ forcedColors: 'active' });
  const silhouette = () =>
    study.locator('.signature-xy-shadow-stage').evaluate((el) => {
      const style = getComputedStyle(el, '::before'),
        matrix = new DOMMatrix(style.transform);
      return {
        content: style.content,
        x:
          matrix.m41 +
          (parseFloat(style.width) +
            (style.boxSizing === 'border-box'
              ? 0
              : parseFloat(style.borderLeftWidth) +
                parseFloat(style.borderRightWidth))) /
            2,
        y:
          matrix.m42 +
          (parseFloat(style.height) +
            (style.boxSizing === 'border-box'
              ? 0
              : parseFloat(style.borderTopWidth) +
                parseFloat(style.borderBottomWidth))) /
            2,
        background: style.backgroundColor,
        cardBackground: getComputedStyle(
          el.querySelector('.signature-xy-shadow-card')!,
        ).backgroundColor,
      };
    });
  let shadow = await silhouette();
  expect(shadow.content).not.toBe('none');
  expect(shadow.x).toBeCloseTo(-40, 0);
  expect(shadow.y).toBeCloseTo(-32, 0);
  expect(shadow.background).not.toBe(shadow.cardBackground);
  await study.getByRole('button', { name: 'Center shadow' }).click();
  shadow = await silhouette();
  expect(shadow.x).toBeCloseTo(0, 0);
  expect(shadow.y).toBeCloseTo(0, 0);
});
