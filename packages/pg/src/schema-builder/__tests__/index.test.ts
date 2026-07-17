import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { SchemaBuilder } from '../..'
import { type Client, createClient } from '../../client'

describe('SchemaBuilder', () => {
  const client: Client = createClient(process.env.DATABASE_URL!)

  beforeEach(async () => {
    await client.raw('DROP TABLE IF EXISTS raws CASCADE')
    await client.raw('DROP TABLE IF EXISTS alters CASCADE')
    await client.raw('DROP TABLE IF EXISTS creators CASCADE')
  })

  afterAll(async () => {
    await client.quit()
  })

  it('createTable', async () => {
    const builder = new SchemaBuilder(client)

    builder.createTable('creators', (table) => {
      table.string('string').primary().unique()
      table.number('number').defaultTo(0)
      table.boolean('boolean').defaultTo(true)
      table.date('date').defaultTo('now()')
      table.json('json').defaultTo({})
      table.jsonb('jsonb').defaultTo('{}')
      table.jsonb('jsonb-list').defaultTo('[]')
      table.timestamp('timestamp')
      table.timestamptz('timestamptz')
      table.timestamps()
      table.specificType('uuid_list', 'uuid[]')

      table.index('string')
    })

    await builder.run()

    const tables = await client.raw(
      'SELECT * FROM information_schema.tables WHERE table_name = ?',
      'creators',
    )
    expect(tables[0]).toMatchObject({ table_name: 'creators' })

    const columns = await client.raw(
      'SELECT * FROM information_schema.columns WHERE table_name = ?',
      'creators',
    )

    for (const column of [
      { column_name: 'string', data_type: 'character varying' },
      { column_name: 'number', data_type: 'integer' },
      { column_name: 'boolean', data_type: 'boolean' },
      { column_name: 'date', data_type: 'date' },
      { column_name: 'json', data_type: 'json' },
      { column_name: 'jsonb', data_type: 'jsonb' },
      { column_name: 'jsonb-list', data_type: 'jsonb' },
      { column_name: 'timestamp', data_type: 'timestamp without time zone' },
      { column_name: 'timestamptz', data_type: 'timestamp with time zone' },
      {
        column_name: 'created_at',
        data_type: 'timestamp with time zone',
        column_default: 'now()',
      },
      {
        column_name: 'updated_at',
        data_type: 'timestamp with time zone',
        column_default: 'now()',
      },
      { column_name: 'uuid_list', data_type: 'ARRAY', udt_name: '_uuid' },
    ]) {
      expect(columns.find((c) => c.column_name === column.column_name)).toMatchObject(column)
    }

    const indices = await client.raw('SELECT * FROM pg_indexes WHERE tablename = ?', 'creators')

    expect(indices.find((i) => i.indexname.includes('creators_pkey'))).toMatchObject({
      schemaname: 'public',
      tablename: 'creators',
      indexname: 'creators_pkey',
      tablespace: null,
      indexdef: 'CREATE UNIQUE INDEX creators_pkey ON public.creators USING btree (string)',
    })

    expect(indices.find((i) => i.indexname.includes('idx_creators_string'))).toMatchObject({
      schemaname: 'public',
      tablename: 'creators',
      indexname: 'idx_creators_string',
      tablespace: null,
      indexdef: 'CREATE INDEX idx_creators_string ON public.creators USING btree (string)',
    })
  })

  it('alterTable', async () => {
    const builder = new SchemaBuilder(client)

    builder.createTable('alters', (table) => {
      table.string('string').primary()
      table.timestamps()
    })

    await builder.run()

    builder.alterTable('alters', (table) => {
      table.renameColumn('string', 'new_string')
      table.number('number')
      table.dropColumn('created_at')
      table.alterColumn('string', {
        primary: false,
      })
      table.alterColumn('updated_at', {
        type: 'date',
        defaultValue: null,
        primary: true,
        unique: true,
        check: 'updated_at > now()',
      })
      table.index('number', {
        unique: true,
        indexType: 'btree',
      })
      table.raw('SELECT 1')
    })

    await builder.run()

    const columns = await client.raw(
      'SELECT * FROM information_schema.columns WHERE table_name = ?',
      'alters',
    )

    for (const column of [
      { column_name: 'new_string', data_type: 'character varying' },
      { column_name: 'number', data_type: 'integer' },
      { column_name: 'updated_at', data_type: 'date', column_default: null },
    ]) {
      expect(columns.find((c) => c.column_name === column.column_name)).toMatchObject(column)
    }

    const indices = await client.raw('SELECT * FROM pg_indexes WHERE tablename = ?', 'alters')

    expect(indices.find((i) => i.indexname.includes('alters_pkey'))).toMatchObject({
      schemaname: 'public',
      tablename: 'alters',
      indexname: 'alters_pkey',
      tablespace: null,
      indexdef: 'CREATE UNIQUE INDEX alters_pkey ON public.alters USING btree (updated_at)',
    })

    expect(indices.find((i) => i.indexname.includes('idx_alters_number'))).toMatchObject({
      schemaname: 'public',
      tablename: 'alters',
      indexname: 'idx_alters_number',
      tablespace: null,
      indexdef: 'CREATE UNIQUE INDEX idx_alters_number ON public.alters USING btree (number)',
    })
  })

  it('executes foreign key and unique constraint alterations', async () => {
    const builder = new SchemaBuilder(client)

    builder.createTable('creators', (table) => {
      table.string('id').primary()
    })
    builder.createTable('alters', (table) => {
      table.string('id').primary()
      table.string('creator_id')
      table.string('email')
    })

    await builder.run()

    builder.alterTable('alters', (table) => {
      table.alterColumn('creator_id', {
        references: {
          table: 'creators',
          column: 'id',
        },
      })
      table.alterColumn('email', { unique: true })
    })

    await builder.run()

    const constraints = await client.raw<{
      constraint_name: string
      constraint_type: string
    }>(
      `SELECT constraint_name, constraint_type
       FROM information_schema.table_constraints
       WHERE table_name = ?
       ORDER BY constraint_name`,
      'alters',
    )

    expect(constraints).toEqual(
      expect.arrayContaining([
        {
          constraint_name: 'alters_creator_id_fkey',
          constraint_type: 'FOREIGN KEY',
        },
        {
          constraint_name: 'alters_email_key',
          constraint_type: 'UNIQUE',
        },
      ]),
    )

    await client.raw('INSERT INTO creators (id) VALUES (?)', 'creator-1')
    await client.raw(
      'INSERT INTO alters (id, creator_id, email) VALUES (?, ?, ?)',
      'alter-1',
      'creator-1',
      'one@example.com',
    )
    await expect(
      client.raw(
        'INSERT INTO alters (id, creator_id, email) VALUES (?, ?, ?)',
        'alter-2',
        'missing',
        'two@example.com',
      ),
    ).rejects.toThrow(/foreign key constraint/i)
    await expect(
      client.raw(
        'INSERT INTO alters (id, creator_id, email) VALUES (?, ?, ?)',
        'alter-3',
        'creator-1',
        'one@example.com',
      ),
    ).rejects.toThrow(/unique constraint/i)

    builder.alterTable('alters', (table) => {
      table.alterColumn('email', { unique: false })
    })

    await builder.run()

    const uniqueConstraints = await client.raw(
      `SELECT constraint_name
       FROM information_schema.table_constraints
       WHERE table_name = ? AND constraint_type = 'UNIQUE'`,
      'alters',
    )

    expect(uniqueConstraints).toEqual([])
  })

  it('renameTable', async () => {
    const builder = new SchemaBuilder(client)

    builder.createTable('creators', (table) => {
      table.string('string').primary()
    })

    await builder.run()

    builder.renameTable('creators', 'alters')

    await builder.run()

    const tables = await client.raw(
      'SELECT * FROM information_schema.tables WHERE table_name = ?',
      'alters',
    )

    expect(tables[0]).toMatchObject({ table_name: 'alters' })
  })

  it('dropTable', async () => {
    const builder = new SchemaBuilder(client)

    builder.createTable('creators', (table) => {
      table.string('string').primary()
    })

    await builder.run()

    builder.dropTable('creators')

    await builder.run()

    const tables = await client.raw(
      'SELECT * FROM information_schema.tables WHERE table_name = ?',
      'creators',
    )

    expect(tables).toHaveLength(0)
  })

  it('raw', async () => {
    const builder = new SchemaBuilder(client)

    builder.raw('CREATE TABLE raws ("id" varchar NOT NULL PRIMARY KEY);')

    await builder.run()

    const tables = await client.raw(
      'SELECT * FROM information_schema.tables WHERE table_name = ?',
      'raws',
    )

    expect(tables[0]).toMatchObject({ table_name: 'raws' })
  })

  it('runs raw statements one by one inside a transaction', async () => {
    const builder = new SchemaBuilder(client)

    builder.raw(`
      CREATE TABLE creators (
        id VARCHAR PRIMARY KEY
      )
    `)
    builder.raw(`
      CREATE TABLE raws (
        id VARCHAR PRIMARY KEY,
        creator_id VARCHAR NOT NULL REFERENCES creators(id)
      )
    `)

    await builder.run()

    const tables = await client.raw<{ table_name: string }>(
      'SELECT table_name FROM information_schema.tables WHERE table_name IN (?, ?) ORDER BY table_name',
      'creators',
      'raws',
    )

    expect(tables).toEqual([{ table_name: 'creators' }, { table_name: 'raws' }])
  })

  it('rolls back raw failures with previous schema changes', async () => {
    const builder = new SchemaBuilder(client)

    builder.createTable('creators', (table) => {
      table.string('id').primary()
    })
    builder.raw('THIS IS NOT SQL;')

    await expect(builder.run()).rejects.toThrowError('SQL:')

    const tables = await client.raw(
      'SELECT * FROM information_schema.tables WHERE table_name = ?',
      'creators',
    )

    expect(tables).toHaveLength(0)
  })
})
