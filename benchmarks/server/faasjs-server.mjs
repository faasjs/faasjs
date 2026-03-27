import { join } from 'node:path'

import { Server } from '@faasjs/core'

process.env.FaasLog = 'error'
process.env.FaasLogTransport = 'false'

const rootPath = join(process.cwd(), 'server', 'raw')

new Server(rootPath, {
  port: 3000,
}).listen()
