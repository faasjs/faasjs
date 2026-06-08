# @faasjs/node-utils

# @faasjs/node-utils

FaasJS utilities for Node.js runtimes and local development workflows.

The package bundles logging helpers, shared transport primitives, `faas.yaml`
configuration loaders, schema parsing helpers, filesystem guards, and
runtime-aware module loading helpers for Node.js.

## Install

```sh
npm install @faasjs/node-utils
```

## Usage

```ts
import { z } from '@faasjs/utils'
import { Logger, loadConfig, parseSchemaValue } from '@faasjs/node-utils'

const logger = new Logger('app')
const config = loadConfig(process.cwd(), '/project/src/hello.api.ts', 'development')
const params = await parseSchemaValue({
  schema: z.object({
    page: z.coerce.number().default(1),
  }),
  value: { page: '1' },
  errorMessage: 'Invalid params',
})

logger.info('Loaded config %o with params %o', config, params)
```

## Functions

- [colorize](functions/colorize.md)
- [formatLogger](functions/formatLogger.md)
- [formatSchemaError](functions/formatSchemaError.md)
- [getTransport](functions/getTransport.md)
- [isPathInsideRoot](functions/isPathInsideRoot.md)
- [loadApiHandler](functions/loadApiHandler.md)
- [loadConfig](functions/loadConfig.md)
- [loadPackage](functions/loadPackage.md)
- [loadPlugins](functions/loadPlugins.md)
- [parseSchemaValue](functions/parseSchemaValue.md)
- [registerNodeModuleHooks](functions/registerNodeModuleHooks.md)
- [resetRuntime](functions/resetRuntime.md)

## Classes

- [Logger](classes/Logger.md)
- [Transport](classes/Transport.md)

## Type Aliases

- [ExportedHandler](type-aliases/ExportedHandler.md)
- [FuncConfig](type-aliases/FuncConfig.md)
- [FuncPluginConfig](type-aliases/FuncPluginConfig.md)
- [Level](type-aliases/Level.md)
- [LoadPluginsOptions](type-aliases/LoadPluginsOptions.md)
- [LoggerMessage](type-aliases/LoggerMessage.md)
- [ParseSchemaValueOptions](type-aliases/ParseSchemaValueOptions.md)
- [RegisterNodeModuleHooksOptions](type-aliases/RegisterNodeModuleHooksOptions.md)
- [SchemaOutput](type-aliases/SchemaOutput.md)
- [TransportHandler](type-aliases/TransportHandler.md)
- [TransportOptions](type-aliases/TransportOptions.md)

## Variables

- [Color](variables/Color.md)
- [LevelColor](variables/LevelColor.md)
