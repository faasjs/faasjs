import { Func } from '@faasjs/func'
import { Http } from '@faasjs/http'

export const func = new Func({
  plugins: [new Http()],
  async handler() {
    return true
  },
})
