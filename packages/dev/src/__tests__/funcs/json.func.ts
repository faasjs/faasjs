import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'

const http = new Http()

export const func = new Func({
  plugins: [http],
  async handler() {
    http.cookie.write('cookie', 'cookie')
    http.session.write('session', 'session')
    return http.params.key
  },
})
