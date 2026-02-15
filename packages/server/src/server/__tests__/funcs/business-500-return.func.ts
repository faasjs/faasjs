import { Func } from '@faasjs/func'

export const func = new Func({
  async handler() {
    return {
      statusCode: 500,
      message: 'business-500-return',
    }
  },
})
