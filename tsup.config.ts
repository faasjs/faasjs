import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm', 'cjs'],
  clean: true,
  dts: true,
  treeshake: true,
  tsconfig: 'tsconfig.build.json',
  shims: true,
  outExtension({ format }) {
    if (format === 'esm')
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
