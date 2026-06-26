/**
 * @fileoverview E2E Tests for CryptoMsg
 * @version 5.0.0
 */

import { test, expect } from '@playwright/test';

test.describe('CryptoMsg E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Basic UI', () => {
    test('should load the app', async ({ page }) => {
      await expect(page.locator('.app-title')).toBeVisible();
      await expect(page.locator('.app-title')).toContainText('CryptoMsg');
    });

    test('should have both tabs', async ({ page }) => {
      await expect(page.locator('#tabEnc')).toBeVisible();
      await expect(page.locator('#tabDec')).toBeVisible();
    });

    test('should have encrypt tab active by default', async ({ page }) => {
      await expect(page.locator('#tabEnc')).toHaveClass(/active/);
    });
  });

  test.describe('Encryption Flow', () => {
    test('should encrypt text with password', async ({ page }) => {
      // Fill in the form
      await page.fill('#inputText', 'Hello World Test Message');
      await page.fill('#password', 'TestPassword123!');

      // Click encrypt
      await page.click('#actionBtn');

      // Wait for result
      await expect(page.locator('#resultArea')).toBeVisible();
      await expect(page.locator('.result-text')).not.toBeEmpty();
    });

    test('should show error for empty fields', async ({ page }) => {
      // Try to submit without filling
      await page.click('#actionBtn');

      // Should show alert
      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('لطفاً');
        await dialog.dismiss();
      });
    });

    test('should switch to decrypt mode', async ({ page }) => {
      await page.click('#tabDec');

      await expect(page.locator('#tabDec')).toHaveClass(/active/);
      await expect(page.locator('#encSettings')).toBeHidden();
    });

    test('should select encoding method', async ({ page }) => {
      await page.selectOption('#encodingMode', 'farsiChars');

      await expect(page.locator('#encodingMode')).toHaveValue('farsiChars');
    });
  });

  test.describe('Password Generation', () => {
    test('should generate password', async ({ page }) => {
      await page.click('.gen-pass-btn');

      const password = await page.inputValue('#password');
      expect(password.length).toBeGreaterThan(0);
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/[a-z]/);
      expect(password).toMatch(/[0-9]/);
      expect(password).toMatch(/[!@#$%^&*()_+\-=]/);
    });
  });

  test.describe('Theme Toggle', () => {
    test('should toggle theme', async ({ page }) => {
      await page.click('#themeToggle');

      // Check data-theme attribute
      const theme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
      );
      expect(theme).toBe('light');
    });

    test('should persist theme preference', async ({ page }) => {
      await page.click('#themeToggle');

      // Reload page
      await page.reload();

      // Theme should persist
      const theme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
      );
      expect(theme).toBe('light');
    });
  });

  test.describe('Copy Functionality', () => {
    test('should copy result to clipboard', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      // Encrypt a message
      await page.fill('#inputText', 'Test message');
      await page.fill('#password', 'Password123!');
      await page.click('#actionBtn');

      // Wait for result
      await expect(page.locator('.result-text')).toBeVisible();

      // Click copy
      await page.click('.copy-btn');

      // Check button text changed
      await expect(page.locator('.copy-btn')).toContainText('کپی شد');
    });
  });

  test.describe('Keyboard Shortcuts', () => {
    test('should process with Ctrl+Enter', async ({ page }) => {
      await page.fill('#inputText', 'Test');
      await page.fill('#password', 'Pass123!');

      await page.keyboard.press('Control+Enter');

      await expect(page.locator('#resultArea')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await expect(page.locator('.app-title')).toBeVisible();
      await expect(page.locator('#inputText')).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await expect(page.locator('.app-title')).toBeVisible();
      await expect(page.locator('#inputText')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await expect(page.locator('#tabEnc')).toHaveAttribute('role', 'tab');
      await expect(page.locator('#actionBtn')).toHaveAttribute('aria-label');
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Tab through elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should focus on elements
      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBeTruthy();
    });
  });

  test.describe('Error Handling', () => {
    test('should show error for wrong password', async ({ page }) => {
      // Encrypt a message
      await page.fill('#inputText', 'Secret message');
      await page.fill('#password', 'CorrectPassword123!');
      await page.click('#actionBtn');

      await expect(page.locator('#resultArea')).toBeVisible();

      // Switch to decrypt
      await page.click('#tabDec');

      // Try to decrypt with wrong password
      await page.fill('#inputText', await page.locator('.result-text').textContent());
      await page.fill('#password', 'WrongPassword456!');
      await page.click('#actionBtn');

      // Should show error
      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('خطا');
        await dialog.dismiss();
      });
    });
  });
});
