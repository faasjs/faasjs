import { defineApi } from '@faasjs/core'

export const func = defineApi({
  async handler({ event }) {
    return {
      route: 'blog/api/post/default',
      path: event.path,
    }
  },
})
