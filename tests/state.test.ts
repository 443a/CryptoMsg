/**
 * @fileoverview CryptoMsg - State Tests
 * @version 5.0.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AppState } from '../src/core/state';

describe('AppState', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset state
    AppState.reset();
  });

  describe('theme', () => {
    it('should default to dark theme', () => {
      expect(AppState.theme).toBe('dark');
    });

    it('should allow setting theme', () => {
      AppState.setTheme('light');
      expect(AppState.theme).toBe('light');
    });

    it('should toggle theme', () => {
      expect(AppState.theme).toBe('dark');
      AppState.toggleTheme();
      expect(AppState.theme).toBe('light');
      AppState.toggleTheme();
      expect(AppState.theme).toBe('dark');
    });

    it('should persist theme to localStorage', () => {
      AppState.setTheme('light');
      expect(localStorage.getItem('cryptomsg-theme')).toBe('light');
    });
  });

  describe('language', () => {
    it('should default to fa (Persian)', () => {
      expect(AppState.language).toBe('fa');
    });

    it('should allow setting language', () => {
      AppState.setLanguage('en');
      expect(AppState.language).toBe('en');
    });

    it('should toggle language', () => {
      AppState.setLanguage('fa');
      expect(AppState.language).toBe('fa');
      AppState.toggleLanguage();
      expect(AppState.language).toBe('en');
    });

    it('should persist language to localStorage', () => {
      AppState.setLanguage('en');
      expect(localStorage.getItem('cryptomsg-lang')).toBe('en');
    });
  });

  describe('mode', () => {
    it('should default to encrypt mode', () => {
      expect(AppState.mode).toBe('encrypt');
    });

    it('should allow setting mode', () => {
      AppState.setMode('decrypt');
      expect(AppState.mode).toBe('decrypt');
    });

    it('should toggle mode', () => {
      expect(AppState.mode).toBe('encrypt');
      AppState.toggleMode();
      expect(AppState.mode).toBe('decrypt');
      AppState.toggleMode();
      expect(AppState.mode).toBe('encrypt');
    });
  });

  describe('autoClear', () => {
    it('should default to false', () => {
      expect(AppState.autoClear).toBe(false);
    });

    it('should allow setting autoClear', () => {
      AppState.setAutoClear(true);
      expect(AppState.autoClear).toBe(true);
    });

    it('should persist autoClear to localStorage', () => {
      AppState.setAutoClear(true);
      expect(localStorage.getItem('cryptomsg-auto-clear')).toBe('true');
    });
  });

  describe('isProcessing', () => {
    it('should default to false', () => {
      expect(AppState.isProcessing).toBe(false);
    });

    it('should allow setting processing state', () => {
      AppState.setProcessing(true);
      expect(AppState.isProcessing).toBe(true);
      AppState.setProcessing(false);
      expect(AppState.isProcessing).toBe(false);
    });
  });

  describe('history', () => {
    it('should get and set history', () => {
      const testData = 'test-history-data';
      AppState.setHistory(testData);
      expect(AppState.getHistory()).toBe(testData);
    });

    it('should clear history', () => {
      AppState.setHistory('some-data');
      AppState.clearHistory();
      expect(AppState.getHistory()).toBeNull();
    });
  });

  describe('exportSettings', () => {
    it('should export current settings', () => {
      AppState.setTheme('light');
      AppState.setLanguage('en');
      AppState.setAutoClear(true);

      const settings = AppState.exportSettings();
      expect(settings).toEqual({
        theme: 'light',
        language: 'en',
        autoClear: true,
      });
    });
  });

  describe('importSettings', () => {
    it('should import settings', () => {
      AppState.importSettings({
        theme: 'light',
        language: 'en',
        autoClear: true,
      });

      expect(AppState.theme).toBe('light');
      expect(AppState.language).toBe('en');
      expect(AppState.autoClear).toBe(true);
    });

    it('should handle partial settings', () => {
      AppState.importSettings({
        theme: 'light',
      });

      expect(AppState.theme).toBe('light');
      // Other settings should remain at defaults
      expect(AppState.language).toBe('fa');
      expect(AppState.autoClear).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset all state to defaults', () => {
      // Change all settings
      AppState.setTheme('light');
      AppState.setLanguage('en');
      AppState.setAutoClear(true);
      AppState.setMode('decrypt');
      AppState.setProcessing(true);
      AppState.setHistory('test');

      // Reset
      AppState.reset();

      // Verify defaults
      expect(AppState.theme).toBe('dark');
      expect(AppState.language).toBe('fa');
      expect(AppState.autoClear).toBe(false);
      expect(AppState.mode).toBe('encrypt');
      expect(AppState.isProcessing).toBe(false);
      expect(AppState.getHistory()).toBeNull();
    });
  });
});