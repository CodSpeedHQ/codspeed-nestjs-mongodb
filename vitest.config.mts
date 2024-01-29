import swc from 'unplugin-swc';
import { defineConfig, defaultExclude } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import codspeedPlugin from '@codspeed/vitest-plugin';

export default defineConfig({
  plugins: [swc.vite(), tsconfigPaths(), codspeedPlugin()],
  test: {
    root: './',
    passWithNoTests: true,
    exclude: [...defaultExclude, '**/*.e2e.spec.ts'],
    benchmark: { exclude: [...defaultExclude, '**/*.e2e.bench.ts'] },
  },
});
