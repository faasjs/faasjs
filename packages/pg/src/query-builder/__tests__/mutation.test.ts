import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'

import { type Client, createClient } from '../../client'
import { QueryBuilder } from '../../query-builder'
import { sql } from '../../sql'

describe('QueryBuilder/mutation', () => {
  let client: Client

  beforeAll(async () => {
    client = createClient(process.env.DATABASE_URL!)

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

    it('updates rows with NOT IN', async () => {
      const returning = await new QueryBuilder(client, 'mutation')
        .where('name', 'NOT IN', ['Alice'])
        .update({ name: 'David' }, { returning: ['id', 'name'] })

      expect(returning).toEqual([{ id: 2, name: 'David' }])

      const result = await new QueryBuilder(client, 'mutation').orderBy('id', 'ASC').pluck('name')

      expect(result).toEqual(['Alice', 'David'])
    })

    it('updates a column with an atomic parameterized expression', async () => {
      const returning = await new QueryBuilder(client, 'mutation').where('id', 1).update(
        {
          id: sql`${sql.ref('id')} + ${10}`,
        },
        { returning: ['id'] },
      )

      expect(returning).toEqual([{ id: 11 }])
    })

    it('uses SQL functions in update expressions', async () => {
      const returning = await new QueryBuilder(client, 'mutation').where('id', 1).update(
        {
          name: sql`UPPER(${sql.ref('name')})`,
        },
        { returning: ['name'] },
      )

      expect(returning).toEqual([{ name: 'ALICE' }])
    })

    it('binds expression interpolations as values', async () => {
      const suffix = "', name = 'Mallory"
      const returning = await new QueryBuilder(client, 'mutation').where('id', 1).update(
        {
          name: sql`${sql.ref('name')} || ${suffix}`,
        },
        { returning: ['name'] },
      )

      expect(returning).toEqual([{ name: `Alice${suffix}` }])
      await expect(
        new QueryBuilder(client, 'mutation').where('id', 2).first(),
      ).resolves.toMatchObject({ name: 'Bob' })
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

    it('does nothing when only conflict columns are provided', async () => {
      const returning = await new QueryBuilder(client, 'mutation').upsert(
        { id: 1 },
        {
          conflict: ['id'],
          returning: ['id'],
        },
      )

      expect(returning).toEqual([])
      await expect(new QueryBuilder(client, 'mutation').where('id', 1).first()).resolves.toEqual({
        id: 1,
        name: 'Alice',
        metadata: { age: 100 },
      })
    })
  })

  describe('updateJson', () => {
    it('merges fields into a jsonb column', async () => {
      await new QueryBuilder(client, 'mutation')
        .where('name', 'Alice')
        .updateJson('metadata', { age: 50 })

      const result = await new QueryBuilder(client, 'mutation').where('name', 'Alice').first()

      expect(result?.metadata).toEqual({ age: 50 })
    })

    it('adds new fields while keeping existing ones', async () => {
      await new QueryBuilder(client, 'mutation')
        .where('name', 'Alice')
        .updateJson('metadata', { gender: 'female' })

      const result = await new QueryBuilder(client, 'mutation').where('name', 'Alice').first()

      expect(result?.metadata).toEqual({ age: 100, gender: 'female' })
    })

    it('updates JSON rows with NOT IN', async () => {
      await new QueryBuilder(client, 'mutation')
        .where('name', 'NOT IN', ['Alice'])
        .updateJson('metadata', { age: 25 })

      const result = await new QueryBuilder(client, 'mutation').orderBy('id', 'ASC')

      expect(result).toEqual([
        { id: 1, name: 'Alice', metadata: { age: 100 } },
        { id: 2, name: 'Bob', metadata: { age: 25 } },
      ])
    })

    it('merges into empty jsonb', async () => {
      await new QueryBuilder(client, 'mutation')
        .where('name', 'Bob')
        .updateJson('metadata', { age: 25 })

      const result = await new QueryBuilder(client, 'mutation').where('name', 'Bob').first()

      expect(result?.metadata).toEqual({ age: 25 })
    })

    it('throws without where conditions', async () => {
      await expect(
        new QueryBuilder(client, 'mutation').updateJson('metadata', { age: 1 }),
      ).rejects.toThrow('Missing where conditions')
    })
  })
})
