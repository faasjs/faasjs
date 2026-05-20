/**
 * Options for preloading Node module hooks that resolve tsconfig paths and local TypeScript files.
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
   */
  version?: string
}

export type LoaderOptions = Omit<RegisterNodeModuleHooksOptions, 'entry'>

export type TsconfigPathRule = {
  key: string
  targets: string[]
  hasWildcard: boolean
  prefix: string
  suffix: string
}

export type TsconfigData = {
  baseUrl: string
  rules: TsconfigPathRule[]
}

export type LoaderState = {
  root: string
  tsconfigPath: string
  tsconfigMtimeMs: number
  baseUrl: string
  rules: TsconfigPathRule[]
  version: string
}

export const VERSION_QUERY_KEY = 'faasjsv'
export const SCRIPT_EXTENSIONS = ['.ts', '.tsx', '.mts', '.js', '.jsx', '.mjs', '.json']
