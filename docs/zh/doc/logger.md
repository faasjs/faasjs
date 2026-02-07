# @faasjs/logger

日志模块，提供统一的 debug/info/warn/error 输出。

## 安装

```bash
npm install @faasjs/logger
```

## 基本用法

```ts
import { Logger } from '@faasjs/logger'

const logger = new Logger('demo')

logger.debug('debug message')
logger.info('info message')
logger.warn('warn message')
logger.error('error message')
```

## 常用环境变量

- `FaasLog`: `debug | info | warn | error`
- `FaasLogMode`: `plain | pretty`
- `FaasLogSize`: 日志长度限制
- `FaasLogTransport`: 是否启用 transport
