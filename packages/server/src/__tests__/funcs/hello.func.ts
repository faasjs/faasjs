import { Func } from '@faasjs/func'
import { Http } from '@faasjs/http'

const http = new Http()

export default new Func({
  plugins: [http],
  async handler() {
    http.setHeader('x-headers', 'x-x')
    return 'hello'
  },
})
