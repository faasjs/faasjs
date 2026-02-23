import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Server, staticHandler } from '@faasjs/core'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const distHandler = staticHandler({
  root: join(__dirname, 'dist'),
  notFound: 'index.html',
})

new Server(join(__dirname, 'src'), {
  beforeHandle: async (req, res, ctx) => {
    if (!req.url || req.method !== 'GET') return

    await distHandler(req, res, ctx)
  },
}).listen()
