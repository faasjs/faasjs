import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'

const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })

export default new Func({
  plugins: [http],
  async handler() {
    return 'default'
  },
})
