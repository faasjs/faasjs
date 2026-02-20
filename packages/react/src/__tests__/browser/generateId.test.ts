import { describe, expect, it } from 'vitest'
import { generateId } from '../../generateId'

describe('generateId', () => {
  it('should work', () => {
    expect(generateId()).toHaveLength(18)
  })

  it('should work with prefix', () => {
    const id = generateId('prefix')

    expect(id).toHaveLength(24)
    expect(id).toMatch(/^prefix/)
  })

  it('should work with custom length', () => {
    expect(generateId(undefined, 8)).toHaveLength(8)

    expect(generateId(undefined, 18)).toHaveLength(18)

    expect(() => generateId(undefined, 7)).toThrow('Length must be 8 ~ 18')
  })
})
