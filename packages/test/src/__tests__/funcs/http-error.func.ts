import { Func } from '@faasjs/func'
import { Http } from '@faasjs/http'

export default new Func({
  plugins: [new Http()],
  async handler() {
    throw Error('message')
  },
})
