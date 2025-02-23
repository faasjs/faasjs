import { Func } from '@faasjs/func'

export const func = new Func({
  async handler() {
    return true
  },
})
