import { Func } from '@faasjs/func'
import { Http } from '@faasjs/core'

const http = new Http()

export const func = new Func({
  plugins: [http],
  async handler() {
    return http.params
  },
})
