import { join, resolve } from 'node:path'

import { Server, reactSsrHandler } from '@faasjs/core'

function resolvePort(value = process.env.PORT) {
  const port = Number(value || 3000)

  if (Number.isInteger(port) && port > 0) return port

  return 3000
}

const root = resolve(process.cwd())

new Server(join(root, 'src'), {
  port: resolvePort(),
  beforeHandle: reactSsrHandler({
    root: join(root, 'dist'),
    serverRoot: join(root, 'dist-server'),
  }),
}).listen()
