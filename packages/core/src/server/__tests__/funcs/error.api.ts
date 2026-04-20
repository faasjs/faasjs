import { Func } from '@faasjs/core'

export const func = new Func({
  async handler() {
    throw Error('error')
  },
})
