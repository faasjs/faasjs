# @faasjs/server

[![License: MIT](https://img.shields.io/npm/l/@faasjs/server.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/server/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/server/stable.svg)](https://www.npmjs.com/package/@faasjs/server)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/server/beta.svg)](https://www.npmjs.com/package/@faasjs/server)

FaasJS's server module.

## Install

    npm install @faasjs/server

## Routing

Static routing:

- `/` -> `index.func.ts` or `index.func.tsx`
- `/path` -> `path.func.ts` or `path.func.tsx` or `path/index.func.ts` or `path/index.func.tsx`

Dynamic routing:

- `/*` -> `default.func.ts` or `default.func.tsx`
- `/path/*` -> `path/default.func.ts` or `path/default.func.tsx`

## Modules

### Classes

- [Server](classes/Server.md)

### Functions

- [closeAll](#closeall)
- [getAll](#getall)

## Functions

### closeAll

▸ **closeAll**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

___

### getAll

▸ **getAll**(): [`Server`](classes/Server.md)[]

#### Returns

[`Server`](classes/Server.md)[]
