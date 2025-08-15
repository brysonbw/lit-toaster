/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{spec,test}.{js,ts}'],
    setupFiles: './src/testing/setup.ts',
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        ...configDefaults.exclude,
        'src/constants.ts',
        'src/index.ts',
        'src/typedoc.ts',
        'src/types.ts',
        'src/typings.ts',
        'bin',
        'dist',
      ],
      clean: true,
      cleanOnRerun: false,
      thresholds: {
        lines: 80,
        functions: 75,
        branches: 70,
        statements: 80,
      },
    },
  },
});
