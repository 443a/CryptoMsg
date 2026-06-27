/**
 * @fileoverview CryptoMsg - Test Setup
 * @version 5.0.0
 */

import { webcrypto } from 'node:crypto';

function normalizeBufferSource(source: BufferSource): BufferSource {
  if (ArrayBuffer.isView(source)) {
    return Buffer.from(source.buffer, source.byteOffset, source.byteLength);
  }

  return Buffer.from(new Uint8Array(source));
}

function normalizeAlgorithm<T extends Algorithm | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams | Pbkdf2Params>(
  algorithm: T
): T {
  if (typeof algorithm === 'object' && algorithm !== null) {
    if ('salt' in algorithm && algorithm.salt) {
      return {
        ...algorithm,
        salt: normalizeBufferSource(algorithm.salt),
      };
    }

    if ('iv' in algorithm && algorithm.iv) {
      return {
        ...algorithm,
        iv: normalizeBufferSource(algorithm.iv),
      };
    }
  }

  return algorithm;
}

const testCrypto = {
  getRandomValues: webcrypto.getRandomValues.bind(webcrypto),
  randomUUID: webcrypto.randomUUID.bind(webcrypto),
  subtle: {
    importKey: (
      format: KeyFormat,
      keyData: JsonWebKey | BufferSource,
      algorithm: AlgorithmIdentifier,
      extractable: boolean,
      keyUsages: KeyUsage[]
    ) =>
      webcrypto.subtle.importKey(
        format,
        typeof keyData === 'object' && keyData !== null && !('kty' in keyData)
          ? normalizeBufferSource(keyData)
          : keyData,
        algorithm,
        extractable,
        keyUsages
      ),
    deriveKey: (
      algorithm: AlgorithmIdentifier,
      baseKey: CryptoKey,
      derivedKeyType: AlgorithmIdentifier,
      extractable: boolean,
      keyUsages: KeyUsage[]
    ) =>
      webcrypto.subtle.deriveKey(
        normalizeAlgorithm(algorithm as Pbkdf2Params),
        baseKey,
        derivedKeyType,
        extractable,
        keyUsages
      ),
    encrypt: (algorithm: AlgorithmIdentifier, key: CryptoKey, data: BufferSource) =>
      webcrypto.subtle.encrypt(
        normalizeAlgorithm(algorithm as AesGcmParams),
        key,
        normalizeBufferSource(data)
      ),
    decrypt: (algorithm: AlgorithmIdentifier, key: CryptoKey, data: BufferSource) =>
      webcrypto.subtle.decrypt(
        normalizeAlgorithm(algorithm as AesGcmParams),
        key,
        normalizeBufferSource(data)
      ),
  },
} as unknown as Crypto;

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
