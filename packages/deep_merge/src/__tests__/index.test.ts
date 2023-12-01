import { deepMerge } from '..'

describe('deepMerge', () => {
  test('should work', () => {
    const a = {
      nest: {
        number: 1,
        string: '1',
        object: { key: '1' },
        date: new Date(1),
        nest: { a: 1 },
      },
    }
    const b = {
      nest: {
        number: 2,
        string: '2',
        object: { key: '2' },
        date: new Date(2),
        nest: { b: 1 },
      },
    }

    expect(deepMerge(a, b)).toEqual({
      nest: {
        number: 2,
        string: '2',
        object: { key: '2' },
        date: new Date(2),
        nest: {
          a: 1,
          b: 1,
        },
      },
    })
    expect(a.nest).toEqual({
      number: 1,
      string: '1',
      object: { key: '1' },
      date: new Date(1),
      nest: { a: 1 },
    })
    expect(b.nest).toEqual({
      number: 2,
      string: '2',
      object: { key: '2' },
      date: new Date(2),
      nest: { b: 1 },
    })
  })

  test('array', () => {
    expect(deepMerge({ a: [0] }, { a: [1] })).toEqual({ a: [1, 0] })
  })

  test('dup array', () => {
    expect(
      deepMerge(
        {
          a: {
            a1: [0, 1],
            a2: 2,
          },
        },
        { a: { a1: [1, 2] } }
      )
    ).toEqual({
      a: {
        a1: [1, 2, 0],
        a2: 2,
      },
    })
  })

  test('null object', () => {
    const a = Object.create(null)
    a.key = 1
    const b = Object.create(null)
    b.key = 2

    expect(deepMerge(a, b)).toEqual({ key: 2 })
    expect(a).toEqual({ key: 1 })
    expect(b).toEqual({ key: 2 })
  })

  test('nest dup', () => {
    const a = {
      a: 1,
      nest: { b: 1 },
    }
    const b = deepMerge(a)
    b.nest.b = 2

    expect(a).toEqual({
      a: 1,
      nest: { b: 1 },
    })
    expect(b).toEqual({
      a: 1,
      nest: { b: 2 },
    })
  })
})
