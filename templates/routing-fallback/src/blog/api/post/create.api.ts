import { defineApi } from '@faasjs/core'

export default defineApi({
  async handler() {
    return {
      route: 'blog/api/post/create',
      created: true,
    }
  },
})
