import { afterAll } from 'vitest'

import { startPGliteServer } from './pglite'

const server = await startPGliteServer()

process.env.DATABASE_URL = server.databaseUrl

afterAll(async () => {
  await server.stop()
})
