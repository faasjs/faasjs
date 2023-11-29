import { signal } from '../signal'

describe('signal', () => {
  it('should work with debug', () => {
    const logs: any[] = []
    console.debug = jest.fn().mockImplementation((...args) => logs.push(args))

    const state = signal(0, { debugName: 'test' })

    expect(state.value).toBe(0)

    state.value = 1

    expect(state.value).toBe(1)

    expect(logs).toEqual([
      ['test', 0],
      ['test', 1],
    ])
  })
})
