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
- Test helpers to invoke and assert FaasJS functions.

## Usage: Vite integration

```ts
import { viteFaasJsServer } from '@faasjs/dev'

export default defineConfig({
  plugins: [viteFaasJsServer()],
})
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
- Test: [test](functions/test.md), [FuncWarper](classes/FuncWarper.md), [streamToText](functions/streamToText.md), [streamToObject](functions/streamToObject.md), [streamToString](variables/streamToString.md)

## Functions

- [closeAll](functions/closeAll.md)
- [createCronJob](functions/createCronJob.md)
- [createPgliteKnex](functions/createPgliteKnex.md)
- [defineApi](functions/defineApi.md)
- [generateFaasTypes](functions/generateFaasTypes.md)
- [getAll](functions/getAll.md)
- [initPostgresTypeParsers](functions/initPostgresTypeParsers.md)
- [isTypegenSourceFile](functions/isTypegenSourceFile.md)
- [listCronJobs](functions/listCronJobs.md)
- [mountFaasKnex](functions/mountFaasKnex.md)
- [nameFunc](functions/nameFunc.md)
- [parseFuncFilenameFromStack](functions/parseFuncFilenameFromStack.md)
- [query](functions/query.md)
- [raw](functions/raw.md)
- [removeCronJob](functions/removeCronJob.md)
- [staticHandler](functions/staticHandler.md)
- [streamToObject](functions/streamToObject.md)
- [streamToText](functions/streamToText.md)
- [test](functions/test.md)
- [transaction](functions/transaction.md)
- [unmountFaasKnex](functions/unmountFaasKnex.md)
- [useFunc](functions/useFunc.md)
- [useHttp](functions/useHttp.md)
- [useKnex](functions/useKnex.md)
- [useMiddleware](functions/useMiddleware.md)
- [useMiddlewares](functions/useMiddlewares.md)
- [usePlugin](functions/usePlugin.md)
- [viteFaasJsServer](functions/viteFaasJsServer.md)

## Classes

- [Cookie](classes/Cookie.md)
- [CronJob](classes/CronJob.md)
- [Func](classes/Func.md)
- [FuncWarper](classes/FuncWarper.md)
- [Http](classes/Http.md)
- [HttpError](classes/HttpError.md)
- [Knex](classes/Knex.md)
- [KnexSchema](classes/KnexSchema.md)
- [Server](classes/Server.md)
- [Session](classes/Session.md)

## Interfaces

- [FaasPluginEventMap](interfaces/FaasPluginEventMap.md)

## Type Aliases

- [Config](type-aliases/Config.md)
- [CookieOptions](type-aliases/CookieOptions.md)
- [CronJobContext](type-aliases/CronJobContext.md)
- [CronJobErrorHandler](type-aliases/CronJobErrorHandler.md)
- [CronJobHandler](type-aliases/CronJobHandler.md)
- [CronJobOptions](type-aliases/CronJobOptions.md)
- [DefineApiData](type-aliases/DefineApiData.md)
- [DefineApiOptions](type-aliases/DefineApiOptions.md)
- [ExportedHandler](type-aliases/ExportedHandler.md)
- [FuncConfig](type-aliases/FuncConfig.md)
- [FuncEventType](type-aliases/FuncEventType.md)
- [FuncReturnType](type-aliases/FuncReturnType.md)
- [GenerateFaasTypesOptions](type-aliases/GenerateFaasTypesOptions.md)
- [GenerateFaasTypesResult](type-aliases/GenerateFaasTypesResult.md)
- [Handler](type-aliases/Handler.md)
- [HttpConfig](type-aliases/HttpConfig.md)
- [InferPluginEvent](type-aliases/InferPluginEvent.md)
- [InvokeData](type-aliases/InvokeData.md)
- [KnexConfig](type-aliases/KnexConfig.md)
- [LifeCycleKey](type-aliases/LifeCycleKey.md)
- [Middleware](type-aliases/Middleware.md)
- [MiddlewareContext](type-aliases/MiddlewareContext.md)
- [MiddlewareEvent](type-aliases/MiddlewareEvent.md)
- [MountData](type-aliases/MountData.md)
- [MountedKnexAdapter](type-aliases/MountedKnexAdapter.md)
- [MountFaasKnexOptions](type-aliases/MountFaasKnexOptions.md)
- [Next](type-aliases/Next.md)
- [NormalizePluginType](type-aliases/NormalizePluginType.md)
- [Plugin](type-aliases/Plugin.md)
- [ResolvePluginEvent](type-aliases/ResolvePluginEvent.md)
- [Response](type-aliases/Response.md)
- [ServerHandlerOptions](type-aliases/ServerHandlerOptions.md)
- [ServerOptions](type-aliases/ServerOptions.md)
- [SessionContent](type-aliases/SessionContent.md)
- [SessionOptions](type-aliases/SessionOptions.md)
- [Simplify](type-aliases/Simplify.md)
- [StaticHandlerOptions](type-aliases/StaticHandlerOptions.md)
- [UnionToIntersection](type-aliases/UnionToIntersection.md)
- [UseifyPlugin](type-aliases/UseifyPlugin.md)

## Variables

- [ContentType](variables/ContentType.md)
- [originKnex](variables/originKnex.md)
- [streamToString](variables/streamToString.md)
