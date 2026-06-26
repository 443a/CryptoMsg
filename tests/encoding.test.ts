/**
 * @fileoverview CryptoMsg - Unit Tests for Encoding Module
 * @version 5.0.0
 */

import { describe, it, expect } from 'vitest';
import { EncodingModule, EncodingError } from '../src/core/encoding';

describe('EncodingModule', () => {
  describe('textToInvisible & invisibleToText', () => {
    it('should encode and decode text using invisible characters', () => {
      const base64 = 'SGVsbG8gV29ybGQ=';
      const cover = 'سلام چطوری؟';

      const invisible = EncodingModule.textToInvisible(base64, cover);
      expect(invisible).toContain(cover);

      const decoded = EncodingModule.invisibleToText(invisible);
      expect(decoded).toBe(base64);
    });

    it('should throw error for text without invisible chars', () => {
      const text = 'Just normal text';
      expect(() => EncodingModule.invisibleToText(text)).toThrow(EncodingError);
    });

    it('should handle empty cover text', () => {
      const base64 = 'TEST';
      const invisible = EncodingModule.textToInvisible(base64, '');
      const decoded = EncodingModule.invisibleToText(invisible);
      expect(decoded).toBe(base64);
    });
  });

  describe('mapToDictionary', () => {
    it('should map Base64 to Persian characters', () => {
      const base64 = 'SGVsbG8';
      const result = EncodingModule.mapToDictionary(base64, 'farsiChars');
      expect(result.length).toBeGreaterThan(0);
      expect(result).not.toContain('S');
      expect(result).not.toContain('H');
    });

    it('should map Base64 to Russian characters', () => {
      const base64 = 'SGVsbG8';
      const result = EncodingModule.mapToDictionary(base64, 'russian');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should map Base64 to Emoji', () => {
      const base64 = 'SGVsbG8';
      const result = EncodingModule.mapToDictionary(base64, 'emoji');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should map Base64 to Chinese characters', () => {
      const base64 = 'SGVsbG8';
      const result = EncodingModule.mapToDictionary(base64, 'chinese');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should map Base64 to English fake words', () => {
      const base64 = 'SGVsbG8';
      const result = EncodingModule.mapToDictionary(base64, 'englishFake');
      const words = result.split(' ');
      expect(words.length).toBeGreaterThan(0);
    });

    it('should map Base64 to Persian words', () => {
      const base64 = 'SGVsbG8';
      const result = EncodingModule.mapToDictionary(base64, 'farsiWords');
      const words = result.split(' ');
      expect(words.length).toBeGreaterThan(0);
    });

    it('should return Base64 as-is for base64 mode', () => {
      const base64 = 'SGVsbG8=';
      const result = EncodingModule.mapToDictionary(base64, 'base64');
      expect(result).toBe(base64);
    });
  });

  describe('mapFromDictionary', () => {
    it('should reverse Persian characters to Base64', () => {
      const base64 = 'SGVsbG8';
      const encoded = EncodingModule.mapToDictionary(base64, 'farsiChars');
      const decoded = EncodingModule.mapFromDictionary(encoded, 'farsiChars');
      expect(decoded).toBe(base64);
    });

    it('should reverse Russian characters to Base64', () => {
      const base64 = 'SGVsbG8';
      const encoded = EncodingModule.mapToDictionary(base64, 'russian');
      const decoded = EncodingModule.mapFromDictionary(encoded, 'russian');
      expect(decoded).toBe(base64);
    });

    it('should reverse Emoji to Base64', () => {
      const base64 = 'SGVsbG8';
      const encoded = EncodingModule.mapToDictionary(base64, 'emoji');
      const decoded = EncodingModule.mapFromDictionary(encoded, 'emoji');
      expect(decoded).toBe(base64);
    });

    it('should reverse Chinese to Base64', () => {
      const base64 = 'SGVsbG8';
      const encoded = EncodingModule.mapToDictionary(base64, 'chinese');
      const decoded = EncodingModule.mapFromDictionary(encoded, 'chinese');
      expect(decoded).toBe(base64);
    });

    it('should handle Base64 mode', () => {
      const base64 = 'SGVsbG8=';
      const decoded = EncodingModule.mapFromDictionary(base64, 'base64');
      expect(decoded).toBe(base64);
    });
  });

  describe('detectMode', () => {
    it('should detect farsiWords mode', () => {
      const text = 'آسمان درخت سیب';
      const mode = EncodingModule.detectMode(text);
      expect(mode).toBe('farsiWords');
    });

    it('should detect englishFake mode', () => {
      const text = 'Apple Bridge Cloud';
      const mode = EncodingModule.detectMode(text);
      expect(mode).toBe('englishFake');
    });

    it('should detect emoji mode', () => {
      const text = '😀😃😄😁';
      const mode = EncodingModule.detectMode(text);
      expect(mode).toBe('emoji');
    });

    it('should default to farsiChars', () => {
      const text = 'اپتابپتث';
      const mode = EncodingModule.detectMode(text);
      expect(mode).toBe('farsiChars');
    });
  });

  describe('hasInvisibleChars', () => {
    it('should return true for text with invisible chars', () => {
      const text = 'Hello‌‍world';
      expect(EncodingModule.hasInvisibleChars(text)).toBe(true);
    });

    it('should return false for text without invisible chars', () => {
      const text = 'Hello World';
      expect(EncodingModule.hasInvisibleChars(text)).toBe(false);
    });
  });

  describe('looksLikeV4JSON', () => {
    it('should return true for Base64 encoded JSON', () => {
      const text = btoa(JSON.stringify({ test: true }));
      expect(EncodingModule.looksLikeV4JSON(text)).toBe(true);
    });

    it('should return false for regular text', () => {
      const text = 'Hello World';
      expect(EncodingModule.looksLikeV4JSON(text)).toBe(false);
    });
  });

  describe('addRandomSpaces', () => {
    it('should add spaces to text', () => {
      const text = 'ABCDEFGHIJ';
      const result = EncodingModule.addRandomSpaces(text);
      expect(result).not.toBe(text);
      expect(result.length).toBeGreaterThan(text.length);
    });

    it('should preserve original characters', () => {
      const text = 'HELLO';
      const result = EncodingModule.addRandomSpaces(text);
      for (const char of text) {
        expect(result).toContain(char);
      }
    });
  });
});
