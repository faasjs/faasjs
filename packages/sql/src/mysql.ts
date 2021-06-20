import { Pool, ConnectionOptions } from 'mysql2';
import { Adapter } from './index';

export interface MysqlConfig extends ConnectionOptions {
  [key: string]: any
  pool?: Pool
}

const defaults = {
  connectionLimit: 1,
  port: 3306
};

export class Mysql implements Adapter {
  public pool: Pool

  constructor (config: MysqlConfig) {
    if (config.pool != null) this.pool = config.pool; else
    // eslint-disable-next-line @typescript-eslint/no-var-requires
      this.pool = require('mysql2').createPool(Object.assign(defaults, config));
  }

  public async query (sql: string, values?: any[]): Promise<any[]> {
    // eslint-disable-next-line @typescript-eslint/typedef
    return new Promise((resolve, reject) => {
      this.pool.query(sql, values, (error: any, results: any[]) => {
        if (error) reject(error);

        resolve(results);
      });
    });
  }
}
