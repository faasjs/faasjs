import {
  Pool, PoolConfig, QueryResult 
} from 'pg'
import { Adapter } from './index'

export interface PostgresqlConfig extends PoolConfig {
  [key: string]: any
  password?: string
  pool?: Pool
}

const defaults = {
  port: 5432,
  max: 1
}

export class Postgresql implements Adapter {
  public pool: any

  constructor (config: PostgresqlConfig) {
    if (config.pool) this.pool = config.pool; else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Pool = require('pg').Pool
      this.pool = new Pool(Object.assign(defaults, config))
    }
  }

  public async query (sql: string, values?: any[]): Promise<any[]> {
    return await this.pool.query(sql, values).then((results: QueryResult) => results.rows)
  }
}
