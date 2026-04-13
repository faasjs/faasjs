import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Server, staticHandler } from '@faasjs/core'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function resolvePort(value = process.env.PORT) {
  const port = Number(value || 3000)

  if (Number.isInteger(port) && port > 0) return port

  return 3000
}

const distHandler = staticHandler({
  root: join(__dirname, 'dist'),
  notFound: 'index.html',
})

new Server(join(__dirname, 'src'), {
  port: resolvePort(),
  beforeHandle: async (req, res, ctx) => {
    if (!req.url) return
    if (req.method !== 'GET' && req.method !== 'HEAD') return

    await distHandler(req, res, ctx)
  },
}).listen()
