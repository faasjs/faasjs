import { defineApi } from '@faasjs/core'

export const func = defineApi({
  async handler() {
    return 'Hello'
  },
})
