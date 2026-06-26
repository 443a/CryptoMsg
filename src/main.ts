/**
 * @fileoverview CryptoMsg - Main Entry Point
 * @version 5.0.0
 * @license MIT
 */

import { UI } from './ui';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI
  UI.init();

  // Log initialization (only in development)
  if (import.meta.env.DEV) {
    console.debug('CryptoMsg v5.0.0 initialized');
  }
});

// Export for debugging
export { UI };
