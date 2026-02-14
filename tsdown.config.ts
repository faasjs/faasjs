import { defineConfig } from 'tsdown'

export default defineConfig({
  cwd: process.cwd(),
  format: ['esm', 'cjs'],
  checks: {
    legacyCjs: false,
  },
  clean: true,
  dts: {
    sourcemap: false,
  },
  sourcemap: false,
  treeshake: true,
  skipNodeModulesBundle: true,
  tsconfig: 'tsconfig.build.json',
  shims: true,
  outExtensions({ format }) {
    if (format === 'es')
      return {
        js: '.mjs',
        dts: '.d.ts',
      }

    return {
      js: '.cjs',
      dts: '.d.ts',
    }
  },
})
