import { join } from 'node:path'
import { Server } from '@faasjs/core'

process.env.FaasLog = process.env.FaasLog || 'error'

const rootPath = join(process.cwd(), 'server', 'raw')

new Server(rootPath, {
  port: 3000,
}).listen()
