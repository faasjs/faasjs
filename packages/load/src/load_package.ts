import { Logger } from '@faasjs/logger'

export type NodeRuntime = 'commonjs' | 'module'

let _runtime: NodeRuntime | null = null

export function resetRuntime(): void {
  _runtime = null
}

/**
 * Detect the current JavaScript runtime environment.
 *
 * This function checks for the presence of `import.meta` and `require` to determine
 * whether the runtime is using ECMAScript modules (ESM) or CommonJS modules (CJS).
 *
 * @returns {NodeRuntime} - Returns 'module' if the runtime is using ECMAScript modules,
 *                            and 'cjs' if the runtime is using CommonJS modules.
 * @throws {Error} - Throws an error if the runtime cannot be determined.
 */
export function detectNodeRuntime(): NodeRuntime {
  if (_runtime) return _runtime

  if (typeof globalThis.require === 'function' && typeof module !== 'undefined')
    return (_runtime = 'commonjs')

  if (typeof import.meta !== 'undefined') return (_runtime = 'module')

  throw Error('Unknown runtime')
}

let tsxLoaded: null | boolean = null
const logger = new Logger('loadPackage')

/**
 * Asynchronously loads a package by its name, supporting both ESM and CommonJS runtimes.
 *
 * Also supports loading TypeScript and TSX files by checking for the presence of the "tsx" package.
 *
 * @template T - The type of the module to be loaded.
 * @param {string} name - The name of the package to load.
 * @returns {Promise<T>} A promise that resolves to the loaded module.
 * @throws {Error} If the runtime is unknown.
 *
 * @example
 * ```typescript
 * const myModule = await loadPackage<MyModuleType>('my-module');
 * ```
 */
export async function loadPackage<T = unknown>(name: string, defaultName = 'default'): Promise<T> {
  const runtime = detectNodeRuntime()

  let module: any

  if (runtime === 'module') {
    if (tsxLoaded === null) {
      try {
        // @ts-ignore
        await import('tsx')
        tsxLoaded = true
      } catch (_) {
        tsxLoaded = false
        logger.warn(
          'Recommend installing the "tsx" package for loading ts/tsx files'
        )
      }
    }

    module = await import(name)

    return defaultName in module ? module[defaultName] : module
  }

  if (runtime === 'commonjs') {
    if (tsxLoaded === null) {
      try {
        globalThis.require('tsx')
        tsxLoaded = true
      } catch (_) {
        tsxLoaded = false
        logger.warn(
          'Recommend installing the "tsx" package for loading ts/tsx files'
        )
      }
    }

    module = globalThis.require(name)

    return defaultName in module ? module[defaultName] : module
  }

  throw Error('Unknown runtime')
}
