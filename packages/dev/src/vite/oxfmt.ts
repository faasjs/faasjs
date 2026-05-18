import type { UserConfig } from 'vite-plus'

const ignorePatterns = ['**/dist/**', 'node_modules/**']

/**
 * Shared Oxfmt configuration used by FaasJS projects.
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
