import { Func } from '@faasjs/core'

export default new Func({
  async handler() {
    return {
      statusCode: 200,
      body: 'Hello',
    }
  },
})
