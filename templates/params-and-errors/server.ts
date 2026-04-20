import { dirname, join } from 'node:path'
import { loadEnvFile } from 'node:process'
import { fileURLToPath } from 'node:url'

import { Server } from '@faasjs/core'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

try {
  loadEnvFile()
} catch (error) {
  console.warn('[faasjs] Failed to load env file', error)
}

new Server(join(__dirname, 'src')).listen()
