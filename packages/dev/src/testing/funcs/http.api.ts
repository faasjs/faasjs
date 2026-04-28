import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'

export default new Func({
  plugins: [new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })],
  async handler() {
    return true
  },
})
