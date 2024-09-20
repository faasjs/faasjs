import { Func } from '@faasjs/func'
import type { ServerResponse } from 'node:http'

export default new Func({
  async handler({ event }) {
    const response = event.raw.response as ServerResponse
    response.statusCode = 200
    response.write('hello')
    response.end()
  },
})
