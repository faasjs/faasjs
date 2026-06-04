import type { UserConfig } from 'vite-plus'

const ignorePatterns = ['**/dist/**', '**/.faasjs/**', 'node_modules/**']

/**
 * Shared Oxfmt configuration used by FaasJS projects.
 *
 * Enables single quotes, omits semicolons, and sorts import declarations.
 * These defaults match the FaasJS repository style and can be overridden
 * by spreading additional `fmt` options.
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite-plus'
 * import { OxfmtConfig } from '@faasjs/dev'
 *
 * export default defineConfig({
 *   fmt: OxfmtConfig,
 * })
 * ```
 */
export const OxfmtConfig: NonNullable<UserConfig['fmt']> = {
  ignorePatterns: [...ignorePatterns],
  semi: false,
  singleQuote: true,
  sortImports: {},
}
