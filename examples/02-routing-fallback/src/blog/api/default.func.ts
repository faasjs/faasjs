import { defineApi } from '@faasjs/core'

export const func = defineApi({
  async handler({ event }) {
    return {
      route: 'blog/api/default',
      path: event.path,
    }
  },
})
