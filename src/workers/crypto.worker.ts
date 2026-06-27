/**
 * @fileoverview CryptoMsg Web Worker - Offload crypto operations
 * @version 5.0.0
 * @license MIT
 */

import type {
  CryptoConfig,
  CryptoWorkerOperation,
  FileVaultMetadata,
  FileVaultWorkerFileResult,
} from '../types';

interface WorkerMessage {
  type: CryptoWorkerOperation;
  id: string;
  payload: {
    text?: string;
    data?: string;
    password?: string;
    length?: number;
    fileBytes?: ArrayBuffer;
    filename?: string;
    mimeType?: string;
    lastModified?: number;
  };
}

interface WorkerResponse {
  type: 'ready' | 'result' | 'error';
  id: string;
  payload?: {
    result?: unknown;
    error?: string;
    code?: string;
  };
}

interface TransferablePostMessageScope {
  postMessage(message: unknown, transfer: Transferable[]): void;
}

class WorkerCryptoError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'WorkerCryptoError';
  }
}

const CRYPTO_CONFIG: CryptoConfig = {
  iterations: 600000,
  keyLength: 256,
  saltLength: 16,
  ivLength: 12,
  algorithm: 'AES-GCM',
  hash: 'SHA-256',
};

const FILE_VAULT_PREFIX = 'CMF1.';
const FILE_VAULT_MAGIC = new Uint8Array([0x43, 0x4d, 0x46, 0x31]);
const FILE_VAULT_VERSION = 1;
const DEFAULT_MIME_TYPE = 'application/octet-stream';
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const BASE64_CHUNK_SIZE = 0x8000;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64(data: ArrayBuffer | Uint8Array): string {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  let binary = '';

  for (let offset = 0; offset < bytes.length; offset += BASE64_CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + BASE64_CHUNK_SIZE));
  }

  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64.replace(/\s+/g, ''));
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function bytesToBase64Url(data: ArrayBuffer | Uint8Array): string {
  return bytesToBase64(data)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlToBytes(base64Url: string): Uint8Array {
  const clean = base64Url.trim().replace(/\s+/g, '');
  const base64 = clean.replace(/-/g, '+').replace(/_/g, '/');
  const paddingLength = (4 - (base64.length % 4)) % 4;
  return base64ToBytes(base64 + '='.repeat(paddingLength));
}

function concatBytes(parts: readonly Uint8Array[]): Uint8Array {
  const totalLength = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;

  for (const part of parts) {
    output.set(part, offset);
    offset += part.byteLength;
  }

  return output;
}

function writeUint32(value: number): Uint8Array {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setUint32(0, value, false);
  return bytes;
}

function readUint32(bytes: Uint8Array, offset: number): number {
  if (offset < 0 || offset + 4 > bytes.byteLength) {
    throw new WorkerCryptoError('Cannot read payload length', 'INVALID_LENGTH');
  }

  return new DataView(bytes.buffer, bytes.byteOffset + offset, 4).getUint32(0, false);
}

function isUnsafeFilenameChar(char: string): boolean {
  const codePoint = char.codePointAt(0) ?? 0;
  return codePoint < 32 || codePoint === 127 || '<>:"/\\|?*'.includes(char);
}

function sanitizeFilename(filename: string, fallback = 'cryptomsg-file'): string {
  const cleaned = Array.from(filename, (char) => (isUnsafeFilenameChar(char) ? '_' : char))
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\.+$/, '');

  return cleaned.length > 0 ? cleaned.slice(0, 180) : fallback;
}

async function getKeyMaterial(password: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    toArrayBuffer(encoder.encode(password)),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await getKeyMaterial(password);

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: toArrayBuffer(salt),
      iterations: CRYPTO_CONFIG.iterations,
      hash: CRYPTO_CONFIG.hash,
    },
    keyMaterial,
    {
      name: CRYPTO_CONFIG.algorithm,
      length: CRYPTO_CONFIG.keyLength,
    },
    false,
    ['encrypt', 'decrypt']
  );
}

function requireString(value: string | undefined, name: string): string {
  if (value === undefined) {
    throw new WorkerCryptoError(`Missing ${name}`, 'MISSING_FIELD');
  }

  return value;
}

function encodeVaultPayload(
  salt: Uint8Array,
  iv: Uint8Array,
  metadata: FileVaultMetadata,
  ciphertext: Uint8Array
): string {
  const metadataBytes = encoder.encode(JSON.stringify(metadata));
  const header = concatBytes([
    FILE_VAULT_MAGIC,
    new Uint8Array([FILE_VAULT_VERSION]),
    new Uint8Array([salt.byteLength]),
    new Uint8Array([iv.byteLength]),
    writeUint32(metadataBytes.byteLength),
  ]);

  return `${FILE_VAULT_PREFIX}${bytesToBase64Url(
    concatBytes([header, salt, iv, metadataBytes, ciphertext])
  )}`;
}

function decodeVaultPayload(text: string): {
  salt: Uint8Array;
  iv: Uint8Array;
  metadata: FileVaultMetadata;
  ciphertext: Uint8Array;
} {
  const clean = text.trim();
  if (!clean.startsWith(FILE_VAULT_PREFIX)) {
    throw new WorkerCryptoError('Invalid file vault format', 'FILE_VAULT_INVALID_FORMAT');
  }

  const bytes = base64UrlToBytes(clean.slice(FILE_VAULT_PREFIX.length));
  const minimumHeaderLength = 11;
  if (bytes.byteLength < minimumHeaderLength) {
    throw new WorkerCryptoError('File vault payload is truncated', 'FILE_VAULT_TRUNCATED');
  }

  for (let i = 0; i < FILE_VAULT_MAGIC.length; i++) {
    if (bytes[i] !== FILE_VAULT_MAGIC[i]) {
      throw new WorkerCryptoError('Invalid file vault format', 'FILE_VAULT_INVALID_FORMAT');
    }
  }

  if (bytes[4] !== FILE_VAULT_VERSION) {
    throw new WorkerCryptoError('Unsupported file vault version', 'FILE_VAULT_UNSUPPORTED_VERSION');
  }

  const saltLength = bytes[5];
  const ivLength = bytes[6];
  if (saltLength !== CRYPTO_CONFIG.saltLength || ivLength !== CRYPTO_CONFIG.ivLength) {
    throw new WorkerCryptoError('Invalid file vault crypto parameters', 'FILE_VAULT_INVALID_FORMAT');
  }

  const metadataLength = readUint32(bytes, 7);
  const saltStart = minimumHeaderLength;
  const ivStart = saltStart + saltLength;
  const metadataStart = ivStart + ivLength;
  const ciphertextStart = metadataStart + metadataLength;

  if (ciphertextStart > bytes.byteLength) {
    throw new WorkerCryptoError('File vault payload is truncated', 'FILE_VAULT_TRUNCATED');
  }

  let metadata: FileVaultMetadata;
  try {
    metadata = JSON.parse(decoder.decode(bytes.slice(metadataStart, ciphertextStart)));
  } catch {
    throw new WorkerCryptoError('Invalid file metadata', 'FILE_VAULT_INVALID_METADATA');
  }

  if (
    typeof metadata.filename !== 'string' ||
    typeof metadata.mimeType !== 'string' ||
    typeof metadata.size !== 'number'
  ) {
    throw new WorkerCryptoError('Invalid file metadata', 'FILE_VAULT_INVALID_METADATA');
  }

  const sanitizedMetadata: FileVaultMetadata = {
    filename: sanitizeFilename(metadata.filename),
    mimeType: metadata.mimeType || DEFAULT_MIME_TYPE,
    size: metadata.size,
  };

  if (typeof metadata.lastModified === 'number') {
    sanitizedMetadata.lastModified = metadata.lastModified;
  }

  return {
    salt: bytes.slice(saltStart, ivStart),
    iv: bytes.slice(ivStart, metadataStart),
    metadata: sanitizedMetadata,
    ciphertext: bytes.slice(ciphertextStart),
  };
}

async function encrypt(text: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(CRYPTO_CONFIG.saltLength));
  const iv = crypto.getRandomValues(new Uint8Array(CRYPTO_CONFIG.ivLength));
  const key = await deriveKey(password, salt);

  const encryptedContent = await crypto.subtle.encrypt(
    { name: CRYPTO_CONFIG.algorithm, iv: toArrayBuffer(iv) },
    key,
    toArrayBuffer(encoder.encode(text))
  );

  return btoa(JSON.stringify({
    s: bytesToBase64(salt),
    i: bytesToBase64(iv),
    c: bytesToBase64(encryptedContent),
  }));
}

async function decrypt(packedData: string, password: string): Promise<string> {
  const decodedString = atob(packedData.trim());

  if (decodedString.startsWith('Salted__')) {
    throw new WorkerCryptoError('Legacy version detected', 'LEGACY_VERSION');
  }

  const dataObj: { s: string; i: string; c: string } = JSON.parse(decodedString);
  const salt = base64ToBytes(dataObj.s);
  const iv = base64ToBytes(dataObj.i);
  const ciphertext = base64ToBytes(dataObj.c);
  const key = await deriveKey(password, salt);

  const decryptedContent = await crypto.subtle.decrypt(
    { name: CRYPTO_CONFIG.algorithm, iv: toArrayBuffer(iv) },
    key,
    toArrayBuffer(ciphertext)
  );

  return decoder.decode(decryptedContent);
}

function generatePassword(length: number = 24): string {
  if (!Number.isInteger(length) || length < 1 || length > 1024) {
    throw new WorkerCryptoError('Password length must be between 1 and 1024', 'INVALID_PASSWORD_LENGTH');
  }

  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
  const charsetArray = Array.from(charset);
  const maxUnbiasedValue =
    Math.floor(0x100000000 / charsetArray.length) * charsetArray.length;
  let password = '';

  while (password.length < length) {
    const randomValues = new Uint32Array(length - password.length);
    crypto.getRandomValues(randomValues);

    for (const randomValue of randomValues) {
      if (randomValue >= maxUnbiasedValue) continue;

      const charIndex = randomValue % charsetArray.length;
      password += charsetArray[charIndex]!;
      if (password.length === length) break;
    }
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

async function encryptFileToText(payload: WorkerMessage['payload']): Promise<string> {
  const fileBytes = payload.fileBytes;
  const password = requireString(payload.password, 'password');
  const filename = requireString(payload.filename, 'filename');

  if (!fileBytes) {
    throw new WorkerCryptoError('Missing file bytes', 'MISSING_FIELD');
  }

  if (fileBytes.byteLength > MAX_FILE_SIZE_BYTES) {
    throw new WorkerCryptoError('File exceeds the 5MB vault limit', 'FILE_TOO_LARGE');
  }

  const salt = crypto.getRandomValues(new Uint8Array(CRYPTO_CONFIG.saltLength));
  const iv = crypto.getRandomValues(new Uint8Array(CRYPTO_CONFIG.ivLength));
  const key = await deriveKey(password, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: CRYPTO_CONFIG.algorithm, iv: toArrayBuffer(iv) },
    key,
    fileBytes
  );

  const metadata: FileVaultMetadata = {
    filename: sanitizeFilename(filename),
    mimeType: payload.mimeType || DEFAULT_MIME_TYPE,
    size: fileBytes.byteLength,
  };

  if (typeof payload.lastModified === 'number') {
    metadata.lastModified = payload.lastModified;
  }

  return encodeVaultPayload(salt, iv, metadata, new Uint8Array(ciphertext));
}

async function decryptTextToFile(payload: WorkerMessage['payload']): Promise<FileVaultWorkerFileResult> {
  const data = requireString(payload.data, 'data');
  const password = requireString(payload.password, 'password');
  const vaultPayload = decodeVaultPayload(data);
  const key = await deriveKey(password, vaultPayload.salt);
  const plaintext = await crypto.subtle.decrypt(
    { name: CRYPTO_CONFIG.algorithm, iv: toArrayBuffer(vaultPayload.iv) },
    key,
    toArrayBuffer(vaultPayload.ciphertext)
  );

  return {
    bytes: plaintext,
    filename: vaultPayload.metadata.filename,
    mimeType: vaultPayload.metadata.mimeType || DEFAULT_MIME_TYPE,
    size: plaintext.byteLength,
  };
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, id, payload } = event.data;

  try {
    let result: unknown;
    let transfer: Transferable[] = [];

    switch (type) {
      case 'encrypt':
        result = await encrypt(
          requireString(payload.text, 'text'),
          requireString(payload.password, 'password')
        );
        break;

      case 'decrypt':
        result = await decrypt(
          requireString(payload.data, 'data'),
          requireString(payload.password, 'password')
        );
        break;

      case 'generatePassword':
        result = generatePassword(payload.length ?? 24);
        break;

      case 'calculateStrength':
        result = calculatePasswordStrength(requireString(payload.password, 'password'));
        break;

      case 'encryptFileToText':
        result = await encryptFileToText(payload);
        break;

      case 'decryptTextToFile': {
        const fileResult = await decryptTextToFile(payload);
        result = fileResult;
        transfer = [fileResult.bytes];
        break;
      }

      default:
        throw new WorkerCryptoError(`Unknown operation: ${type satisfies never}`, 'UNKNOWN_OPERATION');
    }

    const response: WorkerResponse = {
      type: 'result',
      id,
      payload: { result },
    };
    (self as TransferablePostMessageScope).postMessage(response, transfer);
  } catch (error) {
    const response: WorkerResponse = {
      type: 'error',
      id,
      payload: {
        error: error instanceof Error ? error.message : 'Unknown error',
        code: error instanceof WorkerCryptoError ? error.code : 'WORKER_ERROR',
      },
    };
    self.postMessage(response);
  }
};

const readyResponse: WorkerResponse = { type: 'ready', id: 'init', payload: {} };
self.postMessage(readyResponse);
