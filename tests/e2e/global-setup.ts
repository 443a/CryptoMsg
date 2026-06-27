import type { FullConfig } from '@playwright/test';
import { createStaticServer } from './staticServer';

async function waitForServer(url: string): Promise<void> {
  const deadline = Date.now() + 30000;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch (error) {
      lastError = error;
    }

    await new Promise(resolve => setTimeout(resolve, 250));
  }

  throw lastError instanceof Error ? lastError : new Error(`Timed out waiting for ${url}`);
}

async function globalSetup(_config: FullConfig): Promise<() => Promise<void>> {
  const server = createStaticServer('dist');
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(3000, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });

  await waitForServer('http://127.0.0.1:3000');

  return async () => {
    await new Promise<void>((resolve, reject) => {
      server.close(error => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  };
}

export default globalSetup;
