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

- [generateFaasTypes](functions/generateFaasTypes.md)
- [isTypegenInputFile](functions/isTypegenInputFile.md)
- [testApi](functions/testApi.md)
- [viteFaasJsServer](functions/viteFaasJsServer.md)

## Classes

- [ApiTester](classes/ApiTester.md)

## Type Aliases

- [GenerateFaasTypesOptions](type-aliases/GenerateFaasTypesOptions.md)
- [GenerateFaasTypesResult](type-aliases/GenerateFaasTypesResult.md)
- [JsonHandlerBody](type-aliases/JsonHandlerBody.md)
- [JsonHandlerOptions](type-aliases/JsonHandlerOptions.md)
- [JsonHandlerResult](type-aliases/JsonHandlerResult.md)
- [TestApiHandler](type-aliases/TestApiHandler.md)

## Variables

- [OxfmtConfig](variables/OxfmtConfig.md)
- [OxlintConfig](variables/OxlintConfig.md)
- [ViteConfig](variables/ViteConfig.md)
