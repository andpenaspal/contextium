import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    watch: false,
    coverage: {
      reporter: ['text', 'json'],
      include: ['src/**/*.ts'],
      exclude: ['src/types/**/*'],
    },
    setupFiles: './src/test/vitest/vitest.setup.ts',
  },
});
