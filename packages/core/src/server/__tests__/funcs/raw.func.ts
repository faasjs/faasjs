import type { ServerResponse } from 'node:http'
import { Func } from '@faasjs/core'

export const func = new Func({
  async handler({ event }) {
    const response = event.raw.response as ServerResponse
    response.statusCode = 200
    response.write('hello')
    response.end()
  },
})
