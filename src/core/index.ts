/**
 * CryptoMsg - Core Module Exports
 * @version 5.0.0
 */

// Core modules
export { Crypto, CryptoModule, CryptoError, CRYPTO_CONFIG } from './crypto';
export { Encoding, EncodingModule, EncodingError, DICTIONARIES, ZW_CHARS } from './encoding';
export {
  FileVault,
  FileVaultModule,
  FILE_VAULT_MAGIC,
  FILE_VAULT_PREFIX,
  FILE_VAULT_VERSION,
  MAX_FILE_SIZE_BYTES,
} from './fileVault';
export { AppState, STORAGE_KEYS } from './state';
export type { StateManager } from './state';

// Types
export type * from '../types';
