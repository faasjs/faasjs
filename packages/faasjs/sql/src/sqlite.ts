import { Database } from 'sqlite3';
import { Adapter } from './index';

export interface SqliteConfig {
  pool?: Database;
  filename?: string;
  [key: string]: any;
}

export class Sqlite implements Adapter {
  public pool: any;

  constructor (config: SqliteConfig) {
    if (config.pool) {
      this.pool = config.pool;
    } else {
      const Database = require('sqlite3').Database;
      this.pool = new Database(config.filename || ':memory:');
    }
  }

  public query (sql: string, values?: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.pool.all(sql, values, (error: any, results: any[]) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });
  }
}
