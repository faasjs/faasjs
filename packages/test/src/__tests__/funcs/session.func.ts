import { Func } from '@faasjs/func'
import { Http } from '@faasjs/http'

const http = new Http()

export default new Func({
  plugins: [http],
  async handler() {
    return [
      http.cookie.read('h'),
      http.cookie.read('c'),
      http.session.read('s'),
    ]
  },
})
