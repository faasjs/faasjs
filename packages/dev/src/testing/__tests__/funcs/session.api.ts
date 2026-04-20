import { defineApi } from '@faasjs/core'

export default defineApi({
  async handler({ cookie, session }) {
    return [cookie.read('h'), cookie.read('c'), session.read('s')]
  },
})
