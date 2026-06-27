import { expect, test } from '@playwright/test';

test('keeps the default interface fully Persian and switches cleanly to English', async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { __CRYPTOMSG_DISABLE_SW?: boolean }).__CRYPTOMSG_DISABLE_SW = true;
    localStorage.removeItem('cryptomsg-lang');
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('#tabEnc span')).toHaveText('ارسال (رمزنگاری)');
  await expect(page.locator('#tabDec span')).toHaveText('دریافت (رمزگشایی)');
  await expect(page.locator('#actionBtn span')).toHaveText('رمزنگاری پیام');
  await expect(page.locator('#fileVaultTitle span')).toHaveText('صندوق فایل به متن');
  await expect(page.locator('#fileVaultPickLabel span')).toHaveText('فایل کوچک (حداکثر ۵ مگابایت):');
  await expect(page.locator('#fileVaultEncryptBtn span')).toHaveText('تبدیل فایل به متن');
  await expect(page.locator('#fileVaultFileMeta')).toHaveText('هنوز فایلی انتخاب نشده است.');

  const defaultVisibleText = await page.locator('body').innerText();
  expect(defaultVisibleText).not.toContain('File-to-Text Vault');
  expect(defaultVisibleText).not.toContain('Convert File to Text');
  expect(defaultVisibleText).not.toContain('Smart splitting of long messages');
  expect(defaultVisibleText).not.toContain('Encrypt Message');

  await page.locator('#langToggle').click();

  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('#tabEnc span')).toHaveText('Send (Encrypt)');
  await expect(page.locator('#tabDec span')).toHaveText('Receive (Decrypt)');
  await expect(page.locator('#actionBtn span')).toHaveText('Encrypt Message');
  await expect(page.locator('#fileVaultTitle span')).toHaveText('File-to-Text Vault');
  await expect(page.locator('#fileVaultPickLabel span')).toHaveText('Small file (5MB max):');
  await expect(page.locator('#fileVaultEncryptBtn span')).toHaveText('Convert File to Text');
  await expect(page.locator('#fileVaultFileMeta')).toHaveText('No file selected yet.');
});
