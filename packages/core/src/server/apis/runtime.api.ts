import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'
import { detectNodeRuntime } from '@faasjs/node-utils'

const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })

export default new Func({
  plugins: [http],
  async handler() {
    return {
      exportOrder: 'default',
      runtime: detectNodeRuntime(),
    }
  },
})
