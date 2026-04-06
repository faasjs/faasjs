import type { UserConfig } from 'vite-plus'

const ignorePatterns = ['**/dist/**', 'node_modules/**']

/**
 * Shared Oxfmt configuration used by FaasJS projects.
 *
 * @example
 * ```ts
 * import { defineConfig } from 'vite-plus'
 * import { oxfmtConfig } from '@faasjs/dev'
 *
 * export default defineConfig({
 *   fmt: oxfmtConfig,
 * })
 * ```
 */
export const oxfmtConfig: NonNullable<UserConfig['fmt']> = {
  ignorePatterns: [...ignorePatterns],
  semi: false,
  singleQuote: true,
  sortImports: {},
}
