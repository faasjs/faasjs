import { Database } from 'sqlite3';
import { Adapter } from './index';

export interface SqliteConfig {
  [key: string]: any
  pool?: Database
  filename?: string
}

export class Sqlite implements Adapter {
  public pool: any

  constructor (config: SqliteConfig) {
    if (config.pool != null) this.pool = config.pool; else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Database = require('sqlite3').Database;
      this.pool = new Database(config.filename || ':memory:');
    }
  }

  public async query (sql: string, values?: { [key: string]: any }): Promise<any[]> {
    // eslint-disable-next-line @typescript-eslint/typedef
    return await new Promise((resolve, reject) => {
      this.pool.all(sql, values, (error: any, results: any[]) => {
        if (error) reject(error); 

        resolve(results);
      });
    });
  }
}
