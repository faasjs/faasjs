# @faasjs/server

FaasJS's server module.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/server.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/server/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/server.svg)](https://www.npmjs.com/package/@faasjs/server)

## Install

```sh
npm install @faasjs/server
```

## Routing

Static routing:

- `/` -> `index.func.ts` or `index.func.tsx`
- `/path` -> `path.func.ts` or `path.func.tsx` or `path/index.func.ts` or `path/index.func.tsx`

Dynamic routing:

- `/*` -> `default.func.ts` or `default.func.tsx`
- `/path/*` -> `path/default.func.ts` or `path/default.func.tsx`

## Classes

- [Server](classes/Server.md)

## Functions

- [closeAll](functions/closeAll.md)
- [getAll](functions/getAll.md)
