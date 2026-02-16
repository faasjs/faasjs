import type { Knex as OriginKnex } from 'knex'

const DefaultMigratorConfig: OriginKnex.MigratorConfig = {
  directory: './src/db/migrations',
  extension: 'ts',
}

/**
 * Migration helper for FaasJS's knex plugin.
 */
export class KnexSchema {
  public readonly knex: {
    name: string
    adapter?: OriginKnex
    config: OriginKnex.Config
  }

  constructor(knex: {
    name: string
    adapter?: OriginKnex
    config: OriginKnex.Config
  }) {
    this.knex = knex
  }

  private getAdapter(): OriginKnex {
    if (!this.knex.adapter)
      throw Error(`[${this.knex.name}] Client not initialized.`)

    return this.knex.adapter
  }

  private getMigratorConfig(): OriginKnex.MigratorConfig {
    return Object.assign(
      {},
      DefaultMigratorConfig,
      this.knex.config?.migrations || Object.create(null)
    )
  }

  public async migrateLatest(): Promise<any> {
    return this.getAdapter().migrate.latest(this.getMigratorConfig())
  }

  public async migrateRollback(): Promise<any> {
    return this.getAdapter().migrate.rollback(this.getMigratorConfig())
  }

  public async migrateStatus(): Promise<number> {
    return this.getAdapter().migrate.status(this.getMigratorConfig())
  }

  public async migrateCurrentVersion(): Promise<string> {
    return this.getAdapter().migrate.currentVersion(this.getMigratorConfig())
  }

  public async migrateMake(name: string): Promise<string> {
    const migrationName = name?.trim()

    if (!migrationName)
      throw Error(
        '[KnexSchema] Missing migration name. Usage: npm run migrate:make -- create_users'
      )

    return this.getAdapter().migrate.make(
      migrationName,
      this.getMigratorConfig()
    )
  }
}
