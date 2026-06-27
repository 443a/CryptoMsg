/**
 * @fileoverview CryptoMsg - Test Setup
 * @version 5.0.0
 */

import { webcrypto } from 'node:crypto';

const testCrypto = webcrypto as unknown as Crypto;

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  },
  setItem(key: string, value: string): void {
    this.store[key] = value;
  },
  removeItem(key: string): void {
    delete this.store[key];
  },
  clear(): void {
    this.store = {};
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: async () => {},
    readText: async () => '',
  },
  configurable: true,
});

// Mock service worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: async () => ({}),
    getRegistrations: async () => [],
  },
  configurable: true,
});

// Use Node's real Web Crypto implementation in unit tests.
Object.defineProperty(globalThis, 'crypto', {
  value: testCrypto,
  writable: true,
  configurable: true,
});

Object.defineProperty(window, 'crypto', {
  value: testCrypto,
  writable: true,
  configurable: true,
});

// Suppress console errors in tests
const originalError = console.error;
console.error = (...args: unknown[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('React')
  ) {
    return;
  }
  originalError.apply(console, args);
};
