/**
 * @fileoverview CryptoMsg Services - Clipboard, Storage, QR Code
 * @version 5.0.0
 * @license MIT
 */

// ==========================================
// CLIPBOARD SERVICE
// ==========================================

export class ClipboardService {
  private clearTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly AUTO_CLEAR_DELAY = 60000; // 60 seconds

  /**
   * Copy text to clipboard
   */
  async copy(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      }
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      return false;
    }
  }

  /**
   * Read from clipboard
   */
  async read(): Promise<string | null> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        return await navigator.clipboard.readText();
      }
      return null;
    } catch (error) {
      console.error('Clipboard read failed:', error);
      return null;
    }
  }

  /**
   * Clear clipboard
   */
  async clear(): Promise<void> {
    try {
      await this.copy('');
    } catch (error) {
      console.error('Clipboard clear failed:', error);
    }
  }

  /**
   * Schedule auto-clear of clipboard
   */
  scheduleAutoClear(delay?: number): void {
    this.cancelAutoClear();
    const timeout = delay ?? this.AUTO_CLEAR_DELAY;
    this.clearTimer = setTimeout(() => {
      this.clear();
      this.clearTimer = null;
    }, timeout);
  }

  /**
   * Cancel scheduled auto-clear
   */
  cancelAutoClear(): void {
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
      this.clearTimer = null;
    }
  }
}

// ==========================================
// STORAGE SERVICE
// ==========================================

export interface HistoryEntry {
  id: string;
  timestamp: number;
  mode: 'encrypt' | 'decrypt';
  method: string;
  content: string;
  preview: string;
  charCount: number;
}

export class StorageService {
  private readonly HISTORY_KEY = 'cryptomsg-history';
  private readonly MAX_HISTORY = 100;

  /**
   * Get history from storage
   */
  getHistory(): HistoryEntry[] {
    try {
      const data = localStorage.getItem(this.HISTORY_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to get history:', error);
    }
    return [];
  }

  /**
   * Save entry to history
   */
  addToHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
    try {
      const history = this.getHistory();
      const newEntry: HistoryEntry = {
        ...entry,
        id: this.generateId(),
        timestamp: Date.now(),
      };

      history.unshift(newEntry);

      // Limit history size
      if (history.length > this.MAX_HISTORY) {
        history.splice(this.MAX_HISTORY);
      }

      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    localStorage.removeItem(this.HISTORY_KEY);
  }

  /**
   * Export history as JSON
   */
  exportHistory(): string {
    const history = this.getHistory();
    return JSON.stringify({
      version: '5.0.0',
      timestamp: Date.now(),
      entries: history,
    }, null, 2);
  }

  /**
   * Import history from JSON
   */
  importHistory(json: string): boolean {
    try {
      const data = JSON.parse(json);
      if (data.entries && Array.isArray(data.entries)) {
        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(data.entries));
        return true;
      }
    } catch (error) {
      console.error('Failed to import history:', error);
    }
    return false;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

// ==========================================
// QR CODE SERVICE
// ==========================================

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export class QRCodeService {
  /**
   * Generate QR code as data URL
   */
  async generateDataURL(text: string, options: QRCodeOptions = {}): Promise<string> {
    const { width = 512, margin = 2, color = {} } = options;
    const { dark = '#0f172a', light = '#ffffff' } = color;

    try {
      // Dynamic import of qrcode library
      const QRCode = (await import('qrcode')).default;
      return await QRCode.toDataURL(text, {
        width,
        margin,
        color: {
          dark,
          light,
        },
        errorCorrectionLevel: 'M',
      });
    } catch (error) {
      console.error('QR code generation failed:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code as canvas element
   */
  async generateCanvas(text: string, canvas: HTMLCanvasElement, options: QRCodeOptions = {}): Promise<void> {
    const { width = 512, margin = 2, color = {} } = options;
    const { dark = '#0f172a', light = '#ffffff' } = color;

    try {
      const QRCode = (await import('qrcode')).default;
      await QRCode.toCanvas(canvas, text, {
        width,
        margin,
        color: {
          dark,
          light,
        },
        errorCorrectionLevel: 'M',
      });
    } catch (error) {
      console.error('QR code generation failed:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Download QR code as image
   */
  async downloadQRCode(text: string, filename: string = 'qrcode.png', options: QRCodeOptions = {}): Promise<void> {
    const dataUrl = await this.generateDataURL(text, options);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// ==========================================
// EXPORTS
// ==========================================

export const Clipboard = new ClipboardService();
export const Storage = new StorageService();
export const QRCode = new QRCodeService();
