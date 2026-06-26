/**
 * @fileoverview Unit Tests for CryptoModule
 * @version 5.0.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CryptoModule, CryptoError } from '../../src/core/crypto';

// Mock Web Crypto API
const mockCrypto = {
  subtle: {
    importKey: vi.fn(),
    deriveKey: vi.fn(),
    encrypt: vi.fn(),
    decrypt: vi.fn(),
  },
  getRandomValues: vi.fn((arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = i;
    }
    return arr;
  }),
};

describe('CryptoModule', () => {
  let crypto: CryptoModule;

  beforeEach(() => {
    crypto = new CryptoModule();
    Object.defineProperty(global, 'crypto', {
      value: mockCrypto,
      writable: true,
    });
    vi.clearAllMocks();
  });

  describe('generatePassword', () => {
    it('should generate a password of specified length', () => {
      const password = crypto.generatePassword(24);
      expect(password).toHaveLength(24);
    });

    it('should generate different passwords each time', () => {
      const password1 = crypto.generatePassword(24);
      const password2 = crypto.generatePassword(24);
      expect(password1).not.toBe(password2);
    });

    it('should include special characters', () => {
      const password = crypto.generatePassword(100);
      expect(password).toMatch(/[!@#$%^&*()_+\-=]/);
    });

    it('should include uppercase letters', () => {
      const password = crypto.generatePassword(100);
      expect(password).toMatch(/[A-Z]/);
    });

    it('should include lowercase letters', () => {
      const password = crypto.generatePassword(100);
      expect(password).toMatch(/[a-z]/);
    });

    it('should include numbers', () => {
      const password = crypto.generatePassword(100);
      expect(password).toMatch(/[0-9]/);
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

    it('should return medium for moderate password', () => {
      const result = crypto.calculatePasswordStrength('Password123');
      expect(result.level).toBe('medium');
    });

    it('should return strong for complex password', () => {
      const result = crypto.calculatePasswordStrength('MyStr0ng!Pass@Word#2024');
      expect(result.level).toBe('strong');
    });

    it('should calculate high score for long passwords', () => {
      const result = crypto.calculatePasswordStrength('a'.repeat(20));
      expect(result.score).toBeGreaterThan(50);
    });

    it('should increase score for uppercase', () => {
      const lower = crypto.calculatePasswordStrength('password');
      const upper = crypto.calculatePasswordStrength('PASSWORD');
      expect(upper.score).toBeGreaterThan(lower.score);
    });

    it('should increase score for numbers', () => {
      const noNums = crypto.calculatePasswordStrength('password');
      const withNums = crypto.calculatePasswordStrength('password123');
      expect(withNums.score).toBeGreaterThan(noNums.score);
    });

    it('should increase score for special characters', () => {
      const noSpecial = crypto.calculatePasswordStrength('Password123');
      const withSpecial = crypto.calculatePasswordStrength('Password123!');
      expect(withSpecial.score).toBeGreaterThan(noSpecial.score);
    });
  });
});
