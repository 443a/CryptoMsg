/**
 * @fileoverview Vite Configuration for CryptoMsg
 * @version 5.0.0
 */

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@services': resolve(__dirname, 'src/services'),
      '@workers': resolve(__dirname, 'src/workers'),
      '@types': resolve(__dirname, 'src/types'),
      '@i18n': resolve(__dirname, 'src/i18n'),
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    target: 'es2020',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },

  server: {
    port: 3000,
    open: true,
    cors: true,
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        'vite.config.ts',
      ],
    },
  },

  worker: {
    format: 'es',
  },
});
