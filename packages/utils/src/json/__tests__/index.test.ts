import { describe, expect, it } from 'vitest'

import { parseJson, parseArrayFromJson, parseObjectFromJson } from '..'

describe('json helpers', () => {
  describe('parseJson', () => {
    it('should parse valid JSON strings', () => {
      expect(parseJson('{"key": "value"}')).toEqual({ key: 'value' })
      expect(parseJson('[1, 2, 3]')).toEqual([1, 2, 3])
      expect(parseJson('"string"')).toBe('string')
      expect(parseJson('123')).toBe(123)
    })

    it('should throw an error for invalid JSON strings', () => {
      expect(() => parseJson('invalid')).toThrow()
      expect(() => parseJson('{key: value}')).toThrow()
      expect(() => parseJson('')).toThrow()
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
      expect(() => parseObjectFromJson('invalid')).toThrow()
      expect(() => parseObjectFromJson('{key: value}')).toThrow()
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
      expect(() => parseArrayFromJson('invalid')).toThrow()
      expect(() => parseArrayFromJson('{key: value}')).toThrow()
    })
  })
})
