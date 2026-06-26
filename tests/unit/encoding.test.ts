/**
 * @fileoverview Unit Tests for EncodingModule
 * @version 5.0.0
 */

import { describe, it, expect } from 'vitest';
import { EncodingModule, EncodingError } from '../../src/core/encoding';

describe('EncodingModule', () => {
  let encoding: EncodingModule;

  beforeEach(() => {
    encoding = new EncodingModule();
  });

  describe('hasInvisibleChars', () => {
    it('should return true for text with zero-width characters', () => {
      const textWithZeros = 'hello‌world';
      expect(encoding.hasInvisibleChars(textWithZeros)).toBe(true);
    });

    it('should return false for normal text', () => {
      expect(encoding.hasInvisibleChars('hello world')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(encoding.hasInvisibleChars('')).toBe(false);
    });
  });

  describe('looksLikeV4JSON', () => {
    it('should return true for valid base64 encoded JSON', () => {
      // This is base64 of '{"test":"value"}'
      const validBase64 = 'eyJ0ZXN0IjoidmFsdWUifQ==';
      expect(encoding.looksLikeV4JSON(validBase64)).toBe(true);
    });

    it('should return false for non-base64 text', () => {
      expect(encoding.looksLikeV4JSON('not base64')).toBe(false);
    });

    it('should return false for text not starting with ey', () => {
      expect(encoding.looksLikeV4JSON('abc123')).toBe(false);
    });
  });

  describe('textToInvisible / invisibleToText', () => {
    it('should encode and decode correctly', () => {
      const original = 'Hello World';
      const base64 = btoa(original);
      const invisible = encoding.textToInvisible(base64, 'Hello cover text');
      const decoded = encoding.invisibleToText(invisible);
      expect(decoded).toBe(base64);
    });

    it('should produce text with zero-width characters', () => {
      const invisible = encoding.textToInvisible('SGVsbG8=', 'Test');
      expect(encoding.hasInvisibleChars(invisible)).toBe(true);
    });
  });

  describe('mapToDictionary', () => {
    it('should map base64 to farsiChars', () => {
      const base64 = 'SGVsbG8=';
      const result = encoding.mapToDictionary(base64, 'farsiChars');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should map base64 to emoji', () => {
      const base64 = 'SGVsbG8=';
      const result = encoding.mapToDictionary(base64, 'emoji');
      expect(result).toBeTruthy();
    });

    it('should throw for unknown mode', () => {
      expect(() => {
        encoding.mapToDictionary('SGVsbG8=', 'invalidMode' as any);
      }).toThrow();
    });
  });

  describe('mapFromDictionary', () => {
    it('should convert farsi chars back to base64', () => {
      // First encode to get the farsi representation
      const base64 = 'SGVsbG8=';
      const farsi = encoding.mapToDictionary(base64, 'farsiChars');
      // Then decode
      const decoded = encoding.mapFromDictionary(farsi, 'farsiChars');
      expect(decoded).toBe(base64);
    });

    it('should add padding when needed', () => {
      // Test that padding is added correctly
      const text = 'ا'; // Single farsi char
      const decoded = encoding.mapFromDictionary(text, 'farsiChars');
      expect(decoded.length % 4).toBe(0);
    });
  });

  describe('detectMode', () => {
    it('should detect farsiWords', () => {
      expect(encoding.detectMode('آسمان درخت')).toBe('farsiWords');
    });

    it('should detect englishFake', () => {
      expect(encoding.detectMode('Action Bridge Cloud')).toBe('englishFake');
    });

    it('should detect emoji', () => {
      expect(encoding.detectMode('😀😃😄')).toBe('emoji');
    });

    it('should default to farsiChars', () => {
      expect(encoding.detectMode('ا')).toBe('farsiChars');
    });
  });

  describe('getAvailableMethods', () => {
    it('should return array of methods', () => {
      const methods = encoding.getAvailableMethods();
      expect(Array.isArray(methods)).toBe(true);
      expect(methods.length).toBe(8);
    });

    it('should have correct structure', () => {
      const methods = encoding.getAvailableMethods();
      methods.forEach((method) => {
        expect(method).toHaveProperty('value');
        expect(method).toHaveProperty('label');
      });
    });
  });

  describe('getMethodDescription', () => {
    it('should return description for base64', () => {
      const desc = encoding.getMethodDescription('base64');
      expect(desc).toHaveProperty('text');
      expect(desc).toHaveProperty('warn');
    });

    it('should return warning for invisible mode', () => {
      const desc = encoding.getMethodDescription('invisible');
      expect(desc.warn).toBeTruthy();
    });
  });
});
