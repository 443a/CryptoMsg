/**
 * @fileoverview CryptoMsg UI Module
 * @version 5.0.0
 * @license MIT
 */

import type { EncodingMethod, AppMode, BeforeInstallPromptEvent } from '../types';
import { Crypto, CryptoError } from '../core/crypto';
import { Encoding, EncodingError } from '../core/encoding';
import { FileVault, MAX_FILE_SIZE_BYTES } from '../core/fileVault';
import { AppState } from '../core/state';
import { i18n } from '../i18n';
import { Clipboard, Storage } from '../services';
import { CryptoWorker } from '../services/cryptoWorker';

// ==========================================
// UI MODULE
// ==========================================

export class UIModule {
  // DOM Elements cache
  private elements: Map<string, HTMLElement | null> = new Map();

  // ==========================================
  // INITIALIZATION
  // ==========================================

  init(): void {
    this.cacheElements();
    this.initEventListeners();
    this.applyTheme(AppState.theme);
    this.updateUIText();
    this.initMethodInfo();
    this.initPWA();
    this.initKeyboardShortcuts();
  }

  private cacheElements(): void {
    const ids = [
      'tabEnc', 'tabDec', 'encSettings', 'encodingMode', 'methodDesc',
      'methodInfoBox', 'securityWarning', 'warningText', 'coverTextInput',
      'coverText', 'splitOutput', 'autoClearClipboard', 'inputText',
      'inputLabel', 'password', 'togglePassBtn', 'strengthFill',
      'strengthText', 'crackTimeText', 'smartSuggestion', 'suggestionText',
      'actionBtn', 'resultArea', 'charCount', 'smsCount', 'outputParts',
      'themeToggle', 'langToggle', 'versionBadge', 'installBtn',
      'fileVaultFile', 'fileVaultPassword', 'fileVaultEncryptBtn',
      'fileVaultDecryptBtn', 'fileVaultText', 'fileVaultOutput',
      'fileVaultCopyBtn', 'fileVaultStatus', 'fileVaultFileMeta'
    ];

    ids.forEach((id) => {
      this.elements.set(id, document.getElementById(id));
    });
  }

  private getElement(id: string): HTMLElement | null {
    return this.elements.get(id) ?? null;
  }

  private initEventListeners(): void {
    // Tabs
    this.getElement('tabEnc')?.addEventListener('click', () => this.setMode('encrypt'));
    this.getElement('tabDec')?.addEventListener('click', () => this.setMode('decrypt'));

    // Encoding mode
    this.getElement('encodingMode')?.addEventListener('change', () => this.updateMethodInfo());

    // Input
    this.getElement('inputText')?.addEventListener('input', () => this.analyzeInput());

    // Password
    this.getElement('password')?.addEventListener('input', () => this.checkPasswordStrength());
    this.getElement('togglePassBtn')?.addEventListener('click', () => this.togglePasswordVisibility());

    // Auto clear checkbox
    this.getElement('autoClearClipboard')?.addEventListener('change', (e) => {
      AppState.setAutoClear((e.target as HTMLInputElement).checked);
    });

    // Action button
    this.getElement('actionBtn')?.addEventListener('click', () => this.processAction());

    // Generate password (click on label)
    document.querySelector('.gen-pass-btn')?.addEventListener('click', () => this.generatePassword());

    // Theme toggle
    this.getElement('themeToggle')?.addEventListener('click', () => this.toggleTheme());

    // Language toggle
    this.getElement('langToggle')?.addEventListener('click', () => this.toggleLanguage());

    // Version badge
    this.getElement('versionBadge')?.addEventListener('click', () => this.updateApp());

    // File-to-text vault
    this.getElement('fileVaultFile')?.addEventListener('change', () => this.updateFileVaultMeta());
    this.getElement('fileVaultEncryptBtn')?.addEventListener('click', () => this.encryptSelectedFileToText());
    this.getElement('fileVaultDecryptBtn')?.addEventListener('click', () => this.decryptVaultTextToFile());
    this.getElement('fileVaultCopyBtn')?.addEventListener('click', () => this.copyFileVaultOutput());
  }

  // ==========================================
  // MODE MANAGEMENT
  // ==========================================

  setMode(mode: AppMode): void {
    AppState.setMode(mode);
    this.updateTabStyles();
    this.updateFormVisibility();
    this.updateButton();
    this.clearInput();
    this.hideResult();
  }

  private updateTabStyles(): void {
    const tabEnc = this.getElement('tabEnc');
    const tabDec = this.getElement('tabDec');

    if (AppState.mode === 'encrypt') {
      tabEnc?.classList.add('active', 'enc');
      tabEnc?.classList.remove('dec');
      tabDec?.classList.remove('active', 'dec');
    } else {
      tabDec?.classList.add('active', 'dec');
      tabDec?.classList.remove('enc');
      tabEnc?.classList.remove('active', 'enc');
    }
  }

  private updateFormVisibility(): void {
    const encSettings = this.getElement('encSettings');
    if (encSettings) {
      encSettings.style.display = AppState.mode === 'encrypt' ? 'block' : 'none';
    }
  }

  private updateButton(): void {
    const btn = this.getElement('actionBtn');
    const t = i18n.t.bind(i18n);
    if (btn) {
      if (AppState.mode === 'encrypt') {
        this.setButtonContent(btn, 'fas fa-lock', t('btnEncrypt'));
        btn.className = 'btn-main btn-enc';
      } else {
        this.setButtonContent(btn, 'fas fa-unlock', t('btnDecrypt'));
        btn.className = 'btn-main btn-dec';
      }
    }
  }

  private clearInput(): void {
    const inputText = this.getElement('inputText') as HTMLTextAreaElement;
    if (inputText) inputText.value = '';
  }

  // ==========================================
  // METHOD INFO
  // ==========================================

  initMethodInfo(): void {
    this.updateMethodInfo();
  }

  updateMethodInfo(): void {
    const mode = (this.getElement('encodingMode') as HTMLSelectElement)?.value as EncodingMethod;
    const desc = this.getElement('methodDesc');
    const warning = this.getElement('securityWarning');
    const warningText = this.getElement('warningText');
    const coverInput = this.getElement('coverTextInput');

    const info = i18n.getMethodDescription(mode);

    if (desc) desc.textContent = info.text;

    if (info.warn && warning && warningText) {
      warning.style.display = 'flex';
      warningText.textContent = info.warn;
    } else if (warning) {
      warning.style.display = 'none';
    }

    if (coverInput) {
      coverInput.style.display = mode === 'invisible' ? 'block' : 'none';
    }

    if ((this.getElement('inputText') as HTMLTextAreaElement)?.value) {
      this.analyzeInput();
    }
  }

  // ==========================================
  // SMART SUGGESTION
  // ==========================================

  analyzeInput(): void {
    const input = (this.getElement('inputText') as HTMLTextAreaElement)?.value;
    const suggestion = this.getElement('smartSuggestion');
    const suggestionText = this.getElement('suggestionText');

    if (AppState.mode !== 'encrypt' || !input || input.length < 2) {
      if (suggestion) suggestion.style.display = 'none';
      return;
    }

    if (suggestion && suggestionText) {
      suggestion.style.display = 'block';
      suggestionText.replaceChildren();

      if (input.length < 60) {
        suggestionText.append(
          `${i18n.t('smartShort')} `,
          this.createSuggestionTag(i18n.t('methodFarsiChars')),
          ` ${AppState.language === 'fa' ? 'یا' : 'or'} `,
          this.createSuggestionTag(i18n.t('methodEnglishFake')),
          '.'
        );
      } else if (input.length > 500) {
        suggestionText.textContent = i18n.t('smartLong');
      } else {
        suggestionText.append(
          `${i18n.t('smartSocial')} `,
          this.createSuggestionTag(i18n.t('methodInvisible')),
          ` ${i18n.t('smartAmazing')}`
        );
      }
    }
  }

  private createSuggestionTag(text: string): HTMLSpanElement {
    const tag = document.createElement('span');
    tag.className = 'suggestion-tag';
    tag.textContent = text;
    return tag;
  }

  // ==========================================
  // PASSWORD
  // ==========================================

  togglePasswordVisibility(): void {
    const input = this.getElement('password') as HTMLInputElement;
    const icon = this.getElement('togglePassBtn')?.querySelector('i');

    if (input && icon) {
      if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
      } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
      }
    }
  }

  checkPasswordStrength(): void {
    const password = (this.getElement('password') as HTMLInputElement)?.value;
    const strength = Crypto.calculatePasswordStrength(password);
    const fill = this.getElement('strengthFill');
    const text = this.getElement('strengthText');
    const crackTime = this.getElement('crackTimeText');
    const t = i18n.t.bind(i18n);

    if (!password) {
      if (fill) fill.style.width = '0%';
      if (text) {
        text.textContent = t('strengthNone');
        text.style.color = '';
      }
      if (crackTime) crackTime.textContent = '';
      return;
    }

    if (fill) {
      fill.style.width = `${strength.score}%`;
      fill.style.background = strength.level === 'weak' ? '#ef4444' :
                             strength.level === 'medium' ? '#f59e0b' : '#10b981';
    }

    if (text) {
      text.textContent = t(`strength${strength.level.charAt(0).toUpperCase() + strength.level.slice(1)}`);
      text.style.color = fill?.style.background ?? '';
    }

    if (crackTime) {
      crackTime.textContent = `${t('crackTimePrefix')}${strength.crackTimeText}`;
    }
  }

  generatePassword(): void {
    const password = Crypto.generatePassword(24);
    const input = this.getElement('password') as HTMLInputElement;
    if (input) {
      input.value = password;
      input.type = 'text';
      const icon = this.getElement('togglePassBtn')?.querySelector('i');
      if (icon) icon.className = 'fas fa-eye-slash';
      this.checkPasswordStrength();
    }
  }

  // ==========================================
  // MAIN PROCESSING
  // ==========================================

  async processAction(): Promise<void> {
    const inputValue = (this.getElement('inputText') as HTMLTextAreaElement)?.value ?? '';
    const inputText = AppState.mode === 'encrypt' ? inputValue : inputValue.trim();
    const password = (this.getElement('password') as HTMLInputElement)?.value;
    const mode = (this.getElement('encodingMode') as HTMLSelectElement)?.value as EncodingMethod;
    const cover = (this.getElement('coverText') as HTMLInputElement)?.value.trim() || 'سلام، پیام مخفی اینجاست.';

    if (!inputText || !password) {
      alert(i18n.t('errorEmptyFields'));
      return;
    }

    this.setLoading(true);

    try {
      if (AppState.mode === 'encrypt') {
        const encrypted = await CryptoWorker.encrypt(inputText, password);
        let result = '';

        switch (mode) {
          case 'invisible':
            result = Encoding.textToInvisible(encrypted, cover);
            break;
          case 'base64':
            result = encrypted;
            break;
          default:
            result = Encoding.mapToDictionary(encrypted, mode);
        }

        this.displayResult(result, mode);
        this.saveToHistory('encrypt', mode, result);
      } else {
        let base64Cipher = '';

        if (Encoding.hasInvisibleChars(inputText)) {
          base64Cipher = Encoding.invisibleToText(inputText);
        } else if (Encoding.looksLikeV4JSON(inputText)) {
          base64Cipher = inputText;
        } else {
          const detectedMode = Encoding.detectMode(inputText);
          base64Cipher = Encoding.mapFromDictionary(inputText, detectedMode);
        }

        const decrypted = await CryptoWorker.decrypt(base64Cipher, password);
        this.displayDecrypted(decrypted);
        this.saveToHistory('decrypt', 'base64', decrypted);
      }
    } catch (error) {
      if (error instanceof CryptoError) {
        if (error.code === 'LEGACY_VERSION') {
          alert(i18n.t('errorLegacyVersion'));
        } else {
          alert(i18n.t('errorDecryptFail'));
        }
      } else if (error instanceof EncodingError) {
        if (error.code === 'NO_INVISIBLE_CHARS') {
          alert(i18n.t('errorNoInvisibleChars'));
        }
      } else {
        alert(i18n.t('errorDecryptFail'));
      }
    } finally {
      this.setLoading(false);
    }
  }

  private setLoading(loading: boolean): void {
    const btn = this.getElement('actionBtn');
    AppState.setProcessing(loading);

    if (btn) {
      btn.toggleAttribute('disabled', loading);
      if (loading) {
        this.setButtonContent(btn, 'fas fa-spinner fa-spin', i18n.t('errorProcessing'));
      } else if (AppState.mode === 'encrypt') {
        this.setButtonContent(btn, 'fas fa-lock', i18n.t('btnEncrypt'));
      } else {
        this.setButtonContent(btn, 'fas fa-unlock', i18n.t('btnDecrypt'));
      }
    }
  }

  private setButtonContent(button: HTMLElement, iconClass: string, label: string): void {
    const icon = document.createElement('i');
    icon.className = iconClass;

    const text = document.createElement('span');
    text.textContent = label;

    button.replaceChildren(icon, text);
  }

  // ==========================================
  // RESULTS
  // ==========================================

  displayResult(text: string, mode: EncodingMethod): void {
    const resultArea = this.getElement('resultArea');
    const charCount = this.getElement('charCount');
    const smsCount = this.getElement('smsCount');
    const outputParts = this.getElement('outputParts');
    const splitOutput = this.getElement('splitOutput') as HTMLInputElement;

    const len = Array.from(text).length;
    const limit = mode === 'base64' || mode === 'englishFake' ? 160 : 70;
    const sms = Math.ceil(len / limit);

    if (charCount) charCount.textContent = String(len);
    if (smsCount) smsCount.textContent = String(sms);
    if (outputParts) outputParts.replaceChildren();

    const doSplit = splitOutput?.checked && len > (limit === 160 ? 300 : 500);
    const t = i18n.t.bind(i18n);

    if (doSplit) {
      const chars = Array.from(text);
      const splitSize = limit === 160 ? 300 : 500;
      let index = 0;

      while (index < chars.length) {
        const part = chars.slice(index, index + splitSize).join('');
        const smsStart = Math.ceil((index + 1) / limit);
        const smsEnd = Math.ceil((index + part.length) / limit);

        const partEl = this.createResultPart({
          text: part,
          buttonLabel: t('btnCopy'),
          partLabel: `${t('partLabel')} ${Math.floor(index / splitSize) + 1} (${smsStart}-${smsEnd})`,
        });
        outputParts?.appendChild(partEl);
        index += splitSize;
      }
    } else {
      const partEl = this.createResultPart({
        text,
        buttonLabel: t('btnCopyAll'),
      });
      outputParts?.appendChild(partEl);
    }

    if (resultArea) resultArea.style.display = 'block';
  }

  displayDecrypted(text: string): void {
    const resultArea = this.getElement('resultArea');
    const charCount = this.getElement('charCount');
    const smsCount = this.getElement('smsCount');
    const outputParts = this.getElement('outputParts');
    const t = i18n.t.bind(i18n);

    if (charCount) charCount.textContent = String(text.length);
    if (smsCount) smsCount.textContent = '-';

    if (outputParts) {
      outputParts.replaceChildren(this.createResultPart({
        text,
        buttonLabel: t('btnCopyAll'),
      }));
    }

    if (resultArea) resultArea.style.display = 'block';
  }

  private hideResult(): void {
    const resultArea = this.getElement('resultArea');
    if (resultArea) resultArea.style.display = 'none';
  }

  private createResultPart(options: {
    text: string;
    buttonLabel: string;
    partLabel?: string;
  }): HTMLElement {
    const partEl = document.createElement('div');
    partEl.className = 'result-part';

    if (options.partLabel) {
      const label = document.createElement('span');
      label.className = 'part-label';
      label.textContent = options.partLabel;
      partEl.appendChild(label);
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-btn';
    button.dataset.text = options.text;
    button.textContent = options.buttonLabel;
    partEl.appendChild(button);

    const resultText = document.createElement('div');
    resultText.className = 'result-text';
    resultText.textContent = options.text;
    partEl.appendChild(resultText);

    this.addCopyListener(button);
    return partEl;
  }

  private addCopyListener(btn: Element | null): void {
    if (!btn) return;

    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-text') ?? '';
      const success = await Clipboard.copy(text);

      if (success) {
        const original = btn.textContent;
        btn.textContent = i18n.t('btnCopied');

        if (AppState.autoClear) {
          Clipboard.scheduleAutoClear();
        }

        setTimeout(() => {
          btn.textContent = original;
        }, 2000);
      }
    });
  }

  private saveToHistory(mode: 'encrypt' | 'decrypt', method: EncodingMethod, content: string): void {
    Storage.addToHistory({
      mode,
      method,
      content,
      preview: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      charCount: content.length,
    });
  }

  // ==========================================
  // FILE-TO-TEXT VAULT
  // ==========================================

  private getSelectedVaultFile(): File | null {
    const input = this.getElement('fileVaultFile') as HTMLInputElement | null;
    return input?.files?.[0] ?? null;
  }

  private updateFileVaultMeta(): void {
    const meta = this.getElement('fileVaultFileMeta');
    const file = this.getSelectedVaultFile();

    if (!meta) {
      return;
    }

    if (!file) {
      meta.textContent = i18n.t('fileVaultNoFile');
      return;
    }

    meta.textContent = `${file.name} - ${this.formatBytes(file.size)}`;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      this.setFileVaultStatus(i18n.t('errorFileVaultTooBig'), 'error');
    } else {
      this.setFileVaultStatus('', 'info');
    }
  }

  private async encryptSelectedFileToText(): Promise<void> {
    const file = this.getSelectedVaultFile();
    const password = (this.getElement('fileVaultPassword') as HTMLInputElement | null)?.value ?? '';
    const output = this.getElement('fileVaultOutput') as HTMLTextAreaElement | null;

    if (!file || !password) {
      this.setFileVaultStatus(i18n.t('errorFileVaultFields'), 'error');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      this.setFileVaultStatus(i18n.t('errorFileVaultTooBig'), 'error');
      return;
    }

    this.setFileVaultLoading(true);
    this.setFileVaultStatus(i18n.t('fileVaultProcessing'), 'info');

    try {
      const encryptedText = await CryptoWorker.encryptFileToText(file, password);
      if (output) {
        output.value = encryptedText;
      }
      this.setFileVaultStatus(i18n.t('successFileVaultEncrypted'), 'success');
    } catch {
      this.setFileVaultStatus(i18n.t('errorFileVaultEncrypt'), 'error');
    } finally {
      this.setFileVaultLoading(false);
    }
  }

  private async decryptVaultTextToFile(): Promise<void> {
    const vaultText = (this.getElement('fileVaultText') as HTMLTextAreaElement | null)?.value.trim() ?? '';
    const password = (this.getElement('fileVaultPassword') as HTMLInputElement | null)?.value ?? '';

    if (!vaultText || !password) {
      this.setFileVaultStatus(i18n.t('errorFileVaultDecryptFields'), 'error');
      return;
    }

    if (!FileVault.isVaultText(vaultText)) {
      this.setFileVaultStatus(i18n.t('errorFileVaultInvalid'), 'error');
      return;
    }

    this.setFileVaultLoading(true);
    this.setFileVaultStatus(i18n.t('fileVaultProcessing'), 'info');

    try {
      const result = await CryptoWorker.decryptTextToFile(vaultText, password);
      FileVault.downloadDecryptedFile(result);
      this.setFileVaultStatus(`${i18n.t('successFileVaultDecrypted')} ${result.filename}`, 'success');
    } catch {
      this.setFileVaultStatus(i18n.t('errorFileVaultDecrypt'), 'error');
    } finally {
      this.setFileVaultLoading(false);
    }
  }

  private async copyFileVaultOutput(): Promise<void> {
    const output = this.getElement('fileVaultOutput') as HTMLTextAreaElement | null;
    const text = output?.value ?? '';

    if (!text) {
      this.setFileVaultStatus(i18n.t('errorFileVaultNoOutput'), 'error');
      return;
    }

    const success = await Clipboard.copy(text);
    this.setFileVaultStatus(
      success ? i18n.t('successCopied') : i18n.t('errorFileVaultCopy'),
      success ? 'success' : 'error'
    );
  }

  private setFileVaultLoading(loading: boolean): void {
    const encryptBtn = this.getElement('fileVaultEncryptBtn') as HTMLButtonElement | null;
    const decryptBtn = this.getElement('fileVaultDecryptBtn') as HTMLButtonElement | null;

    encryptBtn?.toggleAttribute('disabled', loading);
    decryptBtn?.toggleAttribute('disabled', loading);
  }

  private setFileVaultStatus(message: string, type: 'info' | 'success' | 'error'): void {
    const status = this.getElement('fileVaultStatus');
    if (!status) {
      return;
    }

    status.textContent = message;
    status.className = `file-vault-status ${type}`;
    status.style.display = message ? 'block' : 'none';
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  // ==========================================
  // THEME & LANGUAGE
  // ==========================================

  applyTheme(theme: 'dark' | 'light'): void {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = this.getElement('themeToggle')?.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }

  toggleTheme(): void {
    const newTheme = AppState.toggleTheme();
    this.applyTheme(newTheme);
  }

  toggleLanguage(): void {
    const newLanguage = AppState.toggleLanguage();
    i18n.setLanguage(newLanguage);
    this.updateUIText();
    this.setMode(AppState.mode);
    this.updateMethodInfo();
    this.applyTheme(AppState.theme);
  }

  updateUIText(): void {
    const t = i18n.t.bind(i18n);

    // Update tab labels
    const tabEncLabel = this.getElement('tabEnc')?.querySelector('span');
    const tabDecLabel = this.getElement('tabDec')?.querySelector('span');
    if (tabEncLabel) tabEncLabel.textContent = t('tabEncrypt');
    if (tabDecLabel) tabDecLabel.textContent = t('tabDec');

    // Update version badge
    const versionBadge = this.getElement('versionBadge')?.querySelector('span');
    if (versionBadge) versionBadge.textContent = t('version');

    // Update input placeholders
    const inputText = this.getElement('inputText') as HTMLInputElement;
    const passwordInput = this.getElement('password') as HTMLInputElement;
    const coverText = this.getElement('coverText') as HTMLInputElement;
    const fileVaultPassword = this.getElement('fileVaultPassword') as HTMLInputElement;
    const fileVaultText = this.getElement('fileVaultText') as HTMLTextAreaElement;

    if (inputText) inputText.placeholder = t('inputPlaceholder');
    if (passwordInput) passwordInput.placeholder = t('passwordPlaceholder');
    if (coverText) coverText.placeholder = t('coverTextPlaceholder');
    if (fileVaultPassword) fileVaultPassword.placeholder = t('passwordPlaceholder');
    if (fileVaultText) fileVaultText.placeholder = t('fileVaultTextPlaceholder');

    // Update checkboxes
    const splitLabel = this.getElement('splitOutput')?.nextElementSibling;
    const autoClearLabel = this.getElement('autoClearClipboard')?.nextElementSibling;
    if (splitLabel) splitLabel.textContent = t('checkboxSplit');
    if (autoClearLabel) autoClearLabel.textContent = t('checkboxAutoClear');

    // Update button
    this.updateButton();
    this.updateFileVaultText();
  }

  private updateFileVaultText(): void {
    const mappings: Array<[string, string]> = [
      ['fileVaultTitle', 'fileVaultTitle'],
      ['fileVaultEncryptBtn', 'fileVaultEncrypt'],
      ['fileVaultDecryptBtn', 'fileVaultDecrypt'],
      ['fileVaultCopyBtn', 'fileVaultCopy'],
    ];

    for (const [id, key] of mappings) {
      const element = this.getElement(id);
      const target = element?.querySelector('span') ?? element;
      if (target) target.textContent = i18n.t(key);
    }

    const panel = this.getElement('fileVaultPanel');
    const subtitle = panel?.querySelector('.file-vault-header p');
    if (subtitle) subtitle.textContent = i18n.t('fileVaultSubtitle');

    const fileLabel = document.querySelector('label[for="fileVaultFile"] span');
    const passwordLabel = document.querySelector('label[for="fileVaultPassword"] span');
    const textLabel = document.querySelector('label[for="fileVaultText"] span');
    const outputLabel = document.querySelector('label[for="fileVaultOutput"] span');

    if (fileLabel) fileLabel.textContent = i18n.t('fileVaultPickLabel');
    if (passwordLabel) passwordLabel.textContent = i18n.t('fileVaultPasswordLabel');
    if (textLabel) textLabel.textContent = i18n.t('fileVaultTextLabel');
    if (outputLabel) outputLabel.textContent = i18n.t('fileVaultOutputLabel');

    this.updateFileVaultMeta();
  }

  // ==========================================
  // PWA
  // ==========================================

  private initPWA(): void {
    // Register service worker
    const disableServiceWorker =
      (window as Window & { __CRYPTOMSG_DISABLE_SW?: boolean }).__CRYPTOMSG_DISABLE_SW === true;

    if ('serviceWorker' in navigator && !disableServiceWorker) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {
          // Silent fail - SW is optional
        });
      });
    }

    // Handle install prompt
    let deferredPrompt: BeforeInstallPromptEvent | null = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      const installBtn = this.getElement('installBtn');
      if (installBtn) installBtn.style.display = 'block';
    });

    const installBtn = this.getElement('installBtn');
    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          await deferredPrompt.prompt();
          await deferredPrompt.userChoice;
          deferredPrompt = null;
          installBtn.style.display = 'none';
        }
      });
    }
  }

  updateApp(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => reg.unregister());
        alert(i18n.t('successUpdated'));
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  }

  // ==========================================
  // KEYBOARD SHORTCUTS
  // ==========================================

  private initKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter = Process
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.processAction();
      }
      // Ctrl/Cmd + Shift + T = Toggle Theme
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
      }
      // Ctrl/Cmd + Shift + L = Toggle Language
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        this.toggleLanguage();
      }
    });
  }
}

// ==========================================
// EXPORTS
// ==========================================

export const UI = new UIModule();
