import { defineApi } from '@faasjs/core'

export const func = defineApi({
  async handler({ cookie, session }) {
    return [cookie.read('h'), cookie.read('c'), session.read('s')]
  },
})
