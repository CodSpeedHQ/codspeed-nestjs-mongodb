import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import codspeedPlugin from '@codspeed/vitest-plugin';

export default defineConfig({
  plugins: [swc.vite(), tsconfigPaths(), codspeedPlugin()],
  test: {
    root: './',
    passWithNoTests: true,
    include: ['**/*.e2e.spec.ts'],
    benchmark: { include: ['**/*.e2e.bench.ts'] },
    // ensure we running only one test at a time since they are using the same database
    // this could be removed by using a different database for each test
    poolOptions: { forks: { singleFork: true } },
    setupFiles: ['./src/testUtils/setup-testcontainers-vitest.ts'],
  },
});
