import { Func, InvokeData } from '@faasjs/func'
import Extend from './extend'

export default new Func({
  plugins: [new Extend()],
  handler(data: InvokeData) {
    return data.event + 1
  },
})
