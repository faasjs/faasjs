import { Func, Http } from '@faasjs/core'

export const func = new Func({
  plugins: [new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })],
  async handler({ params }) {
    if (!params.a) throw new Error('[params] a is required.')
  },
})
