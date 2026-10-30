import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Russian app language reaches the Dialog and nested Select portal', async ({
  page,
}) => {
  await page.goto('/#apps/desk?locale=ru&appearance=dark&review=off');
  await page.getByRole('button', { name: 'Новая задача', exact: true }).click();
  const dialog = page.getByRole('dialog', {
    name: 'Добавить задачу',
    exact: true,
  });
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
  await page.keyboard.press('Escape');
  expect(await page.locator('html').getAttribute('lang')).toBe('en');
});

test('maximum task titles wrap in live feedback and due labels remain available on phones', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/#apps/desk?locale=ru&appearance=dark&review=off');
  const queue = page.getByRole('region', { name: 'Список задач', exact: true });
  const todayRow = queue.getByRole('listitem').filter({
    has: page.getByRole('checkbox', {
      name: 'Отметить выполненной: Опубликовать список для чтения',
      exact: true,
    }),
  });
  await expect(todayRow.locator('.desk-task-project')).toBeVisible();
  await expect(todayRow.locator('.desk-task-project')).toContainText('Сегодня');
  await page.getByRole('button', { name: 'Новая задача', exact: true }).click();
  const dialog = page.getByRole('dialog', {
    name: 'Добавить задачу',
    exact: true,
  });
  const title = 'Ж'.repeat(160);
  await dialog
    .getByRole('textbox', { name: 'Название задачи', exact: true })
    .fill(title);
  await dialog
    .getByRole('button', { name: 'Добавить задачу', exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  const assertFits = async () =>
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  await assertFits();
  await queue
    .getByRole('checkbox', {
      name: `Отметить выполненной: ${title}`,
      exact: true,
    })
    .check();
  await assertFits();
  await queue
    .getByRole('checkbox', { name: `Вернуть в работу: ${title}`, exact: true })
    .uncheck();
  await assertFits();
  await expect(
    queue.getByRole('status').filter({ hasText: title }),
  ).toContainText(title);
});

for (const screen of ['desk', 'settings'] as const) {
  test(`${screen} app study reflows with long localized content and passes representative accessibility checks`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const width of [320, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const appearance of ['light', 'dark']) {
        for (const locale of ['en', 'ru']) {
          await page.goto(
            `/#apps/${screen}?appearance=${appearance}&locale=${locale}`,
          );
          await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
          await expect(page.getByRole('main')).toHaveCount(1);
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
          ).toBe(true);
          await expect(page.locator('.app-study')).toHaveAttribute(
            'lang',
            locale,
          );
          if (locale === 'en') {
            // Contrast is assessed after finite entry motion settles, not at a fade's intermediate opacity.
            await page.evaluate(async () => {
              await document.fonts.ready;
              await Promise.all(
                document
                  .getAnimations()
                  .filter(
                    (animation) =>
                      animation.effect?.getTiming().iterations !== Infinity,
                  )
                  .map((animation) => animation.finished.catch(() => {})),
              );
            });
            const { violations } = await new AxeBuilder({ page })
              .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
              .analyze();
            expect(violations).toEqual([]);
          }
        }
      }
    }
    expect(errors).toEqual([]);
  });
}

test('Margin filters, validates a new task, completes it and returns keyboard focus', async ({
  page,
}) => {
  await page.goto('/#apps/desk');
  const queue = page.getByRole('region', { name: 'Work queue' });
  const search = page.getByRole('searchbox', { name: 'Find a task' });
  await search.fill('no matching task');
  await expect(queue.getByText('Nothing matches this view.')).toBeVisible();
  await queue.getByRole('button', { name: 'Clear filters' }).focus();
  await page.keyboard.press('Enter');
  await expect(
    queue.getByRole('heading', { name: 'Work queue', exact: true }),
  ).toBeFocused();
  await expect(search).toHaveValue('');
  const trigger = page.getByRole('button', { name: 'New task', exact: true });
  await trigger.focus();
  await trigger.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Add a task' });
  const name = dialog.getByRole('textbox', { name: 'Task name' });
  await dialog.getByRole('button', { name: 'Add task', exact: true }).click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAccessibleDescription('Enter a task name.');
  await name.fill('Review the app study');
  await dialog.getByRole('button', { name: 'Add task', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  const task = queue.getByRole('checkbox', {
    name: 'Mark complete: Review the app study',
    exact: true,
  });
  await task.focus();
  await task.press('Space');
  await expect(
    queue.getByRole('checkbox', {
      name: 'Mark active: Review the app study',
      exact: true,
    }),
  ).toBeChecked();
  await queue.getByRole('radio', { name: 'Active', exact: true }).check();
  await expect(
    queue.getByText('Review the app study', { exact: true }),
  ).toHaveCount(0);
  await queue.getByRole('radio', { name: 'Done', exact: true }).check();
  await expect(
    queue.getByText('Review the app study', { exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'View app only' }).click();
  await expect(
    page.getByRole('navigation', { name: 'App studies', exact: true }),
  ).toHaveCount(0);
  await expect(
    queue.getByText('Review the app study', { exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Show review controls' }).click();
  await expect(
    queue.getByRole('radio', { name: 'Done', exact: true }),
  ).toBeChecked();
});

test('Dispatch validates, preserves a failed draft, retries and reports later unsaved edits', async ({
  page,
}) => {
  await page.goto('/#apps/settings');
  const form = page.getByRole('form', { name: 'Workspace preferences' });
  const name = form.getByRole('textbox', {
    name: 'Workspace name',
    exact: true,
  });
  const save = form.getByRole('button', { name: 'Save changes', exact: true });
  await name.fill('');
  await save.click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAccessibleDescription(/Enter a workspace name/);
  await name.fill('A calmer workspace');
  const day = form.getByRole('combobox', { name: 'Delivery day' });
  await day.click();
  await page.getByRole('option', { name: 'Monday', exact: true }).click();
  await expect(day).toContainText('Monday');
  await save.click();
  await expect(save).toHaveAttribute('aria-busy', 'true');
  await expect(name).toHaveAttribute('readonly');
  await expect(form.getByRole('alert')).toContainText(
    'Your draft is still here.',
  );
  await expect(name).toHaveValue('A calmer workspace');
  await form.getByRole('button', { name: 'Try again' }).click();
  await expect(form.getByRole('status')).toHaveText(
    'Workspace settings saved.',
  );
  await expect(save).toBeFocused();
  await name.fill('Another draft');
  await expect(form.getByRole('status')).toHaveText(
    'You have unsaved changes.',
  );
  await form.getByRole('button', { name: 'Discard changes' }).click();
  await expect(name).toHaveValue('A calmer workspace');
  await expect(form.getByRole('status')).toHaveText(
    'Last saved settings restored.',
  );
  await form
    .getByRole('textbox', { name: 'A little context' })
    .fill('A new unsaved description');
  await expect(form.getByRole('status')).toHaveText(
    'You have unsaved changes.',
  );
});

test('review states retain recovery focus and empty previews preserve the queue', async ({
  page,
}) => {
  for (const screen of ['desk', 'settings']) {
    await page.goto(`/#apps/${screen}?state=loading`);
    await expect(
      page.getByRole('main').getByRole('status').filter({ hasText: 'Loading' }),
    ).toBeVisible();
    await page
      .getByRole('combobox', { name: 'Content', exact: true })
      .selectOption('error');
    await expect(page.getByRole('main').getByRole('alert')).toBeVisible();
    await page
      .getByRole('main')
      .getByRole('button', { name: 'Try again' })
      .focus();
    await page.keyboard.press('Enter');
    await expect(
      page.getByRole('heading', {
        name: screen === 'desk' ? 'Work queue' : 'Workspace settings',
        exact: true,
      }),
    ).toBeFocused();
    await expect(
      page.getByRole('combobox', { name: 'Content', exact: true }),
    ).toHaveValue('ready');
  }
  await page.goto('/#apps/desk?state=empty');
  await page.getByRole('button', { name: 'Add a task', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Add a task' });
  await dialog
    .getByRole('textbox', { name: 'Task name' })
    .fill('The first small task');
  await dialog.getByRole('button', { name: 'Add task', exact: true }).click();
  await expect(
    page.getByRole('combobox', { name: 'Content', exact: true }),
  ).toHaveValue('ready');
  await expect(
    page.getByRole('region', { name: 'Work queue' }).getByRole('listitem'),
  ).toHaveCount(6);
  await expect(
    page.getByRole('button', { name: 'New task', exact: true }),
  ).toBeFocused();
  await page
    .getByRole('combobox', { name: 'Content', exact: true })
    .selectOption('empty');
  const emptyTrigger = page.getByRole('button', {
    name: 'Add a task',
    exact: true,
  });
  await emptyTrigger.focus();
  await emptyTrigger.press('Enter');
  await dialog
    .getByRole('textbox', { name: 'Task name' })
    .fill('Another small task');
  await dialog.getByRole('textbox', { name: 'Task name' }).press('Enter');
  await expect(
    page.getByRole('checkbox', {
      name: 'Mark complete: The first small task',
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Work queue' }).getByRole('listitem'),
  ).toHaveCount(7);
  await expect(
    page.getByRole('button', { name: 'New task', exact: true }),
  ).toBeFocused();
});

test('short phone project navigation exposes the filtered result and count scope', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/#apps/desk?appearance=dark&locale=ru&review=off');
  await page
    .getByRole('region', { name: 'Проекты', exact: true })
    .getByRole('button', { name: /Небольшие инструменты.*1 в работе/ })
    .click();
  const queue = page.getByRole('region', { name: 'Список задач', exact: true });
  await expect(
    queue
      .getByRole('status')
      .filter({ hasText: /Небольшие инструменты.*1 показано/ }),
  ).toBeVisible();
  await expect(
    queue.getByRole('checkbox', { name: /Проверить календарь на телефоне/ }),
  ).toBeInViewport({ ratio: 1 });
  await expect(queue).toContainText('Весь стол:');
  await queue.getByRole('radio', { name: 'Готово', exact: true }).check();
  await expect(
    queue.getByRole('status').filter({ hasText: /0 показано/ }),
  ).toBeVisible();
});

test('Dispatch reviews persisted values and never steals focus after a response', async ({
  page,
}) => {
  await page.goto('/#apps/settings');
  const form = page.getByRole('form', { name: 'Workspace preferences' });
  const name = form.getByRole('textbox', {
    name: 'Workspace name',
    exact: true,
  });
  const save = form.getByRole('button', { name: 'Save changes', exact: true });
  await name.fill('Dispatch Studio  ');
  await expect(save).toBeDisabled();
  await expect(form.getByRole('status')).toHaveText('All changes saved.');
  await name.fill('');
  await expect(
    form.getByRole('complementary', { name: 'Your changes' }),
  ).toContainText('Not entered');
  await name.fill('Focus stays where I put it');
  await save.click();
  const language = page.getByRole('combobox', {
    name: 'Language',
    exact: true,
  });
  await language.focus();
  await expect(form.getByRole('alert')).toBeVisible();
  await expect(language).toBeFocused();
  await form.getByRole('button', { name: 'Try again' }).click();
  await language.focus();
  await expect(form.getByRole('status')).toHaveText(
    'Workspace settings saved.',
  );
  await expect(language).toBeFocused();
});

test('shared press feedback and app motion respect reduced motion without delaying actions', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#apps/desk?review=off');
  const trigger = page.getByRole('button', { name: 'New task', exact: true });
  await trigger.scrollIntoViewIfNeeded();
  const rect = await trigger.boundingBox();
  if (!rect) throw new Error('New task action has no bounds');
  await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
  await page.mouse.down();
  await expect
    .poll(() =>
      trigger.evaluate(
        (element) => new DOMMatrix(getComputedStyle(element).transform).m42,
      ),
    )
    .toBeGreaterThan(0.8);
  await page.mouse.up();
  await expect(
    page.getByRole('dialog', { name: 'Add a task', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.desk-task').first()).toHaveCSS(
    'animation-name',
    'none',
  );
  await trigger.focus();
  await trigger.press('Enter');
  await expect(
    page.getByRole('dialog', { name: 'Add a task', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await page.goto('/#apps/settings?review=off');
  await expect(page.locator('.dispatch-layout')).toHaveCSS(
    'animation-name',
    'none',
  );
});

test('app study form stays usable with enlarged text and a short touch viewport', async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 568 },
    baseURL: process.env.UI_SHOWCASE_URL ?? 'http://127.0.0.1:5177',
  });
  const page = await context.newPage();
  await page.goto('/#apps/desk?appearance=dark&locale=ru');
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await page.getByRole('button', { name: 'Новая задача', exact: true }).tap();
  const dialog = page.getByRole('dialog', {
    name: 'Добавить задачу',
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole('textbox', { name: 'Название задачи' })
    .fill('Проверить длинное название задачи на узком экране');
  await dialog
    .getByRole('button', { name: 'Добавить задачу', exact: true })
    .tap();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByText('Проверить длинное название задачи на узком экране', {
      exact: true,
    }),
  ).toBeVisible();
  await context.close();
});
