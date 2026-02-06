import { test, expect } from '@playwright/test';

test('homepage has title and main content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/mifi\.dev/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('mifi.dev');
    await expect(page.getByRole('main')).toBeVisible();
});
