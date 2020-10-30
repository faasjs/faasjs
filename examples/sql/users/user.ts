import { Sql } from '@faasjs/sql';
import knex from 'knex';

export interface User {
  id: number;
  name: string;
}

export function Users (sql: Sql) {
  return knex<User>({
    client: sql.adapterType
  })
    .from('users')
    .connection(sql.adapter!.pool);
}

export function CreateUsers (sql: Sql) {
  return knex({
    client: sql.adapterType
  })
    .schema
    .connection(sql.adapter!.pool)
    .dropTableIfExists('users')
    .createTable('users', function (t) {
      t.integer('id').notNullable();
      t.string('name').notNullable();
    });
}
