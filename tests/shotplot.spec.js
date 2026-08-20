const { test, expect } = require('@playwright/test');
const { readFile } = require('node:fs/promises');
const { argosScreenshot } = require('@argos-ci/playwright');

test.use({
  viewport: {
    width: 1920,
    height: 1080,
  },
});

const captureConsoleErrors = (page) => {
  const errors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  return errors;
};

const clickRink = async (page, xRatio, yRatio) => {
  const rink = page.locator('#rink svg');
  const box = await rink.boundingBox();

  if (!box) {
    throw new Error('Rink SVG did not render.');
  }

  await rink.click({
    position: {
      x: Math.round(box.width * xRatio),
      y: Math.round(box.height * yRatio),
    },
  });
};

const dataRows = (page) => page.locator('#coord-table .tabulator-row[id^="row-"]');
const paginationButton = (page, label) => page.locator('#coord-table').getByRole('button', { name: label });

const getRowValues = async (page, rowIndex = 0) => {
  const row = dataRows(page).nth(rowIndex);
  const cells = row.locator('.tabulator-cell');
  const values = await cells.evaluateAll((nodes) => nodes.map((node) => node.textContent.trim()));

  return {
    shot: Number(values[0]),
    x: Number(values[1]),
    y: Number(values[2]),
  };
};

test('loads the rink UI with no startup errors', async ({ page }) => {
  const consoleErrors = captureConsoleErrors(page);

  await page.goto('/');

  await expect(page).toHaveTitle('shotplot');
  await expect(page.locator('#rink svg')).toBeVisible();
  await expect(page.locator('#rink-selector')).toHaveValue('NA');
  await expect(page.locator('#unit-selector')).toHaveValue('in');
  await expect(page.locator('.alert-danger')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Export to CSV' })).toBeVisible();
  await expect(dataRows(page)).toHaveCount(0);
  await argosScreenshot(page, 'home-empty-state');
  expect(consoleErrors).toEqual([]);
});

test('plots shots, keeps newest shots first, and converts units consistently', async ({ page }) => {
  const consoleErrors = captureConsoleErrors(page);

  await page.goto('/');
  await clickRink(page, 0.65, 0.45);
  await clickRink(page, 0.58, 0.62);

  await expect(page.locator('#rink svg circle.shot')).toHaveCount(2);
  await expect(dataRows(page)).toHaveCount(2);

  const newestShot = await getRowValues(page, 0);
  const oldestShot = await getRowValues(page, 1);

  expect(newestShot.shot).toBe(2);
  expect(oldestShot.shot).toBe(1);

  await page.selectOption('#unit-selector', 'ft');
  const newestFeet = await getRowValues(page, 0);
  expect(newestFeet.shot).toBe(2);
  expect(newestFeet.x).toBe(Math.round(newestShot.x / 12));
  expect(newestFeet.y).toBe(Math.round(newestShot.y / 12));

  await page.selectOption('#unit-selector', 'cm');
  const newestCentimeters = await getRowValues(page, 0);
  expect(newestCentimeters.shot).toBe(2);
  expect(Math.abs(newestCentimeters.x - Math.round(newestShot.x * 2.54))).toBeLessThanOrEqual(1);
  expect(Math.abs(newestCentimeters.y - Math.round(newestShot.y * 2.54))).toBeLessThanOrEqual(1);

  await argosScreenshot(page, 'north-american-two-shots-centimeters');
  expect(consoleErrors).toEqual([]);
});

test('switching rink clears plotted shots and resets the default unit', async ({ page }) => {
  const consoleErrors = captureConsoleErrors(page);

  await page.goto('/');
  await clickRink(page, 0.64, 0.44);
  await expect(dataRows(page)).toHaveCount(1);

  await page.selectOption('#unit-selector', 'ft');
  await expect(page.locator('#unit-selector')).toHaveValue('ft');

  await page.selectOption('#rink-selector', 'IIHF');
  await expect(page.locator('#rink-selector')).toHaveValue('IIHF');
  await expect(page.locator('#unit-selector')).toHaveValue('cm');
  await expect(page.locator('#rink svg circle.shot')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Export to CSV' })).toBeVisible();
  await expect(dataRows(page)).toHaveCount(0);

  await page.selectOption('#rink-selector', 'NA');
  await expect(page.locator('#rink-selector')).toHaveValue('NA');
  await expect(page.locator('#unit-selector')).toHaveValue('in');
  await expect(page.getByRole('button', { name: 'Export to CSV' })).toBeVisible();
  await expect(dataRows(page)).toHaveCount(0);

  await argosScreenshot(page, 'rink-reset-after-switching');
  expect(consoleErrors).toEqual([]);
});

test('exports the plotted coordinates as CSV', async ({ page }) => {
  const consoleErrors = captureConsoleErrors(page);

  await page.goto('/');
  await clickRink(page, 0.65, 0.45);
  await clickRink(page, 0.58, 0.62);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export to CSV' }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  const csv = await readFile(downloadPath, 'utf8');

  const rows = csv.trim().split(/\r?\n/);
  expect(rows[0]).toBe('"Shot","X","Y"');
  expect(rows).toHaveLength(3);
  expect(rows[1].startsWith('"2",')).toBe(true);
  expect(rows[2].startsWith('"1",')).toBe(true);

  expect(consoleErrors).toEqual([]);
});

test('records shots as the ice is clicked across rink and unit changes', async ({ page }) => {
  const consoleErrors = captureConsoleErrors(page);

  await page.goto('/');
  await clickRink(page, 0.68, 0.48);
  await expect(page.locator('#rink svg circle.shot')).toHaveCount(1);
  await expect(dataRows(page)).toHaveCount(1);
  await expect(page.locator('#coord-table #row-1')).toContainText('1');

  await clickRink(page, 0.61, 0.58);
  await expect(page.locator('#rink svg circle.shot')).toHaveCount(2);
  await expect(dataRows(page)).toHaveCount(2);
  await expect(page.locator('#coord-table #row-2')).toContainText('2');

  await page.getByLabel('Rink Size').selectOption('IIHF');
  await expect(page.locator('#unit-selector')).toHaveValue('cm');
  await expect(page.locator('#rink svg circle.shot')).toHaveCount(0);
  await expect(dataRows(page)).toHaveCount(0);

  await clickRink(page, 0.72, 0.42);
  await expect(page.locator('#rink svg circle.shot')).toHaveCount(1);
  await expect(dataRows(page)).toHaveCount(1);

  await page.getByLabel('Units').selectOption('in');
  await expect(page.locator('#unit-selector')).toHaveValue('in');
  await expect(dataRows(page)).toHaveCount(1);

  await page.getByLabel('Units').selectOption('ft');
  await expect(page.locator('#unit-selector')).toHaveValue('ft');
  await expect(dataRows(page)).toHaveCount(1);

  await page.goto('/');
  await expect(page.locator('#rink-selector')).toHaveValue('NA');
  await expect(page.locator('#rink svg circle.shot')).toHaveCount(0);
  await expect(dataRows(page)).toHaveCount(0);

  expect(consoleErrors).toEqual([]);
});

test('hovering shots and rows keeps table highlighting and pagination working', async ({ page }) => {
  const consoleErrors = captureConsoleErrors(page);
  const shotPositions = [
    [0.56, 0.24],
    [0.60, 0.28],
    [0.64, 0.32],
    [0.68, 0.36],
    [0.72, 0.40],
    [0.56, 0.60],
    [0.60, 0.64],
    [0.64, 0.68],
    [0.68, 0.72],
    [0.72, 0.76],
    [0.52, 0.48],
    [0.76, 0.52],
  ];

  await page.goto('/');

  for (const [xRatio, yRatio] of shotPositions) {
    await clickRink(page, xRatio, yRatio);
  }

  await expect(page.locator('#rink svg circle.shot')).toHaveCount(12);
  await expect(dataRows(page)).toHaveCount(10);
  await expect(page.locator('#coord-table #row-12')).toBeVisible();
  await expect(page.locator('#coord-table #row-3')).toBeVisible();
  await expect(paginationButton(page, 'Next')).toBeEnabled();

  const shot12 = page.locator('#shot-12');
  const shot11 = page.locator('#shot-11');
  const row12 = page.locator('#row-12');

  await shot12.hover();
  await expect(row12).toHaveClass(/emphasized-row/);
  await expect(shot11).toHaveClass(/faded/);
  await expect(shot12).not.toHaveClass(/faded/);

  await shot11.hover();
  await expect(row12).not.toHaveClass(/emphasized-row/);
  await expect(shot12).toHaveClass(/faded/);
  await expect(shot11).not.toHaveClass(/faded/);

  await row12.hover();
  await expect(row12).toHaveClass(/emphasized-row/);
  await expect(shot11).toHaveClass(/faded/);
  await expect(shot12).not.toHaveClass(/faded/);
  await expect(shot12).toHaveAttribute('r', '45');
  await argosScreenshot(page, 'hover-linked-shot-and-row');

  await paginationButton(page, 'Next').click();
  await expect(dataRows(page)).toHaveCount(2);
  await expect(page.locator('#coord-table #row-2')).toBeVisible();
  await expect(page.locator('#coord-table #row-1')).toBeVisible();
  await expect(paginationButton(page, 'Prev')).toBeEnabled();
  await argosScreenshot(page, 'pagination-second-page');

  await paginationButton(page, 'Prev').click();
  await expect(dataRows(page)).toHaveCount(10);
  await expect(page.locator('#coord-table #row-12')).toBeVisible();

  expect(consoleErrors).toEqual([]);
});
