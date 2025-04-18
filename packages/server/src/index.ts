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
 * ## Usage
 *
 * 1. Create a `server.ts` file:
 * ```ts
 * // server.ts
 * import { Server } from '@faasjs/server'
 *
 * const server = new Server({
 *  // options
 * })
 *
 * server.start()
 * ```
 * 2. Run the server:
 * ```sh
 * tsx server.ts // or `bun server.ts` if you are not using bun
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

export * from './middleware'
export * from './server'
