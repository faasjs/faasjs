
/**
 * Assigns a name to a given function handler, which will be displayed in logs and error messages.
 *
 * @template T - The type of the function handler.
 * @param {string} name - The name to assign to the function handler.
 * @param {T} handler - The function handler to which the name will be assigned.
 * @returns {T} - The original function handler with the assigned name.
 *
 * @example
 * ```ts
 * import { nameFunc } from '@faasjs/func'
 *
 * const handler = nameFunc('myHandler', () => {
 *  return 'Hello World'
 * })
 *
 * console.log(handler.name) // => 'myHandler'
 * ```
 */
export function nameFunc<T extends (...args: any[]) => any>(
  name: string,
  handler: T
): T {
  Object.defineProperty(handler, 'name', { value: name })
  return handler
}

/**
 * Detect the current JavaScript runtime environment.
 *
 * This function checks for the presence of `import.meta` and `require` to determine
 * whether the runtime is using ECMAScript modules (ESM) or CommonJS modules (CJS).
 *
 * @returns {'commonjs' | 'module'} - Returns 'module' if the runtime is using ECMAScript modules,
 *                            and 'cjs' if the runtime is using CommonJS modules.
 * @throws {Error} - Throws an error if the runtime cannot be determined.
 */
export function detectNodeRuntime(): 'commonjs' | 'module' {
  if (typeof globalThis.require === 'function' && typeof module !== 'undefined')
    return 'commonjs'

  if (typeof import.meta !== 'undefined')
    return 'module'

  throw Error('Unknown runtime')
}

/**
 * Load a package dynamically based on the Node.js runtime environment.
 *
 * This function detects the current Node.js runtime (either 'module' or 'commonjs') and loads the specified package accordingly.
 *
 * @template T - The type of the module to be loaded.
 * @param {string} name - The name of the package to load.
 * @returns {Promise<T>} A promise that resolves to the loaded package.
 * @throws {Error} If the runtime is neither 'module' nor 'commonjs'.
 */
export async function loadPackage<T = unknown>(name: string): Promise<T> {
  const runtime = detectNodeRuntime()

  if (runtime === 'module') {
    const module = await import(name)
    return module.default ? module.default : module
  }

  if (runtime === 'commonjs') {
    const module = globalThis.require(name)

    return module.default ? module.default : module
  }

  throw Error('Unknown runtime')
}
