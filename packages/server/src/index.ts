/**
 * FaasJS's server module.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/server.svg)](https://github.com/faasjs/faasjs/blob/main/packages/server/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/server.svg)](https://www.npmjs.com/package/@faasjs/server)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/server
 * ```
 *
 * ## Usage
 *
 * 1. Create a `server.ts` file:
 * ```ts
 * // server.ts
 * import { Server } from '@faasjs/server'
 *
 * const server = new Server(process.cwd(), {
 *  // options
 * })
 *
 * server.listen()
 * ```
 * 2. Run the server:
 * ```sh
 * node server.ts
 * ```
 *
 * ## Routing
 *
 * Static routing:
 *
 * - `/` -> `index.func.ts`
 * - `/path` -> `path.func.ts` or `path/index.func.ts`
 *
 * Dynamic routing:
 *
 * - `/*` -> `default.func.ts`
 * - `/path/*` -> `path/default.func.ts`
 *
 * ## Zero-mapping SPA API convention (recommended)
 *
 * - page component: `src/pages/<page>/index.tsx`
 * - page APIs: `src/pages/<page>/api/*.func.ts`
 * - feature APIs: `src/pages/<page>/<feature>/api/*.func.ts`
 *
 * Examples:
 *
 * - `src/pages/todo/api/list.func.ts` -> `POST /todo/api/list`
 * - `src/pages/todo/api/index.func.ts` -> `POST /todo/api`
 *
 * Notes:
 *
 * - Keep file path and URL in one-to-one mapping.
 * - Do not use implicit rewrites such as `actions -> api`.
 * - Do not place `*.func.ts` files in `components/`.
 *
 * @packageDocumentation
 */

export * from './middleware'
export * from './server'
