import type { Tables } from 'knex/types/tables'
import { assertType, test } from 'vitest'
import { query } from '../../../index'

declare module 'knex/types/tables' {
  interface Tables {
    test: {
      id: string
    }
  }
}

test('query should infer rows from table names', async () => {
  assertType<Tables['test'][]>(await query('test'))
  assertType<any>(await query('testtest'))
})

test('query should support custom result generic', async () => {
  assertType<{ value: string }>(await query<any, { value: string }>('testtest'))
})

test('Tables declaration should keep strict field types', () => {
  assertType<Tables['test']>({ id: '1' })

  // @ts-expect-error id should be string
  assertType<Tables['test']>({ id: 1 })
})
