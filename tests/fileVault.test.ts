/**
 * @fileoverview CryptoMsg - File-to-Text Vault Tests
 * @version 5.0.0
 */

import { describe, expect, it } from 'vitest';
import {
  FileVault,
  FILE_VAULT_PREFIX,
  MAX_FILE_SIZE_BYTES,
} from '../src/core/fileVault';
import { CryptoError } from '../src/core/crypto';

async function blobToText(blob: Blob): Promise<string> {
  if (typeof blob.arrayBuffer === 'function') {
    return new TextDecoder().decode(await blob.arrayBuffer());
  }

  const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Unexpected FileReader result'));
      }
    };
    reader.readAsArrayBuffer(blob);
  });

  return new TextDecoder().decode(buffer);
}

describe('FileVaultModule', () => {
  it('should encrypt a file into copyable CMF1 text and restore it', async () => {
    const file = new File(['hello file vault'], 'hello.txt', {
      type: 'text/plain',
      lastModified: 1710000000000,
    });
    const password = 'Strong file password 123!';

    const vaultText = await FileVault.encryptFileToText(file, password);
    expect(vaultText.startsWith(FILE_VAULT_PREFIX)).toBe(true);
    expect(vaultText).not.toContain('hello file vault');

    const restored = await FileVault.decryptTextToFile(vaultText, password);
    expect(restored.filename).toBe('hello.txt');
    expect(restored.mimeType).toBe('text/plain');
    expect(restored.size).toBe(file.size);
    expect(await blobToText(restored.blob)).toBe('hello file vault');
  });

  it('should generate unique salt and IV per encryption', async () => {
    const file = new File(['same bytes'], 'same.txt', { type: 'text/plain' });
    const password = 'Strong file password 123!';

    const first = await FileVault.encryptFileToText(file, password);
    const second = await FileVault.encryptFileToText(file, password);

    expect(first).not.toBe(second);
  });

  it('should reject files over the configured size limit', async () => {
    const oversizedFile = new File(
      [new Uint8Array(MAX_FILE_SIZE_BYTES + 1)],
      'oversized.bin',
      { type: 'application/octet-stream' }
    );

    await expect(
      FileVault.encryptFileToText(oversizedFile, 'Strong file password 123!')
    ).rejects.toMatchObject({
      code: 'FILE_TOO_LARGE',
    });
  });

  it('should reject wrong passwords', async () => {
    const file = new File(['secret'], 'secret.txt', { type: 'text/plain' });
    const vaultText = await FileVault.encryptFileToText(file, 'correct password');

    await expect(FileVault.decryptTextToFile(vaultText, 'wrong password')).rejects.toMatchObject({
      code: 'FILE_TEXT_DECRYPT_FAILED',
    });
  });

  it('should reject tampered payload text', async () => {
    const file = new File(['secret'], 'secret.txt', { type: 'text/plain' });
    const vaultText = await FileVault.encryptFileToText(file, 'correct password');
    const lastChar = vaultText.at(-1);
    const replacement = lastChar === 'A' ? 'B' : 'A';
    const tampered = `${vaultText.slice(0, -1)}${replacement}`;

    await expect(FileVault.decryptTextToFile(tampered, 'correct password')).rejects.toBeInstanceOf(
      CryptoError
    );
  });

  it('should identify vault text by prefix', () => {
    expect(FileVault.isVaultText(`${FILE_VAULT_PREFIX}abc`)).toBe(true);
    expect(FileVault.isVaultText('not vault text')).toBe(false);
  });
});
