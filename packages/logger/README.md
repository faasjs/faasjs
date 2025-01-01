# @faasjs/logger

FaasJS's logger module.

[![License: MIT](https://img.shields.io/npm/l/@faasjs/logger.svg)](https://github.com/faasjs/faasjs/blob/main/packages/logger/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@faasjs/logger.svg)](https://www.npmjs.com/package/@faasjs/logger)

## Install

```sh
npm install @faasjs/logger
```

## Usage

```typescript
import { Logger } from '@faasjs/logger'

const logger = new Logger()

logger.debug('debug message')
logger.info('info message')
logger.warn('warn message')
logger.error('error message')
```

### Support environment variables

- **FaasLog**: debug, info, warn, error (default: debug)
- **FaasLogSize**: 1000 (default: 1000, 0 for unlimited)
- **FaasLogMode**: plain, pretty (default: pretty)

## Functions

- [flushTransportMessages](functions/flushTransportMessages.md)
- [getTransport](functions/getTransport.md)
- [insertMessageToTransport](functions/insertMessageToTransport.md)
- [registerTransportHandler](functions/registerTransportHandler.md)
- [resetTransport](functions/resetTransport.md)
- [startTransport](functions/startTransport.md)
- [stopTransport](functions/stopTransport.md)
- [unregisterTransportHandler](functions/unregisterTransportHandler.md)

## Classes

- [Logger](classes/Logger.md)

## Enumerations

- [Color](enumerations/Color.md)

## Type Aliases

- [Level](type-aliases/Level.md)
- [LoggerMessage](type-aliases/LoggerMessage.md)
- [TransportHandler](type-aliases/TransportHandler.md)
- [TransportOptions](type-aliases/TransportOptions.md)

## Variables

- [CachedMessages](variables/CachedMessages.md)
