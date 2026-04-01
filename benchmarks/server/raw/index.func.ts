import { Func } from '@faasjs/core'

export const func = new Func({
  async handler() {
    return {
      statusCode: 200,
      body: 'Hello',
    }
  },
})
