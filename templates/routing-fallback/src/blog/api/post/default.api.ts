import { defineApi } from '@faasjs/core'

export default defineApi({
  async handler({ event }) {
    return {
      route: 'blog/api/post/default',
      path: event.path,
    }
  },
})
