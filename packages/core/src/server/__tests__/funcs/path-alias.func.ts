// @ts-nocheck
import { Func, Http } from '@faasjs/core'
import { fromAlias } from '@fixtures/message'
import { fromRelative } from './shared/relative'

const http = new Http()

export const func = new Func({
  plugins: [http],
  async handler() {
    return {
      alias: fromAlias,
      relative: fromRelative,
    }
  },
})
