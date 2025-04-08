import { Func } from '@faasjs/func'
import { Http } from '@faasjs/http'

const http = new Http()

export const func = new Func({
  plugins: [http],
  async handler() {
    return Array(1000).fill('hello').join('')
  },
})
