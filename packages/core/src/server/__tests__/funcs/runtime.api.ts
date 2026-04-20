import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'
import { detectNodeRuntime } from '@faasjs/node-utils'

const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })

export const func = new Func({
  plugins: [http],
  async handler() {
    return {
      exportOrder: 'func',
      runtime: detectNodeRuntime(),
    }
  },
})

export default new Func({
  plugins: [http],
  async handler() {
    return {
      exportOrder: 'default',
      runtime: detectNodeRuntime(),
    }
  },
})
