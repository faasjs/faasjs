import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'

const http = new Http()

export const func = new Func({
  plugins: [http],
  async handler() {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return 'done'
  },
})
