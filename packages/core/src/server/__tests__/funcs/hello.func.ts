import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'

const http = new Http()

export const func = new Func({
  plugins: [http],
  async handler() {
    http.setHeader('x-headers', 'x-x')
    return 'hello'
  },
})
