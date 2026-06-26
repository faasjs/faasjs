import { describe, expect, it } from 'vitest'
import { z as zod } from 'zod'

import { isObjectRecord, z } from '..'

describe('zod helpers', () => {
  it('should have the same properties as zod', () => {
    expect(Object.keys(z)).toEqual(expect.arrayContaining(Object.keys(zod)))
  })

  it('should provide a positive integer schema', () => {
    expect(z.positiveint().parse(1)).toBe(1)
    expect(() => z.positiveint().parse(-1)).toThrow('Too small: expected number to be >0')
    expect(z.positiveint().min(2).parse(2)).toBe(2)
    expect(() => z.positiveint().max(1).parse(2)).toThrow('Too big: expected number to be <=1')
  })

  it('should provide a non-empty string schema', () => {
    expect(z.nonemptystring().parse('hello')).toBe('hello')
    expect(() => z.nonemptystring().parse('')).toThrow(
      'Too small: expected string to have >=1 characters',
    )
  })

  it('should correctly identify object records', () => {
    expect(isObjectRecord({})).toBe(true)
    expect(isObjectRecord({ key: 'value' })).toBe(true)
    expect(isObjectRecord(new Date())).toBe(true)
    expect(isObjectRecord(new Map())).toBe(true)
    expect(isObjectRecord(/pattern/)).toBe(true)
    expect(isObjectRecord(Object.create(null))).toBe(true)
    expect(isObjectRecord([])).toBe(false)
    expect(isObjectRecord('string')).toBe(false)
    expect(isObjectRecord(123)).toBe(false)
    expect(isObjectRecord(null)).toBe(false)
    expect(isObjectRecord(undefined)).toBe(false)
  })
})
