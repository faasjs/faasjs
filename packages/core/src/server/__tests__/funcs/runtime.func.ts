import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'
import { detectNodeRuntime } from '@faasjs/node-utils'

const http = new Http()

export const func = new Func({
  plugins: [http],
  async handler() {
    return detectNodeRuntime()
  },
})
