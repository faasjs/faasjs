import { Func, Http } from '@faasjs/core'

export default new Func({
  plugins: [new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })],
  async handler({ params }) {
    if (!params.b) throw new Error('[params] b is required.')
  },
})
