import { Func } from '@faasjs/core'

export default new Func({
  async handler() {
    return new Response('hello')
  },
})
