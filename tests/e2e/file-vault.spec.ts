import { expect, test } from '@playwright/test';

test('encrypts a file to text and restores it as a download', async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { __CRYPTOMSG_DISABLE_SW?: boolean }).__CRYPTOMSG_DISABLE_SW = true;
    localStorage.setItem('cryptomsg-lang', 'en');
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
    }
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#fileVaultFile')).toBeAttached({ timeout: 30000 });

  const sampleContent = 'Playwright file vault sample';
  const password = 'A strong vault password 123!';

  await page.setInputFiles('#fileVaultFile', {
    name: 'sample.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from(sampleContent, 'utf8'),
  });
  await page.locator('#fileVaultPassword').fill(password);
  await page.locator('#fileVaultEncryptBtn').click();

  const output = page.locator('#fileVaultOutput');
  await expect(output).toHaveValue(/^CMF1\./, { timeout: 30000 });
  await expect(page.locator('#fileVaultStatus')).toContainText('encrypted text');

  const vaultText = await output.inputValue();
  await page.locator('#fileVaultText').fill(vaultText);

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#fileVaultDecryptBtn').click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('sample.txt');
  const stream = await download.createReadStream();
  expect(stream).not.toBeNull();

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    stream!.on('data', chunk => chunks.push(Buffer.from(chunk)));
    stream!.on('end', resolve);
    stream!.on('error', reject);
  });

  expect(Buffer.concat(chunks).toString('utf8')).toBe(sampleContent);
});
