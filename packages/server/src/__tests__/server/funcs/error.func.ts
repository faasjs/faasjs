import { Func } from '@faasjs/func'

export default new Func({
  async handler() {
    throw Error('error')
  },
})
