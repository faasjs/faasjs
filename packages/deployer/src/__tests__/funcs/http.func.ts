import { Func, InvokeData } from '@faasjs/func'
import { Http } from '@faasjs/http'

export default new Func({
  plugins: [new Http()],
  handler(data: InvokeData) {
    return data.event.body
  },
})
