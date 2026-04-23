import { defineApi, HttpError } from '@faasjs/core'

import { AuthPlugin } from '../../../../plugins/auth'

const api = defineApi({
  async handler({ current_user }) {
    if (!current_user)
      throw new HttpError({
        statusCode: 401,
        message: 'Missing demo auth token',
      })

    return {
      current_user,
    }
  },
})

api.plugins.unshift(new AuthPlugin())

export default api
