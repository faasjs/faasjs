import { describe, expect, expectTypeOf, it } from 'vitest'

import { parseJson, parseArrayFromJson, parseObjectFromJson } from '..'
import { z } from '../../zod'

describe('json helpers', () => {
  describe('parseJson', () => {
    it('should parse valid JSON strings', () => {
      expect(parseJson('{"key": "value"}')).toEqual({ key: 'value' })
      expect(parseJson('[1, 2, 3]')).toEqual([1, 2, 3])
      expect(parseJson('"string"')).toBe('string')
      expect(parseJson('123')).toBe(123)
    })

    it('should throw an error for invalid JSON strings', () => {
      expect(() => parseJson('invalid')).toThrow(
        'Unexpected token \'i\', "invalid" is not valid JSON',
      )
      expect(() => parseJson('{key: value}')).toThrow(
        "Expected property name or '}' in JSON at position 1 (line 1 column 2)",
      )
      expect(() => parseJson('')).toThrow('Unexpected end of JSON input')
    })

    it('should validate parsed JSON with a zod schema', () => {
      const schema = z.object({
        id: z.number(),
        name: z.string(),
      })
      const result = parseJson('{"id": 1, "name": "admin"}', schema)

      expect(result).toEqual({
        id: 1,
        name: 'admin',
      })
      expectTypeOf(result).toEqualTypeOf<{
        id: number
        name: string
      }>()
    })

    it('should return zod output after transforms and defaults', () => {
      const schema = z.object({
        count: z.number().default(1),
        name: z.string().transform((value) => value.toUpperCase()),
      })
      const result = parseJson('{"name": "admin"}', schema)

      expect(result).toEqual({
        count: 1,
        name: 'ADMIN',
      })
      expectTypeOf(result).toEqualTypeOf<{
        count: number
        name: string
      }>()
    })

    it('should throw the zod error when schema validation fails', () => {
      const schema = z.object({
        id: z.number(),
      })

      expect(() => parseJson('{"id": "1"}', schema)).toThrow(
        'Invalid input: expected number, received string',
      )
    })
  })

  describe('parseObjectFromJson', () => {
    it('should return the object if input is already an object record', () => {
      const obj = { key: 'value' }
      expect(parseObjectFromJson(obj)).toBe(obj)
    })

    it('should parse a JSON string into an object record', () => {
      expect(parseObjectFromJson('{"key": "value"}')).toEqual({ key: 'value' })
    })

    it('should throw an error for invalid JSON strings', () => {
      expect(() => parseObjectFromJson('invalid')).toThrow(
        'Unexpected token \'i\', "invalid" is not valid JSON',
      )
      expect(() => parseObjectFromJson('{key: value}')).toThrow(
        "Expected property name or '}' in JSON at position 1 (line 1 column 2)",
      )
    })
  })

  describe('parseArrayFromJson', () => {
    it('should return the array if input is already an array', () => {
      const arr = [1, 2, 3]
      expect(parseArrayFromJson(arr)).toBe(arr)
    })

    it('should parse a JSON string into an array', () => {
      expect(parseArrayFromJson('[1, 2, 3]')).toEqual([1, 2, 3])
    })

    it('should throw an error for invalid JSON strings', () => {
      expect(() => parseArrayFromJson('invalid')).toThrow(
        'Unexpected token \'i\', "invalid" is not valid JSON',
      )
      expect(() => parseArrayFromJson('{key: value}')).toThrow(
        "Expected property name or '}' in JSON at position 1 (line 1 column 2)",
      )
    })
  })
})
