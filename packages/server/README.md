# @faasjs/server

FaasJS's server module.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/server.svg)](https://github.com/faasjs/faasjs/blob/main/packages/server/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/server.svg)](https://www.npmjs.com/package/@faasjs/server)

## Install

```sh
npm install @faasjs/server
```

## Usage

1. Create a `server.ts` file:
```ts
// server.ts
import { Server } from '@faasjs/server'

const server = new Server(process.cwd(), {
 // options
})

server.listen()
```
2. Run the server:
```sh
node server.ts
```

## Routing

Static routing:

- `/` -> `index.func.ts`
- `/path` -> `path.func.ts` or `path/index.func.ts`

Dynamic routing:

- `/*` -> `default.func.ts`
- `/path/*` -> `path/default.func.ts`

## Functions

- [closeAll](functions/closeAll.md)
- [getAll](functions/getAll.md)
- [staticHandler](functions/staticHandler.md)
- [useMiddleware](functions/useMiddleware.md)
- [useMiddlewares](functions/useMiddlewares.md)

## Classes

- [Server](classes/Server.md)

## Type Aliases

- [Middleware](type-aliases/Middleware.md)
- [MiddlewareContext](type-aliases/MiddlewareContext.md)
- [MiddlewareEvent](type-aliases/MiddlewareEvent.md)
- [ServerHandlerOptions](type-aliases/ServerHandlerOptions.md)
- [ServerOptions](type-aliases/ServerOptions.md)
- [StaticHandlerOptions](type-aliases/StaticHandlerOptions.md)
