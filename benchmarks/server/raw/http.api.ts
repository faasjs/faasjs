import { Func, Http } from '@faasjs/core'

export default new Func({
  plugins: [
    new Http({
      config: {
        cookie: {
          session: {
            key: 'key',
            secret: 'benchmark-secret',
          },
        },
      },
    }),
  ],
  async handler() {
    return 'Hello'
  },
})
