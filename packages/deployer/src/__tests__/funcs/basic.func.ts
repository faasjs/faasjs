import { Func, InvokeData } from '@faasjs/func'

export default new Func({
  async handler(data: InvokeData) {
    return data.event + 1
  },
})
