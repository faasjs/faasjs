import { fixImportsPlugin } from 'esbuild-fix-imports-plugin';
import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['esm', 'cjs'],
  clean: true,
  dts: true,
  treeshake: true,
  tsconfig: 'tsconfig.build.json',
  esbuildPlugins: [fixImportsPlugin()],
  outExtension({ format }) {
    if (format === 'cjs')
      return {
        js: '.js',
        dts: '.d.ts',
      }
    if (format === 'esm')
      return {
        js: '.mjs',
        dts: '.d.mts',
      }
  },
  banner({ format }) {
    if (format === "esm") {
      return {
        js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
      };
    }
  },
})
