import { Func } from '@faasjs/func'

export default new Func({
  async handler() {
    return new Response('hello')
  },
})
