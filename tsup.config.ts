import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm', 'cjs'],
  clean: true,
  dts: true,
  treeshake: true,
  tsconfig: 'tsconfig.build.json',
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
})
