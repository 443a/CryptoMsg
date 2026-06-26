/**
 * @fileoverview CryptoMsg Core - State Manager
 * @version 5.0.0
 * @license MIT
 */

import type { AppMode, Language, Theme } from '../types';

/**
 * Internal state shape
 */
interface StateShape {
  currentMode: AppMode;
  currentLang: Language;
  currentTheme: Theme;
  clipboardTimer: ReturnType<typeof setTimeout> | null;
  autoClearEnabled: boolean;
  isProcessing: boolean;
}

// ==========================================
// STORAGE KEYS
// ==========================================

const STORAGE_KEYS = {
  THEME: 'cryptomsg-theme',
  LANGUAGE: 'cryptomsg-lang',
  AUTO_CLEAR: 'cryptomsg-auto-clear',
  HISTORY: 'cryptomsg-history',
} as const;

// ==========================================
// STATE MANAGER
// ==========================================

class StateManagerClass {
  private state: StateShape;

  constructor() {
    this.state = {
      currentMode: 'encrypt',
      currentLang: this.loadLanguage(),
      currentTheme: this.loadTheme(),
      clipboardTimer: null,
      autoClearEnabled: this.loadAutoClear(),
      isProcessing: false,
    };
  }

  // ==========================================
  // PERSISTENCE
  // ==========================================

  private loadTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return 'dark';
  }

  private loadLanguage(): Language {
    const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (stored === 'fa' || stored === 'en') {
      return stored;
    }
    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('fa') || browserLang.startsWith('ar')) {
      return 'fa';
    }
    return 'en';
  }

  private loadAutoClear(): boolean {
    return localStorage.getItem(STORAGE_KEYS.AUTO_CLEAR) === 'true';
  }

  // ==========================================
  // GETTERS
  // ==========================================

  get theme(): Theme {
    return this.state.currentTheme;
  }

  get language(): Language {
    return this.state.currentLang;
  }

  get mode(): AppMode {
    return this.state.currentMode;
  }

  get autoClear(): boolean {
    return this.state.autoClearEnabled;
  }

  get isProcessing(): boolean {
    return this.state.isProcessing;
  }

  // ==========================================
  // SETTERS
  // ==========================================

  setTheme(theme: Theme): void {
    this.state.currentTheme = theme;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  setLanguage(lang: Language): void {
    this.state.currentLang = lang;
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }

  setMode(mode: AppMode): void {
    this.state.currentMode = mode;
  }

  setAutoClear(enabled: boolean): void {
    this.state.autoClearEnabled = enabled;
    localStorage.setItem(STORAGE_KEYS.AUTO_CLEAR, String(enabled));
  }

  setProcessing(processing: boolean): void {
    this.state.isProcessing = processing;
  }

  // ==========================================
  // TOGGLE METHODS
  // ==========================================

  toggleTheme(): Theme {
    const newTheme = this.state.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  }

  toggleLanguage(): Language {
    const newLang = this.state.currentLang === 'fa' ? 'en' : 'fa';
    this.setLanguage(newLang);
    return newLang;
  }

  toggleMode(): AppMode {
    const newMode = this.state.currentMode === 'encrypt' ? 'decrypt' : 'encrypt';
    this.state.currentMode = newMode;
    return newMode;
  }

  // ==========================================
  // HISTORY MANAGEMENT
  // ==========================================

  getHistory(): string | null {
    return localStorage.getItem(STORAGE_KEYS.HISTORY);
  }

  setHistory(data: string): void {
    localStorage.setItem(STORAGE_KEYS.HISTORY, data);
  }

  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }

  // ==========================================
  // EXPORT/IMPORT
  // ==========================================

  exportSettings(): object {
    return {
      theme: this.state.currentTheme,
      language: this.state.currentLang,
      autoClear: this.state.autoClearEnabled,
    };
  }

  importSettings(settings: Partial<{ theme: Theme; language: Language; autoClear: boolean }>): void {
    if (settings.theme) this.setTheme(settings.theme);
    if (settings.language) this.setLanguage(settings.language);
    if (typeof settings.autoClear === 'boolean') this.setAutoClear(settings.autoClear);
  }

  // ==========================================
  // RESET
  // ==========================================

  reset(): void {
    this.state = {
      currentMode: 'encrypt',
      currentLang: 'fa',
      currentTheme: 'dark',
      clipboardTimer: null,
      autoClearEnabled: false,
      isProcessing: false,
    };
    this.setTheme('dark');
    this.setLanguage('fa');
    this.setAutoClear(false);
  }
}

// ==========================================
// EXPORTS
// ==========================================

export const AppState = new StateManagerClass();
export { STORAGE_KEYS };
export type { StateManagerClass as StateManager };
