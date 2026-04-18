import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'

const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })

export const func = new Func({
  plugins: [http],
  async handler({ cookie, params, session }) {
    cookie.write('cookie', 'cookie')
    session.write('session', 'session')
    return params.key
  },
})
