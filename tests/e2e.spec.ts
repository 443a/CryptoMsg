/**
 * @fileoverview CryptoMsg - E2E Tests
 * @version 5.0.0
 */

import { test, expect } from '@playwright/test';

test.describe('CryptoMsg E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Encryption Flow', () => {
    test('should encrypt a message using Base64', async ({ page }) => {
      // Enter message
      await page.fill('#inputText', 'Hello, this is a secret message!');

      // Enter password
      await page.fill('#password', 'MySecurePassword123!');

      // Select Base64 encoding
      await page.selectOption('#encodingMode', 'base64');

      // Click encrypt button
      await page.click('#actionBtn');

      // Wait for result
      await expect(page.locator('#resultArea')).toBeVisible();

      // Verify output is not empty
      const resultText = await page.locator('.result-text').textContent();
      expect(resultText).toBeTruthy();
      expect(resultText!.length).toBeGreaterThan(0);
    });

    test('should encrypt a message using Persian characters', async ({ page }) => {
      await page.fill('#inputText', 'پیام محرمانه فارسی');
      await page.fill('#password', 'رمز_فارسی_۱۲۳');

      await page.selectOption('#encodingMode', 'farsiChars');
      await page.click('#actionBtn');

      await expect(page.locator('#resultArea')).toBeVisible();

      const resultText = await page.locator('.result-text').textContent();
      expect(resultText).toBeTruthy();
    });

    test('should show password strength indicator', async ({ page }) => {
      // Type a weak password
      await page.fill('#password', 'abc');

      // Verify weak strength
      await expect(page.locator('#strengthText')).toContainText(/ضعیف|weak/i);

      // Type a strong password
      await page.fill('#password', 'MyVeryStr0ng!Passw0rd@2024');

      // Verify strong strength
      await expect(page.locator('#strengthText')).toContainText(/قوی|strong/i);
    });

    test('should generate a strong password', async ({ page }) => {
      // Click generate password button
      await page.click('.gen-pass-btn');

      // Verify password field has content
      const passwordValue = await page.inputValue('#password');
      expect(passwordValue.length).toBeGreaterThanOrEqual(24);

      // Verify strength is strong
      await expect(page.locator('#strengthText')).toContainText(/قوی|strong/i);
    });

    test('should switch between tabs', async ({ page }) => {
      // Click decrypt tab
      await page.click('#tabDec');

      // Verify decrypt tab is active
      await expect(page.locator('#tabDec')).toHaveClass(/active/);

      // Verify encoding settings are hidden
      await expect(page.locator('#encSettings')).toBeHidden();

      // Switch back to encrypt
      await page.click('#tabEnc');

      // Verify encoding settings are visible
      await expect(page.locator('#encSettings')).toBeVisible();
    });
  });

  test.describe('Decryption Flow', () => {
    test('should decrypt a Base64 encrypted message', async ({ page }) => {
      // First encrypt a message
      const testMessage = 'Decrypt this message';
      const testPassword = 'DecryptPass123!';

      // Go to encrypt tab
      await page.fill('#inputText', testMessage);
      await page.fill('#password', testPassword);
      await page.selectOption('#encodingMode', 'base64');
      await page.click('#actionBtn');

      // Get encrypted text
      await page.waitForSelector('#resultArea');
      const encryptedText = await page.locator('.result-text').textContent();

      // Switch to decrypt
      await page.click('#tabDec');

      // Paste encrypted text
      await page.fill('#inputText', encryptedText!);
      await page.fill('#password', testPassword);

      // Click decrypt
      await page.click('#actionBtn');

      // Verify decrypted message
      await expect(page.locator('#resultArea')).toBeVisible();
      const decryptedText = await page.locator('.result-text').textContent();
      expect(decryptedText).toContain(testMessage);
    });

    test('should show error for wrong password', async ({ page }) => {
      // Set up a dialog handler for the alert
      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toMatch(/رمز|password|wrong/i);
        await dialog.dismiss();
      });

      // Encrypt a message
      await page.fill('#inputText', 'Secret message');
      await page.fill('#password', 'CorrectPassword');
      await page.click('#actionBtn');

      const encryptedText = await page.locator('.result-text').textContent();

      // Switch to decrypt and try with wrong password
      await page.click('#tabDec');
      await page.fill('#inputText', encryptedText!);
      await page.fill('#password', 'WrongPassword');

      await page.click('#actionBtn');
    });
  });

  test.describe('UI/UX', () => {
    test('should show method description when selecting encoding mode', async ({ page }) => {
      // Select different encoding modes and verify descriptions change
      const modes = ['base64', 'farsiChars', 'farsiWords', 'emoji'];

      for (const mode of modes) {
        await page.selectOption('#encodingMode', mode);
        await expect(page.locator('#methodDesc')).toBeVisible();
      }
    });

    test('should show cover text input only for invisible mode', async ({ page }) => {
      // Default mode should hide cover text
      await expect(page.locator('#coverTextInput')).toBeHidden();

      // Invisible mode should show cover text
      await page.selectOption('#encodingMode', 'invisible');
      await expect(page.locator('#coverTextInput')).toBeVisible();
    });

    test('should toggle password visibility', async ({ page }) => {
      // Password should be hidden by default
      const passwordInput = page.locator('#password');
      await expect(passwordInput).toHaveAttribute('type', 'password');

      // Click toggle
      await page.click('#togglePassBtn');

      // Password should be visible
      await expect(passwordInput).toHaveAttribute('type', 'text');
    });

    test('should show smart suggestions based on input length', async ({ page }) => {
      // Short text
      await page.fill('#inputText', 'Short message');
      await expect(page.locator('#smartSuggestion')).toBeVisible();

      // Clear and try long text
      await page.fill('#inputText', 'A'.repeat(600));
      await expect(page.locator('#smartSuggestion')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await expect(page.locator('#inputText')).toHaveAttribute('aria-label', /.+/);
      await expect(page.locator('#password')).toHaveAttribute('aria-label', /.+/);
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Tab to elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Focus should move
      const focusedElement = await page.evaluate(() => document.activeElement?.id);
      expect(focusedElement).toBeTruthy();
    });
  });

  test.describe('Theme', () => {
    test('should have dark theme by default', async ({ page }) => {
      const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(theme).toBe('dark');
    });

    test('should toggle theme', async ({ page }) => {
      // Click theme toggle
      await page.click('#themeToggle');

      // Check theme changed
      const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(theme).toBe('light');

      // Toggle back
      await page.click('#themeToggle');
      const theme2 = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(theme2).toBe('dark');
    });
  });
});
