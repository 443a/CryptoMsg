/**
 * @fileoverview Type definitions for CryptoMsg
 * @version 5.0.0
 */

/**
 * Encoding methods available for message transformation
 */
export type EncodingMethod =
  | 'base64'
  | 'farsiChars'
  | 'farsiWords'
  | 'invisible'
  | 'russian'
  | 'emoji'
  | 'chinese'
  | 'englishFake';

/**
 * Application mode (encrypt or decrypt)
 */
export type AppMode = 'encrypt' | 'decrypt';

/**
 * Theme types
 */
export type Theme = 'dark' | 'light';

/**
 * Supported languages
 */
export type Language = 'fa' | 'en';

/**
 * Encrypted data structure
 */
export interface EncryptedData {
  /** Base64 encoded salt */
  s: string;
  /** Base64 encoded IV */
  i: string;
  /** Base64 encoded ciphertext */
  c: string;
}

/**
 * Packed encrypted data (Base64 encoded JSON)
 */
export interface PackedEncryptedData {
  /** Raw encrypted string */
  data: string;
}

/**
 * Crypto configuration
 */
export interface CryptoConfig {
  iterations: number;
  keyLength: 256;
  saltLength: 16;
  ivLength: 12;
  algorithm: 'AES-GCM';
  hash: 'SHA-256';
}

/**
 * Password strength result
 */
export interface PasswordStrength {
  score: number;
  level: 'weak' | 'medium' | 'strong';
  crackTime: bigint;
  crackTimeText: string;
}

/**
 * Message history entry
 */
export interface MessageHistoryEntry {
  id: string;
  timestamp: number;
  mode: AppMode;
  method: EncodingMethod;
  content: string;
  preview: string;
  charCount: number;
}

/**
 * Application state
 */
export interface AppState {
  currentMode: AppMode;
  currentLang: Language;
  currentTheme: Theme;
  clipboardTimer: ReturnType<typeof setTimeout> | null;
  autoClearEnabled: boolean;
  isProcessing: boolean;
}

/**
 * Translation strings interface
 */
export interface TranslationStrings {
  [key: string]: string;
}

/**
 * Translations object
 */
export interface Translations {
  fa: TranslationStrings;
  en: TranslationStrings;
}

/**
 * Method details for UI
 */
export interface MethodDetails {
  text: string;
  warn: string;
}

/**
 * Method details map
 */
export interface MethodDetailsMap {
  [key in EncodingMethod]: MethodDetails;
}

/**
 * Dictionary type
 */
export interface Dictionary {
  base64: string[];
  farsiChars: string[];
  farsiWords: string[];
  russian: string[];
  emoji: string[];
  chinese: string[];
  englishFake: string[];
}

/**
 * Zero-width characters for steganography
 */
export type ZeroWidthChar = '‌' | '‍' | '﻿' | '⁠';

/**
 * Processing result
 */
export interface ProcessingResult {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * Copy result
 */
export interface CopyResult {
  success: boolean;
  message: string;
}

/**
 * PWA Install prompt event
 */
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * Service Worker registration
 */
export interface ServiceWorkerRegistration {
  // Standard ServiceWorkerRegistration properties
}

/**
 * File encryption result
 */
export interface FileEncryptionResult {
  success: boolean;
  blob?: Blob;
  filename?: string;
  error?: string;
}

/**
 * QR Code generation options
 */
export interface QRCodeOptions {
  width: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
}

/**
 * History filter options
 */
export interface HistoryFilter {
  mode?: AppMode;
  method?: EncodingMethod;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

/**
 * Export/Import data format
 */
export interface ExportData {
  version: string;
  timestamp: number;
  history: MessageHistoryEntry[];
  settings: {
    theme: Theme;
    language: Language;
    autoClear: boolean;
  };
}
