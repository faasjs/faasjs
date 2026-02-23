import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Server } from '@faasjs/core'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

new Server(join(__dirname, 'src')).listen()
