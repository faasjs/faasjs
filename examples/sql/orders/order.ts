import { Sql } from '@faasjs/sql';
import knex from 'knex';

export interface Order {
  id: number;
  user_id: number;
  price: number;
}

export function Orders (sql: Sql) {
  return knex<Order>({
    client: sql.adapterType
  })
    .from('orders')
    .connection(sql.adapter!.pool);
}

export function CreateOrders (sql: Sql) {
  return knex({
    client: sql.adapterType
  })
    .schema
    .connection(sql.adapter!.pool)
    .dropTableIfExists('orders')
    .createTable('orders', function (t) {
      t.integer('id').notNullable();
      t.integer('user_id').notNullable();
      t.integer('price').notNullable().defaultTo(0);
    });
}
