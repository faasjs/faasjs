# @faasjs/core

FaasJS core package.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/core.svg)](https://github.com/faasjs/faasjs/blob/main/packages/core/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/core.svg)](https://www.npmjs.com/package/@faasjs/core)

## Install

```sh
npm install @faasjs/core
```

## Functions

- [closeAll](functions/closeAll.md)
- [createCronJob](functions/createCronJob.md)
- [createPgliteKnex](functions/createPgliteKnex.md)
- [defineApi](functions/defineApi.md)
- [getAll](functions/getAll.md)
- [initPostgresTypeParsers](functions/initPostgresTypeParsers.md)
- [listCronJobs](functions/listCronJobs.md)
- [mountFaasKnex](functions/mountFaasKnex.md)
- [nameFunc](functions/nameFunc.md)
- [parseFuncFilenameFromStack](functions/parseFuncFilenameFromStack.md)
- [query](functions/query.md)
- [raw](functions/raw.md)
- [removeCronJob](functions/removeCronJob.md)
- [staticHandler](functions/staticHandler.md)
- [transaction](functions/transaction.md)
- [unmountFaasKnex](functions/unmountFaasKnex.md)
- [useFunc](functions/useFunc.md)
- [useHttp](functions/useHttp.md)
- [useKnex](functions/useKnex.md)
- [useMiddleware](functions/useMiddleware.md)
- [useMiddlewares](functions/useMiddlewares.md)
- [usePlugin](functions/usePlugin.md)

## Classes

- [Cookie](classes/Cookie.md)
- [CronJob](classes/CronJob.md)
- [Func](classes/Func.md)
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
