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
});

// Export for debugging
export { UI };
