import { Func } from '@faasjs/func'
import { Http } from '@faasjs/http'
import { detectNodeRuntime } from '@faasjs/node-utils'

const http = new Http()

export const func = new Func({
  plugins: [http],
  async handler() {
    return detectNodeRuntime()
  },
})
