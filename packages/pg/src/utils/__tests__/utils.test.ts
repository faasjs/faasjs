import { describe, it, expect } from 'vitest'

import { escapeIdentifier, escapeValue, rawSql } from '../../utils'

describe('escapeIdentifier', () => {
  it('escapes double quotes', () => {
    expect(escapeIdentifier('foo"bar')).toBe('"foo""bar"')
  })

  it('escapes dots', () => {
    expect(escapeIdentifier('foo.bar')).toBe('"foo"."bar"')
  })

  it('escapes both', () => {
    expect(escapeIdentifier('foo.bar"baz')).toBe('"foo"."bar""baz"')
  })

  it('does not escape regular characters', () => {
    expect(escapeIdentifier('"foobar"')).toBe('"foobar"')
  })

  it('does not escape asterisk', () => {
    expect(escapeIdentifier('*')).toBe('*')
    expect(escapeIdentifier('users.*')).toBe('"users".*')
  })

  it('does not escape COUNT(*)', () => {
    expect(escapeIdentifier('COUNT(*)')).toBe('COUNT(*)')
  })

  it('throws error for non-string values', () => {
    expect(() => escapeIdentifier(42 as any)).toThrowError('Identifier must be a string: 42')
  })

  it('handles raw SQL values', () => {
    const raw = rawSql('SELECT * FROM users')
    expect(escapeIdentifier(raw)).toBe('SELECT * FROM users')
    expect((raw as any).__raw).toBe(true)
  })
})

describe('escapeValue', () => {
  it('handles null value', () => {
    expect(escapeValue(null)).toBe('NULL')
  })

  it('handles boolean values', () => {
    expect(escapeValue(true)).toBe('TRUE')
    expect(escapeValue(false)).toBe('FALSE')
  })

  it('handles number values', () => {
    expect(escapeValue(42)).toBe('42')
    expect(escapeValue(0)).toBe('0')
    expect(escapeValue(-123.45)).toBe('-123.45')
  })

  it('handles string values', () => {
    expect(escapeValue('hello')).toBe("'hello'")
    expect(escapeValue("it's")).toBe("'it''s'")
    expect(escapeValue('')).toBe("''")
  })

  it('handles array values', () => {
    expect(escapeValue([])).toBe('ARRAY[]')
    expect(escapeValue([1, 2, 3])).toBe('ARRAY[1,2,3]')
    expect(escapeValue(['a', 'b'])).toBe("ARRAY['a','b']")
    expect(escapeValue([1, 'a', true])).toBe("ARRAY[1,'a',TRUE]")
    expect(escapeValue([[1, 2], ['a']])).toBe("ARRAY[ARRAY[1,2],ARRAY['a']]")
  })

  it('handles date values', () => {
    const date = new Date('2023-01-01T00:00:00.000Z')
    expect(escapeValue(date)).toBe("'2023-01-01T00:00:00.000Z'")
  })

  it('handles object values', () => {
    expect(escapeValue({ foo: 'bar' })).toBe('\'{"foo":"bar"}\'')
    expect(escapeValue({ a: 1, b: true })).toBe('\'{"a":1,"b":true}\'')
  })

  it('throws error for unsupported types', () => {
    expect(() => escapeValue(undefined)).toThrowError('Unsupported value: undefined')
    expect(() => escapeValue(() => 1)).toThrowError('Unsupported value: () => 1')
  })

  it('handles raw SQL values', () => {
    const raw = rawSql('SELECT * FROM users')
    expect(escapeValue(raw)).toBe('SELECT * FROM users')
    expect((raw as any).__raw).toBe(true)
  })
})

it('rawSql', () => {
  const raw = rawSql('SELECT * FROM users')

  expect(`${raw}`).toBe('SELECT * FROM users')
  expect((raw as any).__raw).toBe(true)
})
