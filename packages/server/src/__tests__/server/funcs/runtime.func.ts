import { Func } from '@faasjs/func'
import { Http } from '@faasjs/http'
import { detectNodeRuntime } from '@faasjs/load'

const http = new Http()

export default new Func({
  plugins: [http],
  async handler() {
    return detectNodeRuntime()
  },
})
