import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'

const http = new Http()

export const func = new Func({
  plugins: [http],
  async handler({ cookie, session }) {
    return [cookie.read('h'), cookie.read('c'), session.read('s')]
  },
})
