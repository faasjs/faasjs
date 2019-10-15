import { Pool, PoolConfig, QueryResult } from 'pg';
import { Adapter } from './index';

export interface PostgresqlConfig extends PoolConfig {
  pool?: Pool;
  [key: string]: any;
}

const defaults = {
  port: 5432,
  max: 1
};

export class Postgresql implements Adapter {
  public pool: any;

  constructor (config: PostgresqlConfig) {
    if (config.pool) {
      this.pool = config.pool;
    } else {
      const Pool = require('pg').Pool;
      this.pool = new Pool(Object.assign(defaults, config));
    }
  }

  public query (sql: string, values?: any): Promise<any[]> {
    return this.pool.query(sql, values).then((results: QueryResult) => results.rows);
  }
}
