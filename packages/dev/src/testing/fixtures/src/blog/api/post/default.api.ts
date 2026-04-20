import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'

/**
 * Fixture HTTP API used by testing helpers to verify route loading.
 */
export default new Func({
  plugins: [new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })],
  async handler({ event }) {
    return {
      path: event.path,
    }
  },
})
