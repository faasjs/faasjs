import { Func } from '@faasjs/func'
import { Http } from '@faasjs/http'

const http = new Http()

export default new Func({
  plugins: [http],
  async handler() {
    await new Promise(resolve => setTimeout(resolve, 50))
    return 'done'
  },
})
