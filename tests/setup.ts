/**
 * @fileoverview CryptoMsg - Test Setup
 * @version 5.0.0
 */

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

// Mock Web Crypto API
const mockCrypto = {
  getRandomValues<T extends Uint8Array>(array: T): T {
    const bytes = new Uint8Array(array.byteLength);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return new Uint8Array(array.buffer, 0, array.byteLength) as T;
  },
  subtle: {
    importKey: async () => ({}),
    deriveKey: async () => ({}),
    encrypt: async (_opts: unknown, _key: unknown, data: BufferSource) => data,
    decrypt: async (_opts: unknown, _key: unknown, data: BufferSource) => data,
    getRandomValues<T extends Uint8Array>(array: T): T {
      const bytes = new Uint8Array(array.byteLength);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
      return new Uint8Array(array.buffer, 0, array.byteLength) as T;
    },
  },
};

// Use Object.defineProperty to override crypto
Object.defineProperty(globalThis, 'crypto', {
  value: mockCrypto,
  writable: true,
  configurable: true,
});

// Mock crypto.getRandomValues for Uint32Array
Object.defineProperty(globalThis.crypto, 'getRandomValues', {
  value<T extends Uint32Array>(array: T): T {
    const values = new Uint32Array(array.byteLength / 4);
    for (let i = 0; i < values.length; i++) {
      values[i] = Math.floor(Math.random() * 4294967296);
    }
    return new Uint32Array(array.buffer, 0, array.byteLength / 4) as T;
  },
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