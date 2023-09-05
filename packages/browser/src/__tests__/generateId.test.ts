import { generateId } from '../generateId'

describe('generateId', () => {
  it('should work', () => {
    expect(generateId()).toHaveLength(18)
  })

  it('should work with prefix', () => {
    const id = generateId('prefix')

    expect(id).toHaveLength(24)
    expect(id).toMatch(/^prefix/)
  })
})
