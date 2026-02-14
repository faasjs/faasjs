export type NodeRuntime = 'commonjs' | 'module'

let _runtime: NodeRuntime | null = null

export function resetRuntime(): void {
  _runtime = null
}

/**
 * Detect current JavaScript runtime environment.
 *
 * This function checks for presence of `require` first, then falls back to Node.js
 * ESM detection via `process.versions.node`.
 *
 * @returns {NodeRuntime} - Returns 'module' if runtime is using ECMAScript modules,
 *                            and 'cjs' if the runtime is using CommonJS modules.
 * @throws {Error} - Throws an error if runtime cannot be determined.
 */
export function detectNodeRuntime(): NodeRuntime {
  if (_runtime) return _runtime

  if (typeof globalThis.require === 'function' && typeof module !== 'undefined')
    return (_runtime = 'commonjs')

  if (typeof process !== 'undefined' && process.versions?.node)
    return (_runtime = 'module')

  throw Error('Unknown runtime')
}

/**
 * Asynchronously loads a package by its name, supporting both ESM and CommonJS runtimes.
 *
 * @template T - The type of module to be loaded.
 * @param {string} name - The name of package to load.
 * @returns {Promise<T>} A promise that resolves to loaded module.
 * @throws {Error} If runtime is unknown.
 *
 * @example
 * ```typescript
 * const myModule = await loadPackage<MyModuleType>('my-module');
 * ```
 */
export async function loadPackage<T = unknown>(
  name: string,
  defaultNames: string | string[] = 'default'
): Promise<T> {
  const runtime = detectNodeRuntime()

  let module: any

  if (runtime === 'module') {
    module = await import(name)

    if (typeof defaultNames === 'string')
      return defaultNames in module ? module[defaultNames] : module

    for (const key of defaultNames) if (key in module) return module[key]

    return module
  }

  if (runtime === 'commonjs') {
    module = globalThis.require(name)

    if (typeof defaultNames === 'string')
      return defaultNames in module ? module[defaultNames] : module

    for (const key of defaultNames) if (key in module) return module[key]

    return module
  }

  throw Error('Unknown runtime')
}
