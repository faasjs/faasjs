import { existsSync, globSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'

import { Logger } from '@faasjs/node-utils'

import type { Client } from '../client'
import { SchemaBuilder } from '../schema-builder'

/**
 * The `Migrator` class is responsible for handling database migrations.
 * It provides methods to check migration status, apply migrations, and roll back migrations.
 *
 * Migration files are loaded from the configured folder with lexical filename ordering.
 * Each file should export `up(builder)` and optionally `down(builder)` functions that
 * receive a {@link SchemaBuilder}. Builder changes, including raw SQL statements, are
 * executed inside `SchemaBuilder.run()` transactions.
 */
export class Migrator {
  private client: Client
  private folder: string
  private logger: Logger

  /**
   * @param options - Migration configuration.
   * @param options.client - The database client.
   * @param options.folder - The folder containing migration files.
   */
  constructor(options: { client: Client; folder: string }) {
    this.logger = new Logger('Migrator')

    this.client = options.client
    this.folder = resolve(options.folder)

    if (!existsSync(this.folder)) throw Error(`Migration folder not found: ${this.folder}`)
  }

  /**
   * Returns all applied migration records from the tracking table.
   *
   * Creates `faasjs_pg_migrations` first if needed.
   */
  async status() {
    await this.createMigrationTable()
    return this.client.raw`SELECT * FROM faasjs_pg_migrations`
  }

  /**
   * Runs all pending migration files in lexical order.
   *
   * Each migration file is loaded dynamically and its `up` function is invoked
   * with a {@link SchemaBuilder}. Changes are run in a transaction per migration.
   * Already-recorded migrations are skipped. When the folder has no `.ts` files,
   * the method logs and returns without throwing.
   */
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

  /**
   * Runs the next pending migration, if one exists.
   *
   * The "next" file is the first lexical filename greater than the latest recorded
   * migration name. When there are no files or no pending migration, the method logs
   * and returns without throwing.
   *
   * @returns A rejected promise if the migration fails.
   */
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

  /**
   * Rolls back the last applied migration by calling its `down` function.
   *
   * If no migration history exists or the matching migration file is missing, the
   * method logs and returns without modifying the tracking table.
   *
   * @returns A rejected promise if the rollback fails.
   */
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

  /**
   * Creates the `faasjs_pg_migrations` tracking table if it does not exist.
   *
   * The table uses the migration filename without `.ts` as its primary key.
   */
  async createMigrationTable() {
    return this.client.raw`CREATE TABLE IF NOT EXISTS faasjs_pg_migrations (
      "name" varchar(255) NULL,
      migration_time timestamptz NULL,
      CONSTRAINT faasjs_pg_migrations_pkey PRIMARY KEY (name)
    )`
  }
}
