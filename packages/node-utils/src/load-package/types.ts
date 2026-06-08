/**
 * Options for preloading Node module hooks that resolve tsconfig paths and local TypeScript files.
 *
 * These options are used by {@link registerNodeModuleHooks}. `loadPackage()` can
 * infer equivalent state for local files before it imports them.
 */
export type RegisterNodeModuleHooksOptions = {
  /**
   * Application entry file used to infer the project root and tsconfig path.
   *
   * @default process.argv[1]
   */
  entry?: string
  /**
   * Project root used to scope tsconfig path alias resolution.
   *
   * When omitted, the root is inferred from `entry`, `tsconfigPath`, or the
   * nearest project marker around a loaded local file.
   */
  root?: string
  /**
   * Explicit tsconfig file path used to load path alias rules.
   *
   * @default '<root>/tsconfig.json'
   */
  tsconfigPath?: string
  /**
   * Version token appended to ESM file URLs to bypass Node's module cache.
   *
   * When omitted, `FAASJS_MODULE_VERSION` is used if present.
   */
  version?: string
}

/**
 * Options for building or updating a loader state, excluding the user-facing `entry` field.
 */
export type LoaderOptions = Omit<RegisterNodeModuleHooksOptions, 'entry'>

/**
 * Parsed tsconfig path-alias rule used during module resolution.
 *
 * @property {string} key - Original path alias key from tsconfig.
 * @property {string[]} targets - Target directories or files the key maps to.
 * @property {boolean} hasWildcard - Whether the key contains a `*` wildcard.
 * @property {string} prefix - Literal prefix before the wildcard, or the full key if no wildcard exists.
 * @property {string} suffix - Literal suffix after the wildcard.
 */
export type TsconfigPathRule = {
  key: string
  targets: string[]
  hasWildcard: boolean
  prefix: string
  suffix: string
}

/**
 * Parsed tsconfig data containing the resolved base URL and ordered path-alias rules.
 *
 * @property {string} baseUrl - Resolved base directory for non-relative module resolution.
 * @property {TsconfigPathRule[]} rules - Ordered path-alias rules (longest keys first).
 */
export type TsconfigData = {
  baseUrl: string
  rules: TsconfigPathRule[]
}

/**
 * Cached loader state for a project root, bundling tsconfig data and cache-busting version.
 *
 * @property {string} root - Project root directory.
 * @property {string} tsconfigPath - Path to the tsconfig file that was parsed.
 * @property {number} tsconfigMtimeMs - Modification time of the tsconfig file, or `-1` when missing.
 * @property {string} baseUrl - Resolved base directory for path aliases.
 * @property {TsconfigPathRule[]} rules - Ordered path-alias rules.
 * @property {string} version - Cache-busting version token.
 */
export type LoaderState = {
  root: string
  tsconfigPath: string
  tsconfigMtimeMs: number
  baseUrl: string
  rules: TsconfigPathRule[]
  version: string
}

/**
 * Query parameter name appended to file URLs for cache busting.
 */
export const VERSION_QUERY_KEY = 'faasjsv'
/**
 * File extensions probed during script file resolution, in priority order.
 */
export const SCRIPT_EXTENSIONS = ['.ts', '.tsx', '.mts', '.js', '.jsx', '.mjs', '.json']
