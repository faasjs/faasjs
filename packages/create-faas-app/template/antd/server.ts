import { dirname, join } from 'node:path'
import { loadEnvFile } from 'node:process'
import { fileURLToPath } from 'node:url'

import { Server, staticHandler } from '@faasjs/core'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

try {
  loadEnvFile()
} catch (error) {
  console.warn('[faasjs] Failed to load env file', error)
}

const publicHandler = staticHandler({
  root: join(__dirname, 'public'),
  notFound: false,
})

const distHandler = staticHandler({
  root: join(__dirname, 'dist'),
  notFound: 'index.html',
})

new Server(join(__dirname, 'src'), {
  beforeHandle: async (req, res, ctx) => {
    if (!req.url || req.method !== 'GET') return

    await publicHandler(req, res, ctx)
    await distHandler(req, res, ctx)
  },
}).listen()
