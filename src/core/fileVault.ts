/**
 * @fileoverview Offline file-to-text vault encryption.
 * @version 5.0.0
 * @license MIT
 */

import type {
  FileVaultDecryptionResult,
  FileVaultEncryptedPayload,
  FileVaultMetadata,
} from '../types';
import {
  base64UrlToBytes,
  bytesToBase64Url,
  concatBytes,
  readUint32,
  sanitizeFilename,
  toArrayBuffer,
  utf8ToBytes,
  bytesToUtf8,
  writeUint32,
} from './binary';
import { CRYPTO_CONFIG, CryptoError } from './crypto';

const FILE_VAULT_PREFIX = 'CMF1.';
const FILE_VAULT_MAGIC = new Uint8Array([0x43, 0x4d, 0x46, 0x31]);
const FILE_VAULT_VERSION = 1;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const DEFAULT_MIME_TYPE = 'application/octet-stream';

export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new CryptoError('File exceeds the 5MB vault limit', 'FILE_TOO_LARGE');
  }

  if (typeof file.arrayBuffer === 'function') {
    return file.arrayBuffer();
  }

  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new CryptoError('Unable to read file', 'FILE_READ_FAILED'));
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new CryptoError('Unexpected file reader result', 'FILE_READ_FAILED'));
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

async function getKeyMaterial(password: string): Promise<CryptoKey> {
  return globalThis.crypto.subtle.importKey(
    'raw',
    toArrayBuffer(utf8ToBytes(password)),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
}

async function deriveVaultKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await getKeyMaterial(password);

  return globalThis.crypto.subtle.deriveKey(
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

function assertPassword(password: string): void {
  if (!password) {
    throw new CryptoError('Password is required', 'PASSWORD_REQUIRED');
  }
}

function createMetadata(file: File): FileVaultMetadata {
  const metadata: FileVaultMetadata = {
    filename: sanitizeFilename(file.name),
    mimeType: file.type || DEFAULT_MIME_TYPE,
    size: file.size,
  };

  if (Number.isFinite(file.lastModified)) {
    metadata.lastModified = file.lastModified;
  }

  return metadata;
}

function encodePayload(payload: FileVaultEncryptedPayload): string {
  const metadataBytes = utf8ToBytes(JSON.stringify(payload.metadata));
  const header = concatBytes([
    FILE_VAULT_MAGIC,
    new Uint8Array([FILE_VAULT_VERSION]),
    new Uint8Array([payload.salt.byteLength]),
    new Uint8Array([payload.iv.byteLength]),
    writeUint32(metadataBytes.byteLength),
  ]);

  const packed = concatBytes([
    header,
    payload.salt,
    payload.iv,
    metadataBytes,
    payload.ciphertext,
  ]);

  return `${FILE_VAULT_PREFIX}${bytesToBase64Url(packed)}`;
}

function decodePayload(vaultText: string): FileVaultEncryptedPayload {
  const clean = vaultText.trim();
  if (!clean.startsWith(FILE_VAULT_PREFIX)) {
    throw new CryptoError('Invalid file vault format', 'FILE_VAULT_INVALID_FORMAT');
  }

  const bytes = base64UrlToBytes(clean.slice(FILE_VAULT_PREFIX.length));
  const minimumHeaderLength = 11;
  if (bytes.byteLength < minimumHeaderLength) {
    throw new CryptoError('File vault payload is truncated', 'FILE_VAULT_TRUNCATED');
  }

  for (let i = 0; i < FILE_VAULT_MAGIC.length; i++) {
    if (bytes[i] !== FILE_VAULT_MAGIC[i]) {
      throw new CryptoError('Invalid file vault magic bytes', 'FILE_VAULT_INVALID_FORMAT');
    }
  }

  const version = bytes[4];
  if (version !== FILE_VAULT_VERSION) {
    throw new CryptoError('Unsupported file vault version', 'FILE_VAULT_UNSUPPORTED_VERSION');
  }

  const saltLength = bytes[5];
  const ivLength = bytes[6];
  if (saltLength !== CRYPTO_CONFIG.saltLength || ivLength !== CRYPTO_CONFIG.ivLength) {
    throw new CryptoError('Invalid file vault crypto parameters', 'FILE_VAULT_INVALID_FORMAT');
  }

  const metadataLength = readUint32(bytes, 7);
  const saltStart = minimumHeaderLength;
  const ivStart = saltStart + saltLength;
  const metadataStart = ivStart + ivLength;
  const ciphertextStart = metadataStart + metadataLength;

  if (ciphertextStart > bytes.byteLength) {
    throw new CryptoError('File vault payload is truncated', 'FILE_VAULT_TRUNCATED');
  }

  let metadata: FileVaultMetadata;
  try {
    metadata = JSON.parse(bytesToUtf8(bytes.slice(metadataStart, ciphertextStart)));
  } catch {
    throw new CryptoError('Invalid file metadata', 'FILE_VAULT_INVALID_METADATA');
  }

  if (
    typeof metadata.filename !== 'string' ||
    typeof metadata.mimeType !== 'string' ||
    typeof metadata.size !== 'number'
  ) {
    throw new CryptoError('Invalid file metadata', 'FILE_VAULT_INVALID_METADATA');
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

export class FileVaultModule {
  readonly maxFileSizeBytes = MAX_FILE_SIZE_BYTES;
  readonly prefix = FILE_VAULT_PREFIX;

  async encryptFileToText(file: File, password: string): Promise<string> {
    assertPassword(password);

    try {
      const fileBytes = new Uint8Array(await readFileAsArrayBuffer(file));
      const salt = globalThis.crypto.getRandomValues(new Uint8Array(CRYPTO_CONFIG.saltLength));
      const iv = globalThis.crypto.getRandomValues(new Uint8Array(CRYPTO_CONFIG.ivLength));
      const key = await deriveVaultKey(password, salt);

      const ciphertext = await globalThis.crypto.subtle.encrypt(
        { name: CRYPTO_CONFIG.algorithm, iv },
        key,
        toArrayBuffer(fileBytes)
      );

      return encodePayload({
        salt,
        iv,
        metadata: createMetadata(file),
        ciphertext: new Uint8Array(ciphertext),
      });
    } catch (error) {
      if (error instanceof CryptoError) {
        throw error;
      }
      throw new CryptoError('File-to-text encryption failed', 'FILE_TEXT_ENCRYPT_FAILED');
    }
  }

  async decryptTextToFile(vaultText: string, password: string): Promise<FileVaultDecryptionResult> {
    assertPassword(password);

    try {
      const payload = decodePayload(vaultText);
      const key = await deriveVaultKey(password, payload.salt);
      const plaintext = await globalThis.crypto.subtle.decrypt(
        { name: CRYPTO_CONFIG.algorithm, iv: toArrayBuffer(payload.iv) },
        key,
        toArrayBuffer(payload.ciphertext)
      );

      return {
        blob: new Blob([plaintext], { type: payload.metadata.mimeType || DEFAULT_MIME_TYPE }),
        filename: payload.metadata.filename,
        mimeType: payload.metadata.mimeType || DEFAULT_MIME_TYPE,
        size: plaintext.byteLength,
      };
    } catch (error) {
      if (error instanceof CryptoError) {
        throw error;
      }
      throw new CryptoError(
        'File-to-text decryption failed - wrong password or tampered data',
        'FILE_TEXT_DECRYPT_FAILED'
      );
    }
  }

  isVaultText(text: string): boolean {
    return text.trim().startsWith(FILE_VAULT_PREFIX);
  }

  downloadDecryptedFile(result: FileVaultDecryptionResult): void {
    const url = URL.createObjectURL(result.blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = sanitizeFilename(result.filename);
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }
}

export const FileVault = new FileVaultModule();
export {
  FILE_VAULT_MAGIC,
  FILE_VAULT_PREFIX,
  FILE_VAULT_VERSION,
  MAX_FILE_SIZE_BYTES,
};
