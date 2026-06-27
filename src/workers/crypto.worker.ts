/**
 * @fileoverview CryptoMsg Web Worker - Offload crypto operations
 * @version 5.0.0
 * @license MIT
 */

/**
 * Web Worker for cryptographic operations
 * Offloads encryption/decryption from main thread for better UI performance
 */

interface WorkerMessage {
  type: 'encrypt' | 'decrypt' | 'generatePassword' | 'calculateStrength';
  id: string;
  payload: {
    text?: string;
    data?: string;
    password?: string;
    length?: number;
  };
}

interface WorkerResponse {
  type: 'result' | 'error' | 'progress';
  id: string;
  payload?: {
    result?: unknown;
    error?: string;
    progress?: number;
  };
}

// Crypto configuration (must match main app)
const CRYPTO_CONFIG = {
  iterations: 600000,
  keyLength: 256,
  saltLength: 16,
  ivLength: 12,
  algorithm: 'AES-GCM',
  hash: 'SHA-256',
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// ==========================================
// CRYPTO HELPERS
// ==========================================

async function getKeyMaterial(password: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
}

async function deriveKey(keyMaterial: CryptoKey, salt: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: CRYPTO_CONFIG.iterations,
      hash: CRYPTO_CONFIG.hash,
    },
    keyMaterial,
    {
      name: CRYPTO_CONFIG.algorithm,
      length: CRYPTO_CONFIG.keyLength,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  const binary = Array.from(bytes)
    .map(b => String.fromCharCode(b))
    .join('');
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer as ArrayBuffer;
}

// ==========================================
// OPERATIONS
// ==========================================

async function encrypt(text: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(CRYPTO_CONFIG.saltLength));
  const iv = crypto.getRandomValues(new Uint8Array(CRYPTO_CONFIG.ivLength));

  const keyMaterial = await getKeyMaterial(password);
  const key = await deriveKey(keyMaterial, salt);

  const encryptedContent = await crypto.subtle.encrypt(
    { name: CRYPTO_CONFIG.algorithm, iv },
    key,
    encoder.encode(text)
  );

  const encryptedData = {
    s: arrayBufferToBase64(salt),
    i: arrayBufferToBase64(iv),
    c: arrayBufferToBase64(encryptedContent),
  };

  return btoa(JSON.stringify(encryptedData));
}

async function decrypt(packedData: string, password: string): Promise<string> {
  const cleanData = packedData.trim();
  const decodedString = atob(cleanData);

  if (decodedString.startsWith('Salted__')) {
    throw new Error('LEGACY_VERSION');
  }

  const dataObj = JSON.parse(decodedString);
  const salt = base64ToArrayBuffer(dataObj.s);
  const iv = base64ToArrayBuffer(dataObj.i);
  const ciphertext = base64ToArrayBuffer(dataObj.c);

  const keyMaterial = await getKeyMaterial(password);
  const key = await deriveKey(keyMaterial, new Uint8Array(salt));

  const decryptedContent = await crypto.subtle.decrypt(
    { name: CRYPTO_CONFIG.algorithm, iv: new Uint8Array(iv) },
    key,
    ciphertext
  );

  return decoder.decode(decryptedContent);
}

function generatePassword(length: number = 24): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
  const charsetArray = Array.from(charset);
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  let password = '';
  for (let i = 0; i < length; i++) {
    // noUncheckedIndexedAccess requires explicit check
    const randomValue = randomValues[i];
    if (randomValue === undefined) continue;
    const charIndex = randomValue % charsetArray.length;
    // charIndex is always valid since it's modulo charsetArray.length
    password += charsetArray[charIndex]!;
  }
  return password;
}

function calculatePasswordStrength(password: string): {
  score: number;
  level: 'weak' | 'medium' | 'strong';
  crackTime: string;
} {
  if (!password) {
    return { score: 0, level: 'weak', crackTime: 'Not entered' };
  }

  let score = 0;
  if (password.length > 8) score += 10;
  if (password.length > 12) score += 20;
  if (password.length > 16) score += 20;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;

  let charset = 0;
  if (/[a-z]/.test(password)) charset += 26;
  if (/[A-Z]/.test(password)) charset += 26;
  if (/[0-9]/.test(password)) charset += 10;
  if (/[^A-Za-z0-9]/.test(password)) charset += 32;
  if (charset === 0) charset = 26;

  const combinations = BigInt(charset) ** BigInt(password.length);
  const speed = 10000000000n;
  const crackTime = combinations / speed;

  let level: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 70) level = 'strong';
  else if (score >= 40) level = 'medium';

  let crackTimeText: string;
  if (crackTime > 3153600000n) crackTimeText = 'Centuries!';
  else if (crackTime > 31536000n) crackTimeText = `${crackTime / 31536000n} years`;
  else if (crackTime > 86400n) crackTimeText = `${crackTime / 86400n} days`;
  else if (crackTime > 3600n) crackTimeText = `${crackTime / 3600n} hours`;
  else crackTimeText = 'Less than 1 second';

  return {
    score: Math.min(score, 100),
    level,
    crackTime: crackTimeText,
  };
}

// ==========================================
// MESSAGE HANDLER
// ==========================================

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, id, payload } = event.data;

  try {
    let result: unknown;

    switch (type) {
      case 'encrypt':
        if (!payload.text || !payload.password) {
          throw new Error('Missing text or password');
        }
        result = await encrypt(payload.text, payload.password);
        break;

      case 'decrypt':
        if (!payload.data || !payload.password) {
          throw new Error('Missing data or password');
        }
        result = await decrypt(payload.data, payload.password);
        break;

      case 'generatePassword':
        result = generatePassword(payload.length ?? 24);
        break;

      case 'calculateStrength':
        if (!payload.password) {
          throw new Error('Missing password');
        }
        result = calculatePasswordStrength(payload.password);
        break;

      default:
        throw new Error(`Unknown operation: ${type}`);
    }

    const response: WorkerResponse = {
      type: 'result',
      id,
      payload: { result },
    };
    self.postMessage(response);
  } catch (error) {
    const response: WorkerResponse = {
      type: 'error',
      id,
      payload: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
    self.postMessage(response);
  }
};

// Notify main thread that worker is ready
self.postMessage({ type: 'ready', id: 'init', payload: {} });
