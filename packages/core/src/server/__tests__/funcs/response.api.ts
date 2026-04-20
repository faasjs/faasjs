import { Func } from '@faasjs/core'

export const func = new Func({
  async handler() {
    return new Response('hello')
  },
})
