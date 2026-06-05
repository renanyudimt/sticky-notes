import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        '**/index.ts',
        '**/types.ts',
        '**/constants.ts',
        '**/styles.ts',
        '**/*.config.ts',
        'src/main.tsx',
        'src/test/**',
        'src/modules/shared/components/ui/**',
      ],
    },
  },
});
