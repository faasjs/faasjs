# Logger Guide

Use this guide when you need readable runtime logs in FaasJS handlers, middleware, cron jobs, server hooks, or standalone Node.js scripts.

## Use This Guide When

- writing logs inside middleware, plugins, or cron jobs
- adding request, lifecycle, or failure logs to a FaasJS server
- creating a standalone script that needs a shared logger
- timing slow operations
- tuning log noise for local development, CI, or production

## Default Workflow

1. Reuse the injected `logger` when FaasJS already gives you one.
2. Create `new Logger('label')` only for standalone scripts, adapters, or infrastructure code.
3. Use `debug` for details, `info` for normal milestones, `warn` for degraded paths, and `error` for failures.
4. Keep labels short and stable so related logs stay easy to scan.
5. Use `time()` and `timeEnd()` around slow steps.
6. Change verbosity with environment variables before changing log call sites.

## Rules

### 1. Prefer the injected logger when the framework provides one

- In FaasJS runtime code, `logger` is often already part of the callback context.
- Reuse that logger so labels, timing, and transport behavior stay consistent with the runtime.
- Do not create a second logger inside the same request or cron callback unless you have a very specific reason.

Middleware example:

```ts
import { useMiddleware } from '@faasjs/core'

export default useMiddleware((request, response, { logger }) => {
  logger.info('%s %s', request.method, request.url)

  response.end('ok')
})
```

Cron job example:

```ts
import { CronJob } from '@faasjs/core'

const job = new CronJob({
  expression: '0 * * * *',
  async handler({ logger }) {
    logger.info('run cleanup')
  },
})
```

### 2. Create a labeled logger for standalone code

- Use `new Logger('label')` in scripts, CLIs, build tools, or custom adapters.
- A good label explains where the log came from without becoming noisy.
- Prefer labels like `seed`, `typegen`, `server`, or `sync:users`.

```ts
import { Logger } from '@faasjs/node-utils'

const logger = new Logger('seed')

logger.info('start importing users')
logger.info('loaded config %o', { region: 'cn', dryRun: false })
```

### 3. Choose levels by intent

- `debug`: internal steps, params, cache hits, and other noisy diagnostics
- `info`: expected lifecycle messages such as startup, shutdown, and successful jobs
- `warn`: recoverable problems, fallbacks, skipped work, or unusual states
- `error`: failures that need attention
- Pass an `Error` object directly to `logger.error(error)` when you have one

Prefer this:

```ts
try {
  await syncUsers()
  logger.info('sync completed')
} catch (error) {
  logger.error(error)
}
```

Over manually stringifying the error first.

### 4. Use format strings instead of building large strings by hand

- `Logger` supports format-style messages, which keeps logs compact and readable.
- Reach for `%s` for text, `%d` for numbers, `%j` for JSON, and `%o` for inspected objects.
- This is usually clearer than manual concatenation or eager `JSON.stringify()`.

```ts
logger.debug('user=%s retries=%d payload=%j', user.id, retries, payload)
```

### 5. Time slow operations with `time()` and `timeEnd()`

- Use timers for network calls, database work, file IO, or startup hooks.
- Keep the timer key stable and make sure `timeEnd()` uses the same key.
- If the key is missing, FaasJS logs a warning, so mismatches are easy to spot.

```ts
logger.time('load-user', 'info')

const user = await loadUser(id)

logger.timeEnd('load-user', 'loaded user %s', user.id)
```

### 6. Tune output with environment variables

- `FaasLog=debug|info|warn|error` sets the minimum level
- `FaasLogMode=plain` disables ANSI colors
- `FaasLogMode=pretty` forces colorized terminal output
- `FaasLogSize=2000` changes the truncation threshold for long non-error logs
- `FaasLogTransport=true|false` enables or disables shared transport forwarding

Examples:

```bash
FaasLog=info npx vp test
FaasLog=debug FaasLogMode=plain node ./scripts/sync-users.ts
```

### 7. Use transport only when you really need log shipping

- `Logger` forwards messages to the shared transport by default.
- Reach for `getTransport()` when you want to batch logs into another system.
- If you register transport handlers, flush them during shutdown so buffered logs are not lost.

```ts
import { getTransport } from '@faasjs/node-utils'

const transport = getTransport()

transport.register('shipper', async (messages) => {
  for (const message of messages) {
    await sendToRemote(message)
  }
})

process.on('SIGINT', async () => {
  await transport.stop()
  process.exit(0)
})
```

### 8. Do not log secrets or full sensitive payloads

- Avoid logging tokens, cookies, session content, passwords, or raw request bodies by default.
- Be extra careful with `debug` logs because they often survive in CI logs and incident reports.
- If you must log request context, prefer IDs, counts, and safe summaries.

## Review Checklist

- injected loggers are reused where available
- labels are short, stable, and meaningful
- `debug` is used for noisy diagnostics instead of `info`
- caught errors are logged with `logger.error(error)` when possible
- slow steps use `time()` and `timeEnd()` with matching keys
- environment variables are used to change verbosity
- secrets and sensitive payloads are not logged
- transport handlers call `stop()` during shutdown when transport is enabled

## Read Next

- [@faasjs/node-utils package reference](../references/packages/node-utils/README.md)
- [Logger](../references/packages/node-utils/classes/Logger.md)
- [getTransport](../references/packages/node-utils/functions/getTransport.md)
- [formatLogger](../references/packages/node-utils/functions/formatLogger.md)
- [useMiddleware](../references/packages/core/functions/useMiddleware.md)
- [CronJob](../references/packages/core/classes/CronJob.md)
- [ServerOptions](../references/packages/core/type-aliases/ServerOptions.md)
