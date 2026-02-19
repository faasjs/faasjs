import { Func } from '@faasjs/func'
import { Http } from '@faasjs/core'

const http = new Http()

export const func = new Func({
  plugins: [http],
  async handler() {
    return [http.cookie.read('h'), http.cookie.read('c'), http.session.read('s')]
  },
})
