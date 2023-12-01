import { Func } from '../index'

describe('Func handler', () => {
  test('without handler', async () => {
    const handler = new Func({}).export().handler

    expect(await handler(0)).toBeUndefined()
  })

  describe('with handler', () => {
    test('should work', async () => {
      const handler = new Func<number>({
        async handler(data) {
          return data.event + 1
        },
      }).export().handler

      expect(await handler(0)).toEqual(1)
      expect(await handler(1)).toEqual(2)
    })

    test('throw handler', async () => {
      const handler = new Func({
        async handler() {
          throw Error('Error')
        },
      }).export().handler

      try {
        await handler({}, {})
      } catch (error) {
        expect(error).toEqual(Error('Error'))
      }
    })
  })
})
