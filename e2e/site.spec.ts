import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home is usable, quiet in the console, and accessible', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  await page.goto('/');
  await expect(page).toHaveTitle(/Secret Exposure Path/);
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('img', { name: /amber source prism/ })).toHaveJSProperty('complete', true);

  await page.getByRole('button', { name: 'Trace paths' }).click();
  await expect(page.getByText('1 exposed path')).toBeVisible();
  await expect(page.locator('#trace-result')).not.toContainText('demo-river-9347');

  await page.getByRole('button', { name: 'Load clear sample' }).click();
  await expect(page.getByText('Clear path')).toBeVisible();

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter(violation => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('first screen names its audience and opens a completed demo in one click', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Trace secrets before they reach logs.');
  await expect(page.getByText(/For developers and CI teams/)).toBeVisible();
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('1 exposed path')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start for real' })).toBeVisible();
});

test('demo resets in memory and is keyboard operable', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.locator('h1')).toHaveCount(1);
  await page.locator('#source-input').fill('DEPLOY_SECRET=changed-demo-value-9821');
  await page.locator('#sink-input').fill('clear output');
  await page.getByRole('button', { name: 'Trace paths' }).click();
  await expect(page.getByText('Clear path')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByText('1 exposed path')).toBeVisible();
  await page.reload();
  await expect(page.locator('#source-input')).not.toHaveValue(/changed-demo-value/);
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter(violation => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
});

test('keyboard reaches the main action and demo', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Skip to content' }).focus();
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.getByRole('link', { name: 'Skip to content' }).press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.locator('#demo').scrollIntoViewIfNeeded();
  await page.locator('#source-input').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#sink-input')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Trace paths' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText('1 exposed path')).toBeVisible();
});

test('document routes focus and announce their page heading', async ({ page }) => {
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404/']) {
    await page.goto(path);
    await expect(page.locator('h1')).toBeFocused();
    await expect(page.locator('#route-announcement')).not.toBeEmpty();
  }
});

test('every route has the complete shared footer', async ({ page }) => {
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404/']) {
    await page.goto(path);
    const footer = page.locator('footer');
    await expect(footer).toContainText('Trace declared credential paths locally. v0.1.0');
    await expect(footer.getByRole('link', { name: 'Privacy' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Terms' })).toBeVisible();
    await expect(footer.getByRole('link', { name: /Built by Param Factory/ })).toBeVisible();
  }
});

test('mobile layout does not overflow', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.locator('#demo').scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Trace paths' })).toBeVisible();
});

test('visible controls meet the 44px touch target baseline', async ({ page }) => {
  for (const path of ['/', '/demo/', '/privacy/']) {
    await page.goto(path);
    const undersized = await page.locator('a, button, textarea').evaluateAll(elements => elements
      .filter(element => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
      })
      .map(element => {
        const rect = element.getBoundingClientRect();
        return { label: element.getAttribute('aria-label') ?? element.textContent?.trim().slice(0, 40), width: rect.width, height: rect.height };
      })
      .filter(target => target.width < 44 || target.height < 44));
    expect(undersized).toEqual([]);
  }
});

test('content remains available at 200 percent text size', async ({ page }) => {
  for (const path of ['/', '/demo/', '/privacy/']) {
    await page.goto(path);
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
});

for (const path of ['/privacy/', '/terms/', '/404/']) {
  test(`${path} has a single main heading and no serious accessibility issues`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations.filter(violation => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  });
}

test('home and demo expose complete sharing and canonical metadata', async ({ page }) => {
  for (const path of ['/', '/demo/']) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-card\.webp$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  }
});
