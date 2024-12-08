/**
 * FaasJS's server module.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/server.svg)](https://github.com/faasjs/faasjs/blob/main/packages/server/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/server.svg)](https://www.npmjs.com/package/@faasjs/server)
 *
 * ## Install
 *
 * ```sh
 * # If you are using bun, tsx is not required.
 * npm install @faasjs/server tsx
 * ```
 *
 * ## Routing
 *
 * Static routing:
 *
 * - `/` -> `index.func.ts` or `index.func.tsx`
 * - `/path` -> `path.func.ts` or `path.func.tsx` or `path/index.func.ts` or `path/index.func.tsx`
 *
 * Dynamic routing:
 *
 * - `/*` -> `default.func.ts` or `default.func.tsx`
 * - `/path/*` -> `path/default.func.ts` or `path/default.func.tsx`
 *
 * @packageDocumentation
 */

import(
  (globalThis as any).Bun
    ? 'bun'
    : typeof process.env.JEST_WORKER_ID === 'string'
      ? 'jest'
      : 'tsx'
)

export * from './middleware'
export * from './server'
