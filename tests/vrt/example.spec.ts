import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage screenshot', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot and compare with baseline
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('editor interface screenshot', async ({ page }) => {
    // Navigate to the main editor
    await page.goto('http://localhost:3000');
    
    // Wait for the editor to fully load
    await page.waitForLoadState('networkidle');
    
    // Wait for any animations to complete
    await page.waitForTimeout(2000);
    
    // Take a screenshot of the editor interface
    await expect(page).toHaveScreenshot('editor-interface.png');
  });
});