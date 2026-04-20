import { Func } from '@faasjs/core'

export const func = new Func({
  async handler() {
    return {
      statusCode: 500,
      message: 'business-500-return',
    }
  },
})
