import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'

const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })

export default new Func({
  plugins: [http],
  async handler() {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return 'done'
  },
})
