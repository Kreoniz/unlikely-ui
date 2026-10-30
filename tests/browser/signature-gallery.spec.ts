import { expect, test } from '@playwright/test';

for (const study of [
  {
    name: 'Devspace',
    chunk: 'signature',
    source: 'signature',
    route: 'devspace',
  },
  {
    name: 'App studies',
    chunk: 'app-studies',
    source: 'app-studies',
    route: 'apps/desk',
  },
]) {
  test(`${study.name} retains recovery navigation after a failed study load`, async ({
    page,
  }) => {
    await page.goto('/#overview');
    const chunk = new RegExp(
      `/(?:assets/${study.chunk}-[^/]+\\.js|(?:dev/)?experiments/${study.source}/index\\.tsx)(?:\\?|$)`,
    );
    let rejected = 0;
    await page.route(chunk, (route) => {
      rejected++;
      return route.abort('failed');
    });
    await page
      .getByRole('link', { name: study.name, exact: true })
      .first()
      .click();
    await expect(
      page
        .getByRole('alert')
        .getByRole('heading', { name: 'Study unavailable' }),
    ).toBeVisible();
    expect(rejected).toBeGreaterThan(0);
    await page
      .getByRole('link', { name: 'Back to overview', exact: true })
      .click();
    await expect(
      page.getByRole('heading', { name: 'Component workspace' }),
    ).toBeVisible();
    // A rejected React.lazy import stays rejected until the document reloads.
    await page.goto('/#' + study.route);
    await expect(
      page.getByRole('button', { name: 'Reload page', exact: true }),
    ).toBeVisible();
    await page.unroute(chunk);
    await page
      .getByRole('button', { name: 'Reload page', exact: true })
      .click();
    if (study.route === 'devspace') {
      await expect(
        page.getByRole('region', { name: 'XY pad study', exact: true }),
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole('button', { name: 'New task', exact: true }),
      ).toBeVisible();
    }
  });
}

test('reselecting a signature link restores its heading and preserves scene edits', async ({
  page,
}) => {
  await page.goto('/#devspace');
  const nav = page.getByRole('navigation', { name: 'Signature experiments' });
  const receipt = page.getByRole('region', {
    name: 'Receipt study',
    exact: true,
  });
  await receipt
    .getByRole('button', { name: 'Prepare export', exact: true })
    .click();
  const link = nav.getByRole('link', { name: 'XY pad', exact: true });
  const heading = page.getByRole('heading', { name: 'XY pad', exact: true });
  await link.click();
  await expect(heading).toBeFocused();
  await link.click();
  await expect(heading).toBeFocused();
  expect((await heading.boundingBox())!.y).toBeLessThan(200);
  await nav.getByRole('link', { name: 'Receipt', exact: true }).click();
  await expect(
    receipt.getByRole('article', { name: 'Export receipt' }),
  ).toContainText('Export ready');
});
