/**
 * @fileoverview CryptoMsg - Core Crypto Tests
 * @version 5.0.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Crypto, CryptoError, CryptoModule } from '../src/core/crypto';

describe('CryptoModule', () => {
  describe('encrypt/decrypt', () => {
    it('should encrypt text and return base64', async () => {
      const plaintext = 'Hello, World!';
      const password = 'test-password-123';

      const encrypted = await Crypto.encrypt(plaintext, password);
      expect(encrypted).toBeTruthy();
      // Should be valid base64
      expect(() => atob(encrypted)).not.toThrow();
    });

    it('should encrypt and decrypt text correctly', async () => {
      const plaintext = 'Hello, World!';
      const password = 'test-password-123';

      const encrypted = await Crypto.encrypt(plaintext, password);
      const decrypted = await Crypto.decrypt(encrypted, password);
      expect(decrypted).toBe(plaintext);
    });

    it('should produce different ciphertexts for same input when crypto works properly', async () => {
      const plaintext = 'Secret message';
      const password = 'my-password';

      const encrypted1 = await Crypto.encrypt(plaintext, password);
      const encrypted2 = await Crypto.encrypt(plaintext, password);
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should reject wrong passwords', async () => {
      const encrypted = await Crypto.encrypt('Secret message', 'correct-password');

      await expect(Crypto.decrypt(encrypted, 'wrong-password')).rejects.toMatchObject({
        code: 'DECRYPT_FAIL',
      });
    });

    it('should reject tampered ciphertext', async () => {
      const encrypted = await Crypto.encrypt('Secret message', 'correct-password');
      const decoded = JSON.parse(atob(encrypted)) as { s: string; i: string; c: string };
      const ciphertext = atob(decoded.c);
      const tamperedByte = String.fromCharCode(ciphertext.charCodeAt(0) ^ 1);
      decoded.c = btoa(tamperedByte + ciphertext.slice(1));
      const tampered = btoa(JSON.stringify(decoded));

      await expect(Crypto.decrypt(tampered, 'correct-password')).rejects.toMatchObject({
        code: 'DECRYPT_FAIL',
      });
    });

    it('should handle empty string', async () => {
      const plaintext = '';
      const password = 'test-password';

      const encrypted = await Crypto.encrypt(plaintext, password);
      const decrypted = await Crypto.decrypt(encrypted, password);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle unicode text', async () => {
      const plaintext = 'پیام محرمانه با متن فارسی';
      const password = 'رمز عبور تست';

      const encrypted = await Crypto.encrypt(plaintext, password);
      const decrypted = await Crypto.decrypt(encrypted, password);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle long passwords', async () => {
      const plaintext = 'Test message';
      const password = 'a'.repeat(100);

      const encrypted = await Crypto.encrypt(plaintext, password);
      const decrypted = await Crypto.decrypt(encrypted, password);

      expect(decrypted).toBe(plaintext);
    });

    it('should handle special characters in password', async () => {
      const plaintext = 'Message';
      const password = 'p@$$w0rd!#$%^&*()';

      const encrypted = await Crypto.encrypt(plaintext, password);
      const decrypted = await Crypto.decrypt(encrypted, password);

      expect(decrypted).toBe(plaintext);
    });
  });

  describe('generatePassword', () => {
    it('should generate password of specified length', () => {
      const password16 = Crypto.generatePassword(16);
      expect(password16).toHaveLength(16);

      const password32 = Crypto.generatePassword(32);
      expect(password32).toHaveLength(32);

      const password8 = Crypto.generatePassword(8);
      expect(password8).toHaveLength(8);
    });

    it('should use default length of 24', () => {
      const password = Crypto.generatePassword();
      expect(password).toHaveLength(24);
    });

    it('should contain only valid characters', () => {
      const password = Crypto.generatePassword(24);
      const validCharset = /^[a-zA-Z0-9!@#$%^&*()_+=-]+$/;
      expect(password).toMatch(validCharset);
    });
  });

  describe('calculatePasswordStrength', () => {
    it('should return weak for empty password', () => {
      const result = Crypto.calculatePasswordStrength('');
      expect(result.level).toBe('weak');
      expect(result.score).toBe(0);
    });

    it('should return weak for short password', () => {
      const result = Crypto.calculatePasswordStrength('abc');
      expect(result.level).toBe('weak');
    });

    it('should return medium for moderate password', () => {
      const result = Crypto.calculatePasswordStrength('Password123');
      expect(result.level).toBe('medium');
    });

    it('should return strong for complex password', () => {
      const result = Crypto.calculatePasswordStrength('P@ssw0rd!2024Secure#');
      expect(result.level).toBe('strong');
    });

    it('should calculate higher score for longer passwords', () => {
      const short = Crypto.calculatePasswordStrength('ABC123');
      const long = Crypto.calculatePasswordStrength('ABC123ABC123ABC123');
      expect(long.score).toBeGreaterThan(short.score);
    });

    it('should include crack time information', () => {
      const result = Crypto.calculatePasswordStrength('Complex!Pass@123');
      expect(result.crackTimeText).toBeTruthy();
      expect(result.crackTime).toBeGreaterThan(0n);
    });
  });

  describe('CryptoError', () => {
    it('should have correct name and code', () => {
      const error = new CryptoError('Test error', 'TEST_CODE');
      expect(error.name).toBe('CryptoError');
      expect(error.code).toBe('TEST_CODE');
      expect(error.message).toBe('Test error');
    });
  });
});
