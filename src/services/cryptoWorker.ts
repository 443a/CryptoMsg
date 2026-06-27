/**
 * @fileoverview Crypto worker client with safe main-thread fallback.
 * @version 5.0.0
 * @license MIT
 */

import type {
  CryptoWorkerOperation,
  FileVaultDecryptionResult,
  FileVaultWorkerFileResult,
} from '../types';
import { Crypto } from '../core/crypto';
import { FileVault } from '../core/fileVault';

interface CryptoWorkerPayload {
  text?: string;
  data?: string;
  password?: string;
  length?: number;
  fileBytes?: ArrayBuffer;
  filename?: string;
  mimeType?: string;
  lastModified?: number;
}

interface CryptoWorkerResponse {
  type: 'ready' | 'result' | 'error';
  id: string;
  payload?: {
    result?: unknown;
    error?: string;
    code?: string;
  };
}

interface PendingRequest<T> {
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
}

interface WorkerPasswordStrength {
  score: number;
  level: 'weak' | 'medium' | 'strong';
  crackTime: string;
}

class CryptoWorkerClient {
  private worker: Worker | null = null;
  private readonly pending = new Map<string, PendingRequest<unknown>>();

  encrypt(text: string, password: string): Promise<string> {
    return this.request<string>('encrypt', { text, password }, [], () => Crypto.encrypt(text, password));
  }

  decrypt(data: string, password: string): Promise<string> {
    return this.request<string>('decrypt', { data, password }, [], () => Crypto.decrypt(data, password));
  }

  generatePassword(length = 24): Promise<string> {
    return this.request<string>('generatePassword', { length }, [], () =>
      Promise.resolve(Crypto.generatePassword(length))
    );
  }

  calculateStrength(password: string): Promise<WorkerPasswordStrength> {
    return this.request('calculateStrength', { password }, [], () => {
      const strength = Crypto.calculatePasswordStrength(password);
      return Promise.resolve({
        score: strength.score,
        level: strength.level,
        crackTime: strength.crackTimeText,
      });
    });
  }

  async encryptFileToText(file: File, password: string): Promise<string> {
    const fileBytes = await file.arrayBuffer();
    const payload: CryptoWorkerPayload = {
      fileBytes,
      filename: file.name,
      mimeType: file.type,
      password,
    };

    if (Number.isFinite(file.lastModified)) {
      payload.lastModified = file.lastModified;
    }

    return this.request<string>(
      'encryptFileToText',
      payload,
      [fileBytes],
      async () => FileVault.encryptFileToText(file, password)
    );
  }

  async decryptTextToFile(text: string, password: string): Promise<FileVaultDecryptionResult> {
    const result = await this.request<FileVaultWorkerFileResult>(
      'decryptTextToFile',
      { data: text, password },
      [],
      () => FileVault.decryptTextToFile(text, password).then(async fileResult => {
        const bytes = await fileResult.blob.arrayBuffer();
        return {
          bytes,
          filename: fileResult.filename,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
        };
      })
    );

    return {
      blob: new Blob([result.bytes], { type: result.mimeType }),
      filename: result.filename,
      mimeType: result.mimeType,
      size: result.size,
    };
  }

  private request<T>(
    type: CryptoWorkerOperation,
    payload: CryptoWorkerPayload,
    transfer: Transferable[],
    fallback: () => Promise<T>
  ): Promise<T> {
    const worker = this.getWorker();
    if (!worker) {
      return fallback();
    }

    const id = crypto.randomUUID();

    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, { resolve: resolve as (value: unknown) => void, reject });

      try {
        worker.postMessage({ type, id, payload }, transfer);
      } catch {
        this.pending.delete(id);
        fallback().then(resolve, reject).catch(reject);
      }
    });
  }

  private getWorker(): Worker | null {
    if (this.worker) {
      return this.worker;
    }

    if (typeof Worker === 'undefined') {
      return null;
    }

    try {
      this.worker = new Worker(new URL('../workers/crypto.worker.ts', import.meta.url), {
        type: 'module',
      });
      this.worker.addEventListener('message', event => this.handleMessage(event));
      this.worker.addEventListener('error', event => {
        this.rejectAll(new Error(event.message || 'Crypto worker failed'));
        this.worker?.terminate();
        this.worker = null;
      });
      return this.worker;
    } catch {
      this.worker = null;
      return null;
    }
  }

  private handleMessage(event: MessageEvent<CryptoWorkerResponse>): void {
    const { type, id, payload } = event.data;
    if (type === 'ready') {
      return;
    }

    const pending = this.pending.get(id);
    if (!pending) {
      return;
    }

    this.pending.delete(id);

    if (type === 'error') {
      pending.reject(new Error(payload?.error ?? 'Crypto worker error'));
      return;
    }

    pending.resolve(payload?.result);
  }

  private rejectAll(error: Error): void {
    for (const pending of this.pending.values()) {
      pending.reject(error);
    }
    this.pending.clear();
  }
}

export const CryptoWorker = new CryptoWorkerClient();
