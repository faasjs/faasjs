import { existsSync, globSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { Migrator, createClient } from '@faasjs/pg'

import { startPGliteServer, type StartedPGliteServer } from './pglite'

function resolveMigrationsFolder(projectRoot: string) {
  return resolve(projectRoot, 'migrations')
}

export async function runTestingMigrations(projectRoot: string, databaseUrl: string) {
  const migrationsFolder = resolveMigrationsFolder(projectRoot)

  if (!existsSync(migrationsFolder) || !globSync(join(migrationsFolder, '*.ts')).length) {
    return
  }

  const client = createClient(databaseUrl, {
    max: 1,
    ssl: false,
  })

  try {
    await new Migrator({ client, folder: migrationsFolder }).migrate()
  } finally {
    await client.quit()
  }
}

export async function startTestingServer(projectRoot: string) {
  const testingServer = await startPGliteServer()

  try {
    await runTestingMigrations(projectRoot, testingServer.databaseUrl)
    return testingServer
  } catch (error) {
    await testingServer.stop()
    throw error
  }
}

export async function stopTestingServers(testingServers: StartedPGliteServer[]) {
  await Promise.allSettled(testingServers.map((testingServer) => testingServer.stop()))
}
