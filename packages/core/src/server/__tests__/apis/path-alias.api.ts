// @ts-nocheck
import { Func, Http } from '@faasjs/core'

import { fromAlias } from './shared/message'
import { fromRelative } from './shared/relative'

const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })

export default new Func({
  plugins: [http],
  async handler() {
    return {
      alias: fromAlias,
      relative: fromRelative,
    }
  },
})
