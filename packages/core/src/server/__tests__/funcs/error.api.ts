import { Func } from '@faasjs/core'

export default new Func({
  async handler() {
    throw Error('error')
  },
})
