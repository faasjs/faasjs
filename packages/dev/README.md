# @faasjs/dev

FaasJS development toolkit for local development and testing.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/dev.svg)](https://github.com/faasjs/faasjs/blob/main/packages/dev/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/dev.svg)](https://www.npmjs.com/package/@faasjs/dev)

## Install

```sh
npm install @faasjs/dev
```

## Features

- Vite integration for in-process FaasJS API during local development.
- PGlite helpers for lightweight database setup in tests.
- Test helpers to invoke and assert FaasJS functions.

## Usage: Vite integration

```ts
import { viteFaasJsServer } from '@faasjs/dev'

export default defineConfig({
  plugins: [viteFaasJsServer()],
})
```

## Usage: PGlite helpers

```ts
import {
  createPgliteKnex,
  mountFaasKnex,
  unmountFaasKnex,
} from '@faasjs/dev'

const db = createPgliteKnex()
mountFaasKnex(db)

// run tests...

await db.destroy()
unmountFaasKnex()
```

## Usage: Test helpers

```ts
import { test } from '@faasjs/dev'
import Func from '../demo.func.ts'

const func = test(Func)
const response = await func.JSONhandler({ name: 'FaasJS' })

expect(response.statusCode).toBe(200)
expect(response.data).toEqual({ message: 'Hello, FaasJS' })
```

## API

- Vite: [viteFaasJsServer](functions/viteFaasJsServer.md)
- PGlite: [createPgliteKnex](functions/createPgliteKnex.md), [mountFaasKnex](functions/mountFaasKnex.md), [unmountFaasKnex](functions/unmountFaasKnex.md), [MountFaasKnexOptions](type-aliases/MountFaasKnexOptions.md)
- Test: [test](functions/test.md), [FuncWarper](classes/FuncWarper.md), [streamToString](functions/streamToString.md)

## Functions

- [createPgliteKnex](functions/createPgliteKnex.md)
- [defineFunc](functions/defineFunc.md)
- [generateFaasTypes](functions/generateFaasTypes.md)
- [isTypegenSourceFile](functions/isTypegenSourceFile.md)
- [mountFaasKnex](functions/mountFaasKnex.md)
- [nameFunc](functions/nameFunc.md)
- [parseFuncFilenameFromStack](functions/parseFuncFilenameFromStack.md)
- [streamToString](functions/streamToString.md)
- [test](functions/test.md)
- [unmountFaasKnex](functions/unmountFaasKnex.md)
- [useFunc](functions/useFunc.md)
- [usePlugin](functions/usePlugin.md)
- [viteFaasJsServer](functions/viteFaasJsServer.md)

## Classes

- [Func](classes/Func.md)
- [FuncWarper](classes/FuncWarper.md)

## Interfaces

- [FaasPluginEventMap](interfaces/FaasPluginEventMap.md)

## Type Aliases

- [Config](type-aliases/Config.md)
- [ExportedHandler](type-aliases/ExportedHandler.md)
- [FuncConfig](type-aliases/FuncConfig.md)
- [FuncEventType](type-aliases/FuncEventType.md)
- [FuncReturnType](type-aliases/FuncReturnType.md)
- [GenerateFaasTypesOptions](type-aliases/GenerateFaasTypesOptions.md)
- [GenerateFaasTypesResult](type-aliases/GenerateFaasTypesResult.md)
- [Handler](type-aliases/Handler.md)
- [InferPluginEvent](type-aliases/InferPluginEvent.md)
- [InvokeData](type-aliases/InvokeData.md)
- [LifeCycleKey](type-aliases/LifeCycleKey.md)
- [MountData](type-aliases/MountData.md)
- [MountFaasKnexOptions](type-aliases/MountFaasKnexOptions.md)
- [Next](type-aliases/Next.md)
- [NormalizePluginType](type-aliases/NormalizePluginType.md)
- [Plugin](type-aliases/Plugin.md)
- [ResolvePluginEvent](type-aliases/ResolvePluginEvent.md)
- [Simplify](type-aliases/Simplify.md)
- [UnionToIntersection](type-aliases/UnionToIntersection.md)
- [UseifyPlugin](type-aliases/UseifyPlugin.md)
