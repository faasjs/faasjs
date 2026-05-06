import { requireTestingDatabaseUrl } from '@faasjs/pg-dev'
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'

import { type Client, createClient } from '../../client'
import { QueryBuilder } from '../../query-builder'

describe('QueryBuilder/mutation', () => {
  let client: Client

  beforeAll(async () => {
    client = createClient(requireTestingDatabaseUrl())

    await client.raw`
      CREATE TABLE mutation (
        id SERIAL PRIMARY KEY,
        name TEXT,
        metadata JSONB
      );
    `
  })

  afterAll(async () => {
    await client.raw`DROP TABLE mutation`

    await client.quit()
  })

  beforeEach(async () => {
    await client.raw`TRUNCATE mutation`

    await client.raw`
      INSERT INTO mutation (id, name, metadata) VALUES (1, 'Alice', '{"age":100}'), (2, 'Bob', '{}');
    `
  })

  describe('insert', () => {
    it('inserts a row', async () => {
      const returning = await new QueryBuilder(client, 'mutation').insert(
        {
          id: 3,
          name: 'Charlie',
          metadata: { age: 50 },
        },
        { returning: ['name', 'metadata'] },
      )

      expect(returning).toEqual([{ name: 'Charlie', metadata: { age: 50 } }])

      const result = await new QueryBuilder(client, 'mutation').pluck('name')

      expect(result).toEqual(['Alice', 'Bob', 'Charlie'])
    })

    it('inserts multiple rows', async () => {
      const returning = await new QueryBuilder(client, 'mutation').insert(
        [
          { id: 3, name: 'Charlie', metadata: { age: 50 } },
          { id: 4, name: 'David', metadata: { age: 25 } },
        ],
        { returning: ['name', 'metadata'] },
      )

      expect(returning).toEqual([
        { name: 'Charlie', metadata: { age: 50 } },
        { name: 'David', metadata: { age: 25 } },
      ])

      const result = await new QueryBuilder(client, 'mutation').pluck('name')

      expect(result).toEqual(['Alice', 'Bob', 'Charlie', 'David'])
    })
  })

  describe('update', () => {
    it('updates a row', async () => {
      const returning = await new QueryBuilder(client, 'mutation')
        .where('name', 'Alice')
        .update({ name: 'David' }, { returning: ['name'] })

      expect(returning).toEqual([{ name: 'David' }])

      const result = await new QueryBuilder(client, 'mutation').pluck('name')

      expect(result).toEqual(['Bob', 'David'])
    })

    it('updates multiple rows', async () => {
      const returning = await new QueryBuilder(client, 'mutation')
        .where('name', 'IN', ['Alice'])
        .update({ name: 'David' }, { returning: ['name'] })

      expect(returning).toEqual([{ name: 'David' }])

      const result = await new QueryBuilder(client, 'mutation').pluck('name')

      expect(result).toEqual(['Bob', 'David'])
    })
  })

  describe('delete', () => {
    it('deletes a row', async () => {
      await new QueryBuilder(client, 'mutation').where('name', 'Alice').delete()

      const result = await new QueryBuilder(client, 'mutation').pluck('name')

      expect(result).toEqual(['Bob'])
    })
  })

  describe('upsert', () => {
    it('insert a row', async () => {
      const returning = await new QueryBuilder(client, 'mutation').upsert(
        {
          id: 3,
          name: 'Charlie',
          metadata: { age: 50 },
        },
        {
          conflict: ['id'],
          returning: ['metadata'],
        },
      )

      expect(returning).toEqual([{ metadata: { age: 50 } }])

      const result = await new QueryBuilder(client, 'mutation')
        .orderBy('id', 'ASC')
        .pluck('metadata')

      expect(result).toEqual([{ age: 100 }, {}, { age: 50 }])
    })

    it('update a row', async () => {
      const returning = await new QueryBuilder(client, 'mutation').upsert(
        {
          id: 1,
          name: 'Alice',
          metadata: { age: 50 },
        },
        {
          conflict: ['id'],
          returning: ['metadata'],
        },
      )

      expect(returning).toEqual([{ metadata: { age: 50 } }])

      const result = await new QueryBuilder(client, 'mutation')
        .orderBy('id', 'ASC')
        .pluck('metadata')

      expect(result).toEqual([{ age: 50 }, {}])
    })

    it('insert multiple rows', async () => {
      const returning = await new QueryBuilder(client, 'mutation').upsert(
        [
          { id: 3, name: 'Charlie', metadata: { age: 50 } },
          { id: 4, name: 'David', metadata: { age: 25 } },
        ],
        {
          conflict: ['id'],
          returning: ['metadata'],
        },
      )

      expect(returning).toEqual([{ metadata: { age: 50 } }, { metadata: { age: 25 } }])

      const result = await new QueryBuilder(client, 'mutation')
        .orderBy('id', 'ASC')
        .pluck('metadata')

      expect(result).toEqual([{ age: 100 }, {}, { age: 50 }, { age: 25 }])
    })

    it('update multiple rows', async () => {
      const returning = await new QueryBuilder(client, 'mutation').upsert(
        [
          { id: 1, name: 'Alice', metadata: { age: 50 } },
          { id: 2, name: 'Bob', metadata: { age: 25 } },
        ],
        {
          conflict: ['id'],
          returning: ['metadata'],
        },
      )

      expect(returning).toEqual([{ metadata: { age: 50 } }, { metadata: { age: 25 } }])

      const result = await new QueryBuilder(client, 'mutation')
        .orderBy('id', 'ASC')
        .pluck('metadata')

      expect(result).toEqual([{ age: 50 }, { age: 25 }])
    })

    it('specified update columns', async () => {
      const returning = await new QueryBuilder(client, 'mutation').upsert(
        { id: 1, name: 'new', metadata: { age: 50 } },
        {
          conflict: ['id'],
          returning: ['name'],
          update: ['metadata'],
        },
      )

      expect(returning).toEqual([{ name: 'Alice' }])

      const result = await new QueryBuilder(client, 'mutation').orderBy('id', 'ASC').first()

      expect(result?.name).toEqual('Alice')
      expect(result?.metadata).toEqual({ age: 50 })
    })
  })
})
