/**
 * @fileoverview CryptoMsg Core - Cryptographic Operations
 * @version 5.0.0
 * @license MIT
 */

import type { CryptoConfig, EncryptedData, PasswordStrength } from '../types';

// ==========================================
// CONFIGURATION
// ==========================================

const CRYPTO_CONFIG: CryptoConfig = {
  iterations: 600000,
  keyLength: 256,
  saltLength: 16,
  ivLength: 12,
  algorithm: 'AES-GCM',
  hash: 'SHA-256',
};

// ==========================================
// CRYPTO MODULE
// ==========================================

export class CryptoModule {
  private encoder: TextEncoder;
  private decoder: TextDecoder;

  constructor() {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }

  /**
   * Import password as key material for PBKDF2
   */
  private async getKeyMaterial(password: string): Promise<CryptoKey> {
    return window.crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
  }

  /**
   * Derive encryption key from password using PBKDF2
   */
  private async deriveKey(
    keyMaterial: CryptoKey,
    salt: Uint8Array
  ): Promise<CryptoKey> {
    return window.crypto.subtle.deriveKey(
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

  /**
   * Convert ArrayBuffer to Base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i] ?? 0);
    }
    return window.btoa(binary);
  }

  /**
   * Convert Base64 string to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer as ArrayBuffer;
  }

  /**
   * Encrypt text using AES-GCM
   */
  async encrypt(text: string, password: string): Promise<string> {
    try {
      const salt = window.crypto.getRandomValues(
        new Uint8Array(CRYPTO_CONFIG.saltLength)
      );
      const iv = window.crypto.getRandomValues(
        new Uint8Array(CRYPTO_CONFIG.ivLength)
      );

      const keyMaterial = await this.getKeyMaterial(password);
      const key = await this.deriveKey(keyMaterial, salt);

      const encryptedContent = await window.crypto.subtle.encrypt(
        { name: CRYPTO_CONFIG.algorithm, iv },
        key,
        this.encoder.encode(text)
      );

      // Package encrypted data
      const encryptedData: EncryptedData = {
        s: this.arrayBufferToBase64(salt),
        i: this.arrayBufferToBase64(iv),
        c: this.arrayBufferToBase64(encryptedContent),
      };

      return window.btoa(JSON.stringify(encryptedData));
    } catch (error) {
      console.error('Encryption error:', error);
      throw new CryptoError('Encryption failed', 'ENCRYPT_FAILED');
    }
  }

  /**
   * Decrypt encrypted data using password
   */
  async decrypt(packedData: string, password: string): Promise<string> {
    try {
      const cleanData = packedData.trim();
      const decodedString = window.atob(cleanData);

      // Check for legacy version
      if (decodedString.startsWith('Salted__')) {
        throw new CryptoError(
          'Legacy version detected',
          'LEGACY_VERSION'
        );
      }

      const dataObj: EncryptedData = JSON.parse(decodedString);
      const salt = this.base64ToArrayBuffer(dataObj.s);
      const iv = this.base64ToArrayBuffer(dataObj.i);
      const ciphertext = this.base64ToArrayBuffer(dataObj.c);

      const keyMaterial = await this.getKeyMaterial(password);
      const key = await this.deriveKey(keyMaterial, new Uint8Array(salt));

      const decryptedContent = await window.crypto.subtle.decrypt(
        { name: CRYPTO_CONFIG.algorithm, iv: new Uint8Array(iv) },
        key,
        ciphertext
      );

      return this.decoder.decode(decryptedContent);
    } catch (error) {
      if (error instanceof CryptoError) {
        throw error;
      }
      console.error('Decryption error:', error);
      throw new CryptoError(
        'Decryption failed - wrong password or tampered data',
        'DECRYPT_FAIL'
      );
    }
  }

  /**
   * Generate cryptographically secure random password
   */
  generatePassword(length: number = 24): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    const charsetArray = Array.from(charset);
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let password = '';
    for (let i = 0; i < length; i++) {
      const charIndex = randomValues[i] % charsetArray.length;
      const char = charsetArray[charIndex];
      if (char !== undefined) {
        password += char;
      }
    }
    return password;
  }

  /**
   * Calculate password strength
   */
  calculatePasswordStrength(password: string): PasswordStrength {
    if (!password) {
      return {
        score: 0,
        level: 'weak',
        crackTime: 0n,
        crackTimeText: 'Not entered',
      };
    }

    // Calculate score
    let score = 0;
    if (password.length > 8) score += 10;
    if (password.length > 12) score += 20;
    if (password.length > 16) score += 20;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;

    // Calculate entropy
    let charset = 0;
    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/[0-9]/.test(password)) charset += 10;
    if (/[^A-Za-z0-9]/.test(password)) charset += 32;

    if (charset === 0) charset = 26;

    const combinations = BigInt(charset) ** BigInt(password.length);
    const speed = 10000000000n; // 10 billion guesses per second
    const crackTime = combinations / speed;

    // Determine level
    let level: PasswordStrength['level'] = 'weak';
    if (score >= 70) level = 'strong';
    else if (score >= 40) level = 'medium';

    // Generate crack time text
    let crackTimeText: string;
    if (crackTime > 3153600000n) {
      crackTimeText = 'Centuries! 🛡️';
    } else if (crackTime > 31536000n) {
      crackTimeText = `${crackTime / 31536000n} years`;
    } else if (crackTime > 86400n) {
      crackTimeText = `${crackTime / 86400n} days`;
    } else if (crackTime > 3600n) {
      crackTimeText = `${crackTime / 3600n} hours`;
    } else {
      crackTimeText = 'Less than 1 second 😱';
    }

    return {
      score: Math.min(score, 100),
      level,
      crackTime,
      crackTimeText,
    };
  }

  /**
   * Encrypt a file
   */
  async encryptFile(file: File, password: string): Promise<Blob> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const salt = window.crypto.getRandomValues(
        new Uint8Array(CRYPTO_CONFIG.saltLength)
      );
      const iv = window.crypto.getRandomValues(
        new Uint8Array(CRYPTO_CONFIG.ivLength)
      );

      const keyMaterial = await this.getKeyMaterial(password);
      const key = await this.deriveKey(keyMaterial, salt);

      const encryptedContent = await window.crypto.subtle.encrypt(
        { name: CRYPTO_CONFIG.algorithm, iv },
        key,
        arrayBuffer
      );

      // Create encrypted blob with header
      const header = new Uint8Array([
        0x43, 0x4d, 0x45, 0x47, // "CMEG" magic bytes
        0x01, // Version 1
        ...salt,
        ...iv,
      ]);

      const encryptedArray = new Uint8Array(encryptedContent);
      const result = new Uint8Array(header.length + encryptedArray.length);
      result.set(header);
      result.set(encryptedArray, header.length);

      return new Blob([result], { type: 'application/octet-stream' });
    } catch (error) {
      console.error('File encryption error:', error);
      throw new CryptoError('File encryption failed', 'FILE_ENCRYPT_FAILED');
    }
  }

  /**
   * Decrypt a file
   */
  async decryptFile(
    blob: Blob,
    password: string,
    originalFilename: string
  ): Promise<{ blob: Blob; filename: string }> {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      // Check magic bytes
      const magic = String.fromCharCode(...data.slice(0, 4));
      if (magic !== 'CMEG') {
        throw new CryptoError('Invalid file format', 'INVALID_FORMAT');
      }

      const version = data[4];
      if (version !== 1) {
        throw new CryptoError('Unsupported file version', 'UNSUPPORTED_VERSION');
      }

      const salt = data.slice(5, 21);
      const iv = data.slice(21, 33);
      const ciphertext = data.slice(33);

      const keyMaterial = await this.getKeyMaterial(password);
      const key = await this.deriveKey(keyMaterial, salt);

      const decryptedContent = await window.crypto.subtle.decrypt(
        { name: CRYPTO_CONFIG.algorithm, iv },
        key,
        ciphertext
      );

      return {
        blob: new Blob([decryptedContent]),
        filename: originalFilename.replace(/\.cmeg$/, ''),
      };
    } catch (error) {
      if (error instanceof CryptoError) {
        throw error;
      }
      console.error('File decryption error:', error);
      throw new CryptoError(
        'File decryption failed - wrong password or corrupted file',
        'FILE_DECRYPT_FAIL'
      );
    }
  }
}

// ==========================================
// CUSTOM ERROR CLASS
// ==========================================

export class CryptoError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'CryptoError';
  }
}

// ==========================================
// EXPORTS
// ==========================================

export const Crypto = new CryptoModule();
export { CRYPTO_CONFIG };
