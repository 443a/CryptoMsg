/**
 * @fileoverview CryptoMsg - Unit Tests for Crypto Module
 * @version 5.0.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CryptoModule, CryptoError } from '../src/core/crypto';

describe('CryptoModule', () => {
  let crypto: CryptoModule;

  beforeEach(() => {
    crypto = new CryptoModule();
  });

  describe('encrypt & decrypt', () => {
    it('should encrypt and decrypt a simple text', async () => {
      const text = 'Hello, World!';
      const password = 'TestPassword123!';

      const encrypted = await crypto.encrypt(text, password);
      expect(encrypted).toBeTruthy();
      expect(typeof encrypted).toBe('string');
      expect(encrypted.length).toBeGreaterThan(0);

      const decrypted = await crypto.decrypt(encrypted, password);
      expect(decrypted).toBe(text);
    });

    it('should encrypt and decrypt Persian text', async () => {
      const text = 'سلام دنیا! این یک تست فارسی است.';
      const password = 'رمز_تست_۱۲۳';

      const encrypted = await crypto.encrypt(text, password);
      const decrypted = await crypto.decrypt(encrypted, password);
      expect(decrypted).toBe(text);
    });

    it('should produce different ciphertexts for same input (due to random salt/IV)', async () => {
      const text = 'Same message';
      const password = 'SamePassword';

      const encrypted1 = await crypto.encrypt(text, password);
      const encrypted2 = await crypto.encrypt(text, password);

      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should throw CryptoError for wrong password', async () => {
      const text = 'Secret message';
      const password = 'CorrectPassword';
      const wrongPassword = 'WrongPassword';

      const encrypted = await crypto.encrypt(text, password);

      await expect(crypto.decrypt(encrypted, wrongPassword)).rejects.toThrow(CryptoError);
    });

    it('should handle empty string', async () => {
      const text = '';
      const password = 'TestPassword';

      const encrypted = await crypto.encrypt(text, password);
      const decrypted = await crypto.decrypt(encrypted, password);
      expect(decrypted).toBe(text);
    });

    it('should handle long text', async () => {
      const text = 'A'.repeat(10000);
      const password = 'LongTextPassword';

      const encrypted = await crypto.encrypt(text, password);
      const decrypted = await crypto.decrypt(encrypted, password);
      expect(decrypted).toBe(text);
    });

    it('should handle special characters', async () => {
      const text = '!@#$%^&*()_+-=[]{}|;:\'",.<>?/\\`~';
      const password = 'SpecialChars123!';

      const encrypted = await crypto.encrypt(text, password);
      const decrypted = await crypto.decrypt(encrypted, password);
      expect(decrypted).toBe(text);
    });

    it('should handle Unicode text', async () => {
      const text = '你好世界 مرحبا بالعالم 🌍';
      const password = 'UnicodePass123';

      const encrypted = await crypto.encrypt(text, password);
      const decrypted = await crypto.decrypt(encrypted, password);
      expect(decrypted).toBe(text);
    });
  });

  describe('generatePassword', () => {
    it('should generate password with default length', () => {
      const password = crypto.generatePassword();
      expect(password.length).toBe(24);
    });

    it('should generate password with custom length', () => {
      const password16 = crypto.generatePassword(16);
      const password32 = crypto.generatePassword(32);

      expect(password16.length).toBe(16);
      expect(password32.length).toBe(32);
    });

    it('should include various character types', () => {
      const password = crypto.generatePassword(100);

      expect(/[a-z]/.test(password)).toBe(true);
      expect(/[A-Z]/.test(password)).toBe(true);
      expect(/[0-9]/.test(password)).toBe(true);
      expect(/[!@#$%^&*()_+\-=]/.test(password)).toBe(true);
    });

    it('should generate unique passwords', () => {
      const passwords = new Set<string>();
      for (let i = 0; i < 100; i++) {
        passwords.add(crypto.generatePassword());
      }
      expect(passwords.size).toBe(100);
    });
  });

  describe('calculatePasswordStrength', () => {
    it('should return weak for empty password', () => {
      const result = crypto.calculatePasswordStrength('');
      expect(result.level).toBe('weak');
      expect(result.score).toBe(0);
    });

    it('should return weak for short password', () => {
      const result = crypto.calculatePasswordStrength('abc');
      expect(result.level).toBe('weak');
    });

    it('should return medium for mixed characters', () => {
      const result = crypto.calculatePasswordStrength('Password123');
      expect(result.level).toBe('medium');
      expect(result.score).toBeGreaterThan(40);
    });

    it('should return strong for complex password', () => {
      const result = crypto.calculatePasswordStrength('MyP@ssw0rd!2024');
      expect(result.level).toBe('strong');
      expect(result.score).toBeGreaterThanOrEqual(70);
    });

    it('should calculate high crack time for strong passwords', () => {
      const result = crypto.calculatePasswordStrength('VeryLongAndComplexPassword123!@#');
      expect(result.crackTime).toBeGreaterThan(3153600000n); // More than 100 years
    });

    it('should detect various character classes', () => {
      const lowercase = crypto.calculatePasswordStrength('abcdefghijklmnop');
      const mixed = crypto.calculatePasswordStrength('ABCDEFGHIJKLMNOPabcdefghi');
      const withNumbers = crypto.calculatePasswordStrength('ABCDEFGHIJKLMNOP12345');
      const withSpecial = crypto.calculatePasswordStrength('ABCDEFGHIJKLMNOP!@#$%');

      expect(mixed.score).toBeGreaterThan(lowercase.score);
      expect(withNumbers.score).toBeGreaterThan(lowercase.score);
      expect(withSpecial.score).toBeGreaterThan(lowercase.score);
    });
  });

  describe('encryptFile & decryptFile', () => {
    it('should encrypt and decrypt a file', async () => {
      const content = 'Test file content';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const password = 'FilePassword123!';

      const encryptedBlob = await crypto.encryptFile(file, password);
      expect(encryptedBlob).toBeInstanceOf(Blob);

      const decrypted = await crypto.decryptFile(encryptedBlob, password, 'test.txt');
      expect(decrypted.filename).toBe('test.txt');

      const text = await decrypted.blob.text();
      expect(text).toBe(content);
    });

    it('should throw error for wrong password on file', async () => {
      const content = 'Test file content';
      const file = new File([content], 'test.txt', { type: 'text/plain' });
      const password = 'CorrectPassword';
      const wrongPassword = 'WrongPassword';

      const encryptedBlob = await crypto.encryptFile(file, password);

      await expect(
        crypto.decryptFile(encryptedBlob, wrongPassword, 'test.txt')
      ).rejects.toThrow(CryptoError);
    });
  });
});
