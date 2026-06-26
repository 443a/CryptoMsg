/**
 * @fileoverview CryptoMsg - Test Setup
 * @version 5.0.0
 */

// Mock Web Crypto API
class MockCrypto {
  getRandomValues<T extends ArrayBufferView | null>(array: T): T {
    const bytes = new Uint8Array(array.byteLength);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return new Uint8Array(array.buffer, 0, array.byteLength) as T;
  }
}

// @ts-expect-error - Mock window.crypto
globalThis.crypto = {
  subtle: {
    importKey: async () => ({}),
    deriveKey: async () => ({}),
    encrypt: async (opts: object, key: object, data: BufferSource) => {
      return data;
    },
    decrypt: async (opts: object, key: object, data: BufferSource) => {
      return data;
    },
    getRandomValues: (array: ArrayBufferView | null) => {
      const bytes = new Uint8Array(array!.byteLength);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
      return bytes;
    },
  },
  getRandomValues: (array: ArrayBufferView | null) => {
    const bytes = new Uint8Array(array!.byteLength);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return bytes;
  },
};

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

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
