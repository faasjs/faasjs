import { Func, Http } from '@faasjs/core'

export const func = new Func({
  plugins: [new Http()],
  async handler({ params }) {
    if (!params.b) throw new Error('[params] b is required.')
  },
})
