import { Pool, PoolConfig } from 'mysql';
import { Adapter } from './index';

export interface MysqlConfig extends PoolConfig {
  [key: string]: any;
  pool?: Pool;
}

const defaults = {
  connectionLimit: 1,
  port: 3306
};

export class Mysql implements Adapter {
  public pool: Pool;

  constructor (config: MysqlConfig) {
    if (config.pool) 
      this.pool = config.pool;
    else 
      this.pool = require('mysql').createPool(Object.assign(defaults, config));
  }

  public async query (sql: string, values?: any): Promise<any[]> {
    // eslint-disable-next-line @typescript-eslint/typedef
    return new Promise((resolve, reject) => {
      this.pool.query(sql, values, (error: any, results: any[]) => {
        if (error) 
          reject(error);
        
        resolve(results);
      });
    });
  }
}
