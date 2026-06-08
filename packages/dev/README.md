# @faasjs/dev

# @faasjs/dev

FaasJS development toolkit for local servers, generated route types, and test helpers.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/dev.svg)](https://github.com/faasjs/faasjs/blob/main/packages/dev/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/dev.svg)](https://www.npmjs.com/package/@faasjs/dev)

## Install

```sh
npm install -D @faasjs/dev
```

## Features

- `viteFaasJsServer()` runs a FaasJS server inside Vite during local development.
- `ViteConfig` bundles the standard FaasJS React and Vite Plus defaults.
- `OxfmtConfig` and `OxlintConfig` expose the shared FaasJS formatting and lint rules.
- `generateFaasTypes()` emits route declarations for `@faasjs/types`.
- `testApi()` and [ApiTester](classes/ApiTester.md) help invoke and assert FaasJS APIs in tests.

## Usage: Shared Vite Preset

```ts
import { ViteConfig } from '@faasjs/dev'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  ...ViteConfig,
})
```

## Usage: Manual Vite Integration

```ts
import { viteFaasJsServer, OxfmtConfig, OxlintConfig } from '@faasjs/dev'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  plugins: [react(), viteFaasJsServer()],
  fmt: OxfmtConfig,
  lint: OxlintConfig,
})
```

## Usage: Type Generation

```ts
import { generateFaasTypes } from '@faasjs/dev'

await generateFaasTypes()
```

## Usage: Test Helpers

```ts
import { testApi } from '@faasjs/dev'
import api from '../demo.api'

const handler = testApi(api)
const response = await handler({ name: 'FaasJS' })

expect(response.statusCode).toBe(200)
expect(response.data).toEqual({ message: 'Hello, FaasJS' })
```

## API

- Vite: [viteFaasJsServer](functions/viteFaasJsServer.md)
- Config: [ViteConfig](variables/ViteConfig.md), [OxfmtConfig](variables/OxfmtConfig.md), [OxlintConfig](variables/OxlintConfig.md)
- Typegen: [generateFaasTypes](functions/generateFaasTypes.md), [isTypegenInputFile](functions/isTypegenInputFile.md)
- Test: [testApi](functions/testApi.md), [ApiTester](classes/ApiTester.md)

## Functions

- [closeAll](functions/closeAll.md)
- [defineApi](functions/defineApi.md)
- [generateFaasTypes](functions/generateFaasTypes.md)
- [getAll](functions/getAll.md)
- [isTypegenInputFile](functions/isTypegenInputFile.md)
- [nameFunc](functions/nameFunc.md)
- [parseApiFilenameFromStack](functions/parseApiFilenameFromStack.md)
- [staticHandler](functions/staticHandler.md)
- [testApi](functions/testApi.md)
- [useMiddleware](functions/useMiddleware.md)
- [useMiddlewares](functions/useMiddlewares.md)
- [viteFaasJsServer](functions/viteFaasJsServer.md)

## Classes

- [ApiTester](classes/ApiTester.md)
- [Cookie](classes/Cookie.md)
- [Func](classes/Func.md)
- [Http](classes/Http.md)
- [HttpError](classes/HttpError.md)
- [Server](classes/Server.md)
- [Session](classes/Session.md)

## Interfaces

- [DefineApiInject](interfaces/DefineApiInject.md)

## Type Aliases

- [Config](type-aliases/Config.md)
- [CookieOptions](type-aliases/CookieOptions.md)
- [DefineApiData](type-aliases/DefineApiData.md)
- [ExportedHandler](type-aliases/ExportedHandler.md)
- [FuncConfig](type-aliases/FuncConfig.md)
- [FuncEventType](type-aliases/FuncEventType.md)
- [FuncReturnType](type-aliases/FuncReturnType.md)
- [FuncRuntime](type-aliases/FuncRuntime.md)
- [GenerateFaasTypesOptions](type-aliases/GenerateFaasTypesOptions.md)
- [GenerateFaasTypesResult](type-aliases/GenerateFaasTypesResult.md)
- [Handler](type-aliases/Handler.md)
- [HttpConfig](type-aliases/HttpConfig.md)
- [HttpResponseBody](type-aliases/HttpResponseBody.md)
- [HttpSetBody](type-aliases/HttpSetBody.md)
- [HttpSetContentType](type-aliases/HttpSetContentType.md)
- [HttpSetHeader](type-aliases/HttpSetHeader.md)
- [HttpSetStatusCode](type-aliases/HttpSetStatusCode.md)
- [InvokeData](type-aliases/InvokeData.md)
- [JsonHandlerBody](type-aliases/JsonHandlerBody.md)
- [JsonHandlerOptions](type-aliases/JsonHandlerOptions.md)
- [JsonHandlerResult](type-aliases/JsonHandlerResult.md)
- [LifecycleKey](type-aliases/LifecycleKey.md)
- [Middleware](type-aliases/Middleware.md)
- [MiddlewareContext](type-aliases/MiddlewareContext.md)
- [MiddlewareEvent](type-aliases/MiddlewareEvent.md)
- [MountData](type-aliases/MountData.md)
- [Next](type-aliases/Next.md)
- [Plugin](type-aliases/Plugin.md)
- [Response](type-aliases/Response.md)
- [RuntimeContext](type-aliases/RuntimeContext.md)
- [ServerHandlerOptions](type-aliases/ServerHandlerOptions.md)
- [ServerOptions](type-aliases/ServerOptions.md)
- [SessionContent](type-aliases/SessionContent.md)
- [SessionOptions](type-aliases/SessionOptions.md)
- [StaticHandlerOptions](type-aliases/StaticHandlerOptions.md)
- [TestApiHandler](type-aliases/TestApiHandler.md)

## Variables

- [ContentType](variables/ContentType.md)
- [OxfmtConfig](variables/OxfmtConfig.md)
- [OxlintConfig](variables/OxlintConfig.md)
- [ViteConfig](variables/ViteConfig.md)
