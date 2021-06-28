import { Func } from '@faasjs/func'
import { Http } from '..'

describe('deploy', function () {
  test('should work', async function () {
    const http = new Http()
    const func = new Func({ plugins: [http] })

    await expect(func.deploy({
      root: '.',
      filename: 'filename',
      name: 'name',
      config: {
        plugins: {
          http: {
            provider: {
              type: '@faasjs/tencentcloud',
              config: {}
            },
            type: 'http'
          }
        }
      },
      dependencies: {}
    })).rejects.toEqual(Error('appId required'))
  })
})
