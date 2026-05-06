import { describe, it, expect, beforeAll, afterAll, expectTypeOf } from 'vitest'

import type { User } from '../../../test-utils/tables'
import { type Client, createClient } from '../../client'
import { QueryBuilder } from '../../query-builder'

describe('QueryBuilder/query', () => {
  let client: Client

  beforeAll(async () => {
    client = createClient(process.env.DATABASE_URL!)

    await client.raw`
      CREATE TABLE query (
        id SERIAL PRIMARY KEY,
        name TEXT,
        metadata JSONB
      );
    `

    await client.raw`
      CREATE TABLE query_profile (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        bio TEXT
      );
    `

    await client.raw`
      INSERT INTO query (id, name, metadata) VALUES (1, 'Alice', '{"age":100}'), (2, 'Bob', '{}');
    `

    await client.raw`
      INSERT INTO query_profile (id, user_id, bio) VALUES (1, 1, 'Alice bio'), (2, 3, 'Ghost bio');
    `
  })

  afterAll(async () => {
    await client.raw`DROP TABLE query_profile`

    await client.raw`DROP TABLE query`

    await client.quit()
  })

  describe('select', () => {
    it('selects all columns', async () => {
      const result = await new QueryBuilder(client, 'query')

      expect(result).toEqual([
        {
          id: 1,
          name: 'Alice',
          metadata: {
            age: 100,
          },
        },
        { id: 2, name: 'Bob', metadata: {} },
      ])
      expectTypeOf(result).toEqualTypeOf<User[]>()
    })

    it('selects specific columns', async () => {
      const result = await new QueryBuilder(client, 'query').select('name')

      expect(result).toEqual([{ name: 'Alice' }, { name: 'Bob' }])
      expectTypeOf(result).toEqualTypeOf<Pick<User, 'name'>[]>()
    })

    it('selects multiple columns', async () => {
      const result = await new QueryBuilder(client, 'query').select('name', 'metadata')

      expect(result).toEqual([
        { name: 'Alice', metadata: { age: 100 } },
        { name: 'Bob', metadata: {} },
      ])
      expectTypeOf(result).toEqualTypeOf<Pick<User, 'name' | 'metadata'>[]>()
    })

    it('select jsonb', async () => {
      const result = await new QueryBuilder(client, 'query')
        .select({
          column: 'metadata',
          fields: ['age'],
        })
        .orderBy('id', 'ASC')

      expect(result).toEqual([{ metadata: { age: 100 } }, { metadata: { age: null } }])
      expectTypeOf(result).toEqualTypeOf<
        {
          metadata: Pick<User['metadata'], 'age'>
        }[]
      >()
    })
  })

  describe('where', () => {
    it('column and value', async () => {
      const result = await new QueryBuilder(client, 'query').where('name', 'Alice').pluck('id')

      expect(result).toEqual([1])
    })

    it('column, operator, and value', async () => {
      const result = await new QueryBuilder(client, 'query')
        .where('name', '!=', 'Alice')
        .pluck('id')

      expect(result).toEqual([2])
    })

    describe('operator', () => {
      it('IS NULL', async () => {
        const result = await new QueryBuilder(client, 'query').where('name', 'IS NULL').pluck('id')

        expect(result).toEqual([])
      })

      it('IS NOT NULL', async () => {
        const result = await new QueryBuilder(client, 'query')
          .where('name', 'IS NOT NULL')
          .pluck('id')

        expect(result).toEqual([1, 2])
      })

      it('IN', async () => {
        const result = await new QueryBuilder(client, 'query')
          .where('name', 'IN', ['Alice'])
          .where('id', 'IN', [1, 2])
          .pluck('id')

        expect(result).toEqual([1])
      })

      it('NOT IN', async () => {
        const result = await new QueryBuilder(client, 'query')
          .where('name', 'NOT IN', ['Alice'])
          .pluck('id')

        expect(result).toEqual([2])
      })

      it('>', async () => {
        const result = await new QueryBuilder(client, 'query').where('id', '>', 1).pluck('id')

        expect(result).toEqual([2])
      })

      it('>=', async () => {
        const result = await new QueryBuilder(client, 'query').where('id', '>=', 1).pluck('id')

        expect(result).toEqual([1, 2])
      })

      it('<', async () => {
        const result = await new QueryBuilder(client, 'query').where('id', '<', 2).pluck('id')

        expect(result).toEqual([1])
      })

      it('<=', async () => {
        const result = await new QueryBuilder(client, 'query').where('id', '<=', 2).pluck('id')

        expect(result).toEqual([1, 2])
      })

      it('!=', async () => {
        const result = await new QueryBuilder(client, 'query')
          .where('name', '!=', 'Alice')
          .pluck('id')

        expect(result).toEqual([2])
      })

      it('LIKE', async () => {
        const result = await new QueryBuilder(client, 'query')
          .where('name', 'LIKE', 'A%')
          .pluck('id')

        expect(result).toEqual([1])
      })

      it('ILIKE', async () => {
        const result = await new QueryBuilder(client, 'query')
          .where('name', 'ILIKE', 'a%')
          .pluck('id')

        expect(result).toEqual([1])
      })

      it('NOT LIKE', async () => {
        const result = await new QueryBuilder(client, 'query')
          .where('name', 'NOT LIKE', 'A%')
          .pluck('id')

        expect(result).toEqual([2])
      })

      it('NOT ILIKE', async () => {
        const result = await new QueryBuilder(client, 'query')
          .where('name', 'NOT ILIKE', 'a%')
          .pluck('id')

        expect(result).toEqual([2])
      })

      it('@>', async () => {
        const result = await new QueryBuilder(client, 'query')
          .where('metadata', '@>', { age: 100 })
          .pluck('id')

        expect(result).toEqual([1])
      })

      it('throws error for invalid operator', async () => {
        expect(() =>
          new QueryBuilder(client, 'query').where('name', 'invalid' as any, 'Alice').pluck('id'),
        ).toThrowError('Invalid operator: invalid')
      })
    })

    it('multiple conditions', async () => {
      const result = await new QueryBuilder(client, 'query')
        .where('name', 'Alice')
        .where('id', '>', 1)
        .pluck('id')

      expect(result).toEqual([])
    })
  })

  describe('whereRaw', () => {
    it('works with params', async () => {
      const result = await new QueryBuilder(client, 'query')
        .whereRaw('"name" = ?', 'Alice')
        .pluck('id')

      expect(result).toEqual([1])
    })

    it('works with where', async () => {
      const result = await new QueryBuilder(client, 'query')
        .where('id', '>', 1)
        .whereRaw('"name" = ?', 'Bob')
        .pluck('id')

      expect(result).toEqual([2])
    })
  })

  describe('orWhere', () => {
    it('column and value', async () => {
      const result = await new QueryBuilder(client, 'query')
        .where('name', 'Alice')
        .orWhere('name', 'Bob')
        .pluck('id')

      expect(result).toEqual([1, 2])
    })

    it('column, operator, and value', async () => {
      const result = await new QueryBuilder(client, 'query')
        .where('name', 'Alice')
        .orWhere('name', '!=', 'Bob')
        .pluck('id')

      expect(result).toEqual([1])
    })

    it('multiple conditions', async () => {
      const result = await new QueryBuilder(client, 'query')
        .where('name', 'Alice')
        .orWhere('id', '>', 1)
        .pluck('id')

      expect(result).toEqual([1, 2])
    })

    it('supports ILIKE operator', async () => {
      const result = await new QueryBuilder(client, 'query')
        .where('name', 'Bob')
        .orWhere('name', 'ILIKE', 'a%')
        .orderBy('id', 'ASC')
        .pluck('id')

      expect(result).toEqual([1, 2])
    })
  })

  describe('orWhereRaw', () => {
    it('works with params', async () => {
      const result = await new QueryBuilder(client, 'query')
        .where('name', 'Alice')
        .orWhereRaw('"id" = ?', 2)
        .orderBy('id', 'ASC')
        .pluck('id')

      expect(result).toEqual([1, 2])
    })
  })

  describe('limit', () => {
    it('limits the number of results', async () => {
      const result = await new QueryBuilder(client, 'query').limit(1).pluck('id')

      expect(result).toEqual([1])
    })
  })

  describe('offset', () => {
    it('offsets the results', async () => {
      const result = await new QueryBuilder(client, 'query').offset(1).pluck('id')

      expect(result).toEqual([2])
    })
  })

  describe('pluck', () => {
    it('returns a single column', async () => {
      const result = await new QueryBuilder(client, 'query').pluck('name')

      expect(result).toEqual(['Alice', 'Bob'])
      expectTypeOf(result).toEqualTypeOf<string[]>()
    })
  })

  describe('count', () => {
    it('should work', async () => {
      const result = await new QueryBuilder(client, 'query').count()

      expect(result).toEqual(2)
    })

    it('work with where and ignore orderBy, limit and offset', async () => {
      const result = await new QueryBuilder(client, 'query')
        .where('name', 'Alice')
        .orderBy('id')
        .limit(1)
        .offset(1)
        .count()

      expect(result).toEqual(1)
    })
  })

  describe('first', () => {
    it('returns the first row', async () => {
      const result = await new QueryBuilder(client, 'query').first()

      expect(result).toEqual({ id: 1, name: 'Alice', metadata: { age: 100 } })
      expectTypeOf(result).toEqualTypeOf<User | null>()
    })

    it('returns the first row with column', async () => {
      const result = await new QueryBuilder(client, 'query').select('name').first()

      expect(result).toEqual({ name: 'Alice' })
      expectTypeOf(result).toEqualTypeOf<Pick<User, 'name'> | null>()
    })
  })

  describe('orderBy', () => {
    it('default order', async () => {
      const result = await new QueryBuilder(client, 'query').orderBy('id').pluck('id')

      expect(result).toEqual([1, 2])
    })

    it('ascending order', async () => {
      const result = await new QueryBuilder(client, 'query').orderBy('id', 'ASC').pluck('id')

      expect(result).toEqual([1, 2])
    })

    it('descending order', async () => {
      const result = await new QueryBuilder(client, 'query').orderBy('id', 'DESC').pluck('id')

      expect(result).toEqual([2, 1])
    })

    it('multiple columns', async () => {
      const result = await new QueryBuilder(client, 'query')
        .orderBy('name', 'ASC')
        .orderBy('id', 'DESC')
        .pluck('id')

      expect(result).toEqual([1, 2])
    })

    it('with limit and offset', async () => {
      const result = await new QueryBuilder(client, 'query')
        .orderBy('id', 'DESC')
        .limit(1)
        .offset(1)
        .pluck('id')

      expect(result).toEqual([1])
    })
  })

  describe('orderByRaw', () => {
    it('orders by raw expression', async () => {
      const result = await new QueryBuilder(client, 'query')
        .orderByRaw('CASE WHEN "name" = ? THEN 0 ELSE 1 END', 'Bob')
        .pluck('name')

      expect(result).toEqual(['Bob', 'Alice'])
    })

    it('works with limit', async () => {
      const result = await new QueryBuilder(client, 'query')
        .orderByRaw('CASE WHEN "name" = ? THEN 0 ELSE 1 END', 'Bob')
        .limit(1)
        .pluck('name')

      expect(result).toEqual(['Bob'])
    })
  })

  describe('join', () => {
    it('uses default operator', async () => {
      const result = await new QueryBuilder(client, 'query')
        .join('query_profile', 'query.id', 'query_profile.user_id')
        .count()

      expect(result).toEqual(1)
    })

    it('supports custom operator', async () => {
      const result = await new QueryBuilder(client, 'query')
        .join('query_profile', 'query.id', '>', 'query_profile.user_id')
        .count()

      expect(result).toEqual(1)
    })

    it('throws error for invalid operator', () => {
      expect(() =>
        new QueryBuilder(client, 'query').join(
          'query_profile',
          'query.id',
          'invalid' as any,
          'query_profile.user_id',
        ),
      ).toThrowError('Invalid join operator: invalid')
    })
  })

  describe('leftJoin', () => {
    it('keeps unmatched rows', async () => {
      const result = await new QueryBuilder(client, 'query')
        .leftJoin('query_profile', 'query.id', 'query_profile.user_id')
        .whereRaw('"query_profile"."id" IS NULL')
        .count()

      expect(result).toEqual(1)
    })
  })
})
