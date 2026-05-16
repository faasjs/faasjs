import { z } from '@faasjs/utils'
import { describe, expect, it } from 'vitest'

import { formatSchemaError, parseSchemaValue } from '../../schema'

describe('schema helpers', () => {
  it('returns default value when schema is missing', async () => {
    await expect(
      parseSchemaValue({
        value: {
          ignored: true,
        },
        errorMessage: 'Invalid params',
      }),
    ).resolves.toEqual({})

    await expect(
      parseSchemaValue({
        value: {
          ignored: true,
        },
        defaultValue: {
          page: 1,
        },
        errorMessage: 'Invalid params',
      }),
    ).resolves.toEqual({
      page: 1,
    })
  })

  it('parses schema output and defaults empty input', async () => {
    const schema = z.object({
      count: z.coerce.number().default(1),
    })

    await expect(
      parseSchemaValue({
        schema,
        value: {
          count: '2',
        },
        errorMessage: 'Invalid params',
      }),
    ).resolves.toEqual({
      count: 2,
    })

    await expect(
      parseSchemaValue({
        schema,
        value: undefined,
        errorMessage: 'Invalid params',
      }),
    ).resolves.toEqual({
      count: 1,
    })

    await expect(
      parseSchemaValue({
        schema,
        value: null,
        defaultValue: {
          count: '3',
        },
        errorMessage: 'Invalid params',
      }),
    ).resolves.toEqual({
      count: 3,
    })
  })

  it('formats validation errors and supports custom error factories', async () => {
    const schema = z.object({
      count: z.number().min(2),
    })

    await expect(
      parseSchemaValue({
        schema,
        value: {
          count: 1,
        },
        errorMessage: 'Invalid params',
        createError: (message) => Object.assign(Error(message), { statusCode: 400 }),
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
    })

    await expect(
      parseSchemaValue({
        schema,
        value: {
          count: 1,
        },
        errorMessage: 'Invalid params',
        createError: (message) => Object.assign(Error(message), { statusCode: 400 }),
      }),
    ).rejects.toThrow('Invalid params\ncount: Too small, expected number to be >=2')
  })

  it('formats root errors', () => {
    const result = z.object({}).safeParse([])

    if (result.success) throw Error('expected parse failure')

    expect(formatSchemaError(result.error, 'Invalid params')).toEqual(
      'Invalid params\n<root>: Invalid input, expected object, received array',
    )
  })
})
