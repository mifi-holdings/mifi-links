import { test, expect } from '@playwright/test';

test('homepage has title and main content', async ({ page }) => {
    await page.goto('/');

    // Title and hero (variant-agnostic)
    await expect(page).toHaveTitle(/mifi\.(dev|bio)/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('mifi');

    // Key landmarks: header, main, footer
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();

    // Skip link targets main content (a11y)
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveAttribute('href', '#main-content');
    await expect(page.locator('main#main-content')).toBeVisible();

    // At least one link (both variants have link sections)
    const linkCount = await page.getByRole('link').count();
    expect(linkCount).toBeGreaterThan(0);
});
