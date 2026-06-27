/**
 * @fileoverview CryptoMsg - Encoding Tests
 * @version 5.0.0
 */

import { describe, it, expect } from 'vitest';
import { Encoding, EncodingError, EncodingModule } from '../src/core/encoding';

describe('EncodingModule', () => {
  describe('hasInvisibleChars', () => {
    it('should detect zero-width characters', () => {
      expect(Encoding.hasInvisibleChars('test‌text')).toBe(true); // ZWSP
      expect(Encoding.hasInvisibleChars('test‍text')).toBe(true); // ZWNJ
      expect(Encoding.hasInvisibleChars('test﻿text')).toBe(true); // BOM
      expect(Encoding.hasInvisibleChars('test⁠text')).toBe(true); // word joiner
    });

    it('should return false for plain text', () => {
      expect(Encoding.hasInvisibleChars('Hello World')).toBe(false);
      expect(Encoding.hasInvisibleChars('')).toBe(false);
    });
  });

  describe('looksLikeV4JSON', () => {
    it('should detect v4 JSON format', () => {
      // v4 format starts with eyJ (base64 of {)
      expect(Encoding.looksLikeV4JSON('eyJzIjoiYWJjIn0=')).toBe(true); // {"s":"abc"}
    });

    it('should reject non-v4 format', () => {
      expect(Encoding.looksLikeV4JSON('Hello')).toBe(false);
      expect(Encoding.looksLikeV4JSON('eyJzIjoiYWJj')).toBe(false); // invalid base64
    });
  });

  describe('textToInvisible / invisibleToText', () => {
    it('should encode and decode invisible text', () => {
      const base64 = 'SGVsbG8=';
      const cover = 'Test';

      const invisible = Encoding.textToInvisible(base64, cover);
      // The encoded text should have different length
      expect(invisible.length).toBeGreaterThan(cover.length);

      const extracted = Encoding.invisibleToText(invisible);
      expect(extracted).toBe(base64);
    });

    it('should handle empty inputs', () => {
      const result = Encoding.textToInvisible('', 'test');
      expect(result).toBe('test');
    });
  });

  describe('mapToDictionary / mapFromDictionary', () => {
    it('should map base64 to farsiChars and back', () => {
      const base64 = 'SGVsbG8=';
      const encoded = Encoding.mapToDictionary(base64, 'farsiChars');
      expect(encoded).toBeTruthy();
      expect(encoded).not.toBe(base64);

      const decoded = Encoding.mapFromDictionary(encoded, 'farsiChars');
      expect(decoded).toBe(base64);
    });

    it('should handle emoji mode encoding', () => {
      const base64 = 'QUJD'; // ABC in base64
      const encoded = Encoding.mapToDictionary(base64, 'emoji');
      expect(encoded).toBeTruthy();
      expect(encoded.length).toBeGreaterThan(0);

      const decoded = Encoding.mapFromDictionary(encoded, 'emoji');
      expect(decoded).toBe(base64);
    });

    it('should handle farsiWords mode', () => {
      const base64 = 'YWJj';
      const encoded = Encoding.mapToDictionary(base64, 'farsiWords');
      expect(encoded).toContain(' '); // Word-based uses spaces

      const decoded = Encoding.mapFromDictionary(encoded, 'farsiWords');
      expect(decoded).toBe(base64);
    });

    it('should handle englishFake mode', () => {
      const base64 = 'YWJj';
      const encoded = Encoding.mapToDictionary(base64, 'englishFake');
      expect(encoded).toContain(' '); // Word-based uses spaces

      const decoded = Encoding.mapFromDictionary(encoded, 'englishFake');
      expect(decoded).toBe(base64);
    });

    it('should handle russian mode', () => {
      const base64 = 'YWJj';
      const encoded = Encoding.mapToDictionary(base64, 'russian');
      expect(encoded).toBeTruthy();

      const decoded = Encoding.mapFromDictionary(encoded, 'russian');
      expect(decoded).toBe(base64);
    });

    it('should handle chinese mode', () => {
      const base64 = 'YWJj';
      const encoded = Encoding.mapToDictionary(base64, 'chinese');
      expect(encoded).toBeTruthy();

      const decoded = Encoding.mapFromDictionary(encoded, 'chinese');
      expect(decoded).toBe(base64);
    });

    it('should throw for unknown mode in mapToDictionary', () => {
      expect(() => Encoding.mapToDictionary('test', 'invalid' as never)).toThrow();
    });

    it('should throw for unknown mode in mapFromDictionary', () => {
      expect(() => Encoding.mapFromDictionary('test', 'invalid' as never)).toThrow();
    });
  });

  describe('detectMode', () => {
    it('should detect farsiWords', () => {
      const result = Encoding.detectMode('آسمان سیب');
      expect(result).toBe('farsiWords');
    });

    it('should detect englishFake', () => {
      const result = Encoding.detectMode('Apple Banana');
      expect(result).toBe('englishFake');
    });

    it('should default to farsiChars for unknown text', () => {
      const result = Encoding.detectMode('abc');
      expect(result).toBe('farsiChars');
    });
  });

  describe('getAvailableMethods', () => {
    it('should return all methods', () => {
      const methods = Encoding.getAvailableMethods();
      expect(methods).toHaveLength(8);
      expect(methods.map(m => m.value)).toContain('base64');
      expect(methods.map(m => m.value)).toContain('farsiChars');
      expect(methods.map(m => m.value)).toContain('farsiWords');
      expect(methods.map(m => m.value)).toContain('invisible');
      expect(methods.map(m => m.value)).toContain('russian');
      expect(methods.map(m => m.value)).toContain('emoji');
      expect(methods.map(m => m.value)).toContain('chinese');
      expect(methods.map(m => m.value)).toContain('englishFake');
    });
  });

  describe('getMethodDescription', () => {
    it('should return description for base64', () => {
      const desc = Encoding.getMethodDescription('base64');
      expect(desc.text).toBeTruthy();
      expect(desc.warn).toBe('');
    });

    it('should return warning for invisible', () => {
      const desc = Encoding.getMethodDescription('invisible');
      expect(desc.warn).toBeTruthy();
    });

    it('should return warning for farsiWords', () => {
      const desc = Encoding.getMethodDescription('farsiWords');
      expect(desc.warn).toBeTruthy();
    });
  });

  describe('EncodingError', () => {
    it('should have correct name and code', () => {
      const error = new EncodingError('Test error', 'TEST_CODE');
      expect(error.name).toBe('EncodingError');
      expect(error.code).toBe('TEST_CODE');
      expect(error.message).toBe('Test error');
    });
  });
});
