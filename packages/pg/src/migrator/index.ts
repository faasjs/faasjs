import { existsSync, globSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'

import { Logger } from '@faasjs/node-utils'

import type { Client } from '../client'
import { SchemaBuilder } from '../schema-builder'

/**
 * The `Migrator` class is responsible for handling database migrations.
 * It provides methods to check migration status, apply migrations, and roll back migrations.
 *
 * @param {Object} options - The options for the migrator.
 * @param {Client} options.client - The database client.
 * @param {string} options.folder - The folder containing migration files.
 */
export class Migrator {
  private client: Client
  private folder: string
  private logger: Logger

  constructor(options: { client: Client; folder: string }) {
    this.logger = new Logger('Migrator')

    this.client = options.client
    this.folder = resolve(options.folder)

    if (!existsSync(this.folder)) throw Error(`Migration folder not found: ${this.folder}`)
  }

  async status() {
    await this.createMigrationTable()
    return this.client.raw`SELECT * FROM faasjs_pg_migrations`
  }

  async migrate() {
    const files = globSync(join(this.folder, '*.ts'))

    if (!files.length) {
      this.logger.error('No migration files found:', this.folder)
      return
    }

    await this.createMigrationTable()
    const migrations = await this.client.raw`SELECT * FROM faasjs_pg_migrations`

    const builder = new SchemaBuilder(this.client)

    for (const file of files) {
      const name = basename(file).replace('.ts', '')
      const up = (await import(file)).up

      if (migrations.find((m: any) => m.name === name)) {
        this.logger.debug('Migration already ran:', name)
        continue
      }

      this.logger.info('Migrating:', name)

      try {
        up(builder)
        await builder.run()

        await this.client
          .raw`INSERT INTO faasjs_pg_migrations (name, migration_time) VALUES (${name}, NOW())`
      } catch (error) {
        this.logger.error('Migrate failed:', name, error)
        return Promise.reject(error)
      }
    }
  }

  async up() {
    const files = globSync(join(this.folder, '*.ts'))

    if (!files.length) {
      this.logger.error('No migration files found:', this.folder)
      return
    }

    await this.createMigrationTable()

    const migrations = await this.client
      .raw`SELECT * FROM faasjs_pg_migrations ORDER BY migration_time DESC LIMIT 1`

    const lastMigration = migrations[0]

    const nextFile = files.find((file) => basename(file).replace('.ts', '') > lastMigration?.name)

    if (!nextFile) {
      this.logger.error('No pending migrations found')
      return
    }

    const name = basename(nextFile).replace('.ts', '')

    const builder = new SchemaBuilder(this.client)

    this.logger.info('Migrating:', name)

    try {
      const { up } = await import(nextFile)
      up(builder)
      await builder.run()

      await this.client
        .raw`INSERT INTO faasjs_pg_migrations (name, migration_time) VALUES (${name}, NOW())`
    } catch (error) {
      this.logger.error('Migrate failed:', name, error)
      return Promise.reject(error)
    }
  }

  async down() {
    const files = globSync(join(this.folder, '*.ts'))

    if (!files.length) {
      this.logger.error('No migration files found:', this.folder)
      return
    }

    await this.createMigrationTable()
    const migrations = await this.client
      .raw`SELECT * FROM faasjs_pg_migrations ORDER BY migration_time DESC LIMIT 1`

    const lastMigration = migrations[0]

    if (!lastMigration) {
      this.logger.error('No migrations found')
      return
    }

    const file = join(this.folder, `${lastMigration.name}.ts`)

    if (!existsSync(file)) {
      this.logger.error('Migration file not found:', file)
      return
    }

    const builder = new SchemaBuilder(this.client)

    this.logger.info('Rolling back:', lastMigration.name)

    try {
      const { down } = await import(file)
      down(builder)
      await builder.run()

      await this.client.raw`DELETE FROM faasjs_pg_migrations WHERE name = ${lastMigration.name}`
    } catch (error) {
      this.logger.error('Rollback failed:', lastMigration.name, error)
      return Promise.reject(error)
    }
  }

  async createMigrationTable() {
    return this.client.raw`CREATE TABLE IF NOT EXISTS faasjs_pg_migrations (
      "name" varchar(255) NULL,
      migration_time timestamptz NULL,
      CONSTRAINT faasjs_pg_migrations_pkey PRIMARY KEY (name)
    )`
  }
}
