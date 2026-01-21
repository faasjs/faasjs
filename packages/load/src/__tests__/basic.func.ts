import { Func } from '@faasjs/func'

export default new Func({
  async handler({ event }) {
    return event
  },
})
