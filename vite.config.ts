import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    //To use environment variables in test files
    setupFiles: './environment-variables-config.ts',
  },
});
