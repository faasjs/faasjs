import { CloudFunction } from '@faasjs/cloud_function'
import { Func, InvokeData } from '@faasjs/func'

export default new Func({
  plugins: [new CloudFunction({ config: { name: 'multi1' } }), new CloudFunction({ config: { name: 'multi2' } })],
  handler (data: InvokeData) {
    return data.event + 1
  }
})
