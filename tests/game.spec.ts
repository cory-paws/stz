import { test, expect } from '@playwright/test';

test.describe('Game E2E Tests', () => {
  test('Happy Path: Navigate from tent to hill, meet farmer', async ({ page }) => {
    await page.goto('/');

    // Check that we start at index (An intense tent)
    await expect(page.getByRole('heading', { name: 'An intense tent' })).toBeVisible();
    await page.getByText('Dismantle your shelter and face the valley').click();

    // Now at hill
    await expect(page.getByRole('heading', { name: 'The Hill' })).toBeVisible();
    await page.getByText('Investigate the frantic farmer in the fields').click();

    // Now at farmer
    await expect(page.getByRole('heading', { name: 'Meet the farmer' })).toBeVisible();
    
    // We don't have the cattleprod yet, so we can pick it up
    await page.getByText('Claim the abandoned cattle prod leaning against the fence').click();

    // Now at prod (pickup screen)
    await expect(page.getByRole('heading', { name: 'You have picked up the cattle prod' })).toBeVisible();
    await page.getByText('Ok, lets go back').click();

    // Wait for inventory to update, then verify it exists by checking for cattleprod
    await expect(page.getByText('cattleprod', { exact: true })).toBeVisible();
  });

  test('Death Path: Die by eating chocolate cake', async ({ page }) => {
    await page.goto('/');

    // Start at tent
    await expect(page.getByRole('heading', { name: 'An intense tent' })).toBeVisible();
    // Choose to eat the cake
    await page.getByText('Consume the last of the chocolate cake').click();
    
    // Verify death state
    await expect(page.getByRole('heading', { name: 'OH NO' })).toBeVisible();

    // Restart game
    await page.getByText('Go back to the beginning').click();
    await expect(page.getByRole('heading', { name: 'An intense tent' })).toBeVisible();
  });
});
