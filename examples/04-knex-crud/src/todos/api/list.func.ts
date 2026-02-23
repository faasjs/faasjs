import { defineApi, query } from '@faasjs/core'

export const func = defineApi({
  async handler() {
    return await query('todos').select('id', 'title', 'completed').orderBy('id', 'asc')
  },
})
