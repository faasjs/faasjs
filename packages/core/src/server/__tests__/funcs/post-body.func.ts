import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'

const http = new Http()

export const func = new Func({
  plugins: [http],
  async handler({ event }) {
    http.setHeader('x-faasjs-request-id', event.headers['x-faasjs-request-id'])
    return {
      receivedBody: event.params,
      method: event.httpMethod,
    }
  },
})
