import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'

const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })

export const func = new Func({
  plugins: [http],
  async handler({ event, params, setHeader }) {
    setHeader('x-faasjs-request-id', event.headers['x-faasjs-request-id'])
    return {
      receivedBody: params,
      method: event.httpMethod,
    }
  },
})
