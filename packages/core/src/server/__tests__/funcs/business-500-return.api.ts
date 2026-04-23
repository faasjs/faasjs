import { Func } from '@faasjs/core'

export default new Func({
  async handler() {
    return {
      statusCode: 500,
      message: 'business-500-return',
    }
  },
})
