import { fixImportsPlugin } from 'esbuild-fix-imports-plugin';
import { defineConfig } from 'tsup';

export default defineConfig({
  "format": ["esm", "cjs"],
  "clean": true,
  "dts": true,
  "treeshake": true,
  "tsconfig": "tsconfig.build.json",
  esbuildPlugins: [fixImportsPlugin()],
})
