import { defineApi } from '@faasjs/core'

export const func = defineApi({
  async handler({ session }) {
    session.write('user_id', null)
  },
})
